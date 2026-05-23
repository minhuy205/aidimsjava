const fs = require('fs');

// Configuration from environment variables
const JIRA_DOMAIN = process.env.JIRA_DOMAIN; // e.g., https://your-domain.atlassian.net
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_TOKEN = process.env.JIRA_TOKEN;
const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY || 'TASK'; // Default Project Key
const REPORT_PATH = process.env.NEWMAN_REPORT_PATH || './newman-report.json';

if (!JIRA_DOMAIN || !JIRA_EMAIL || !JIRA_TOKEN) {
    console.error('❌ Error: Missing Jira configuration in environment variables (JIRA_DOMAIN, JIRA_EMAIL, JIRA_TOKEN).');
    process.exit(1);
}

// Prepare basic auth header
const authHeader = 'Basic ' + Buffer.from(`${JIRA_EMAIL}:${JIRA_TOKEN}`).toString('base64');

/**
 * Helper to call Jira REST API v3
 * @param {string} endpoint 
 * @param {object} options 
 */
async function callJira(endpoint, options = {}) {
    const url = `${JIRA_DOMAIN.replace(/\/$/, '')}/rest/api/3/${endpoint.replace(/^\//, '')}`;
    const response = await fetch(url, {
        ...options,
        headers: {
            'Authorization': authHeader,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...options.headers
        }
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Jira API Error [${response.status}]: ${errText}`);
    }

    return response.status === 204 ? null : await response.json();
}

/**
 * Helper to format Postman Url object to string
 */
function formatUrl(urlObj) {
    if (!urlObj) return '';
    if (typeof urlObj === 'string') return urlObj;
    
    let urlStr = '';
    if (urlObj.protocol) {
        urlStr += urlObj.protocol + '://';
    }
    if (urlObj.host) {
        const host = Array.isArray(urlObj.host) ? urlObj.host.join('.') : urlObj.host;
        urlStr += host;
    }
    if (urlObj.port) {
        urlStr += ':' + urlObj.port;
    }
    if (urlObj.path) {
        const path = Array.isArray(urlObj.path) ? '/' + urlObj.path.join('/') : urlObj.path;
        urlStr += path;
    }
    return urlStr || JSON.stringify(urlObj);
}

async function run() {
    try {
        console.log('🔍 Analyzing Newman test report...');
        
        if (!fs.existsSync(REPORT_PATH)) {
            console.error(`❌ Error: Newman report file not found at: ${REPORT_PATH}`);
            process.exit(1);
        }

        const report = JSON.parse(fs.readFileSync(REPORT_PATH, 'utf8'));
        
        // Extract failures
        const failures = report.run.failures || [];
        const failedCount = report.run.stats.assertions.failed;
        
        console.log(`📊 Stats: Total assertions failed: ${failedCount}. Executed failures length: ${failures.length}.`);

        if (failedCount > 0) {
            console.log('⚠️ Failed assertions detected! Syncing errors to Jira...');

            // Group failures by request to create concise Jira issues
            const failedRequests = {};
            for (const fail of failures) {
                const requestName = fail.source.name || 'Unknown API Request';
                if (!failedRequests[requestName]) {
                    failedRequests[requestName] = [];
                }
                failedRequests[requestName].push(fail);
            }

            for (const [requestName, requestFailures] of Object.entries(failedRequests)) {
                const sampleFail = requestFailures[0];
                const requestMethod = sampleFail.source.request.method || 'GET';
                const requestUrl = sampleFail.source.request.url.raw || 
                                   (typeof sampleFail.source.request.url === 'string' ? sampleFail.source.request.url : formatUrl(sampleFail.source.request.url)) || 
                                   '';
                
                const summary = `[Bug-CI] Failure on API: ${requestMethod} - ${requestName}`;
                
                // 1. Check if an active (non-Done) bug with this summary already exists
                const escapedSummary = summary.replace(/"/g, '\\"');
                const jql = `project = "${JIRA_PROJECT_KEY}" AND summary = "${escapedSummary}" AND status != "Done" AND status != "Resolved"`;
                const searchResult = await callJira(`/search?jql=${encodeURIComponent(jql)}`);

                if (searchResult.issues && searchResult.issues.length > 0) {
                    console.log(`ℹ️ Issue already exists for "${summary}". Skipping creation.`);
                    continue;
                }

                // 2. Format details of all failures for this request
                const failureDetails = requestFailures.map((f, index) => {
                    const testcase = f.error.name || 'Assertion Error';
                    const message = f.error.message || 'Details not available';
                    return `Test #${index + 1}: ${testcase}\nMessage: ${message}\n`;
                }).join('\n');

                // 3. Create issue body in Atlassian Document Format (ADF)
                const issueBody = {
                    fields: {
                        project: { key: JIRA_PROJECT_KEY },
                        summary: summary,
                        description: {
                            type: 'doc',
                            version: 1,
                            content: [
                                {
                                    type: 'paragraph',
                                    content: [
                                        { 
                                            type: 'text', 
                                            text: '🚨 Automated API test failure detected in CI/CD pipeline.\n\n', 
                                            marks: [
                                                { type: 'strong' },
                                                { type: 'textColor', attrs: { color: '#DE350B' } }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    type: 'paragraph',
                                    content: [
                                        { type: 'text', text: `Request Details:\n`, marks: [{ type: 'strong' }] },
                                        { type: 'text', text: `- Method: ${requestMethod}\n` },
                                        { type: 'text', text: `- URL: ${requestUrl}\n\n` },
                                        { type: 'text', text: `Failed Assertions:\n`, marks: [{ type: 'strong' }] },
                                        { type: 'text', text: failureDetails }
                                    ]
                                }
                            ]
                        },
                        issuetype: { name: 'Bug' }
                    }
                };

                console.log(`➕ Creating new Jira bug: "${summary}"`);
                const newIssue = await callJira('/issue', {
                    method: 'POST',
                    body: JSON.stringify(issueBody)
                });
                console.log(`✅ Issue created successfully: ${newIssue.key}`);
            }
        } else {
            console.log('🎉 All API tests passed! Checking if we need to resolve any previously logged Bugs...');

            // Search for active [Bug-CI] issues in Jira to auto-close them
            const jql = `project = "${JIRA_PROJECT_KEY}" AND summary ~ "Bug-CI" AND status != "Done" AND status != "Resolved"`;
            const openBugs = await callJira(`/search?jql=${encodeURIComponent(jql)}`);

            if (openBugs.issues && openBugs.issues.length > 0) {
                console.log(`🧹 Found ${openBugs.issues.length} active CI-triggered bugs. Closing them...`);

                for (const issue of openBugs.issues) {
                    console.log(`🔧 Transitioning ${issue.key} to "Done"...`);
                    
                    // Fetch available transitions for this issue
                    const transitionsData = await callJira(`/issue/${issue.key}/transitions`);
                    const doneTransition = transitionsData.transitions.find(t => 
                        t.name.toLowerCase() === 'done' || t.name.toLowerCase() === 'resolved' || t.name.toLowerCase() === 'close' || t.name.toLowerCase() === 'closed'
                    );

                    if (doneTransition) {
                        // Apply transition
                        await callJira(`/issue/${issue.key}/transitions`, {
                            method: 'POST',
                            body: JSON.stringify({
                                transition: { id: doneTransition.id }
                            })
                        });

                        // Add a resolution comment
                        const commentBody = {
                            body: {
                                type: 'doc',
                                version: 1,
                                content: [{
                                    type: 'paragraph',
                                    content: [{
                                        type: 'text',
                                        text: '✅ CI/CD update: All API tests have successfully passed. This automated issue has been resolved.'
                                    }]
                                }]
                            }
                        };
                        await callJira(`/issue/${issue.key}/comment`, {
                            method: 'POST',
                            body: JSON.stringify(commentBody)
                        });

                        console.log(`💾 Issue ${issue.key} has been resolved and closed.`);
                    } else {
                        console.warn(`⚠️ Warning: Could not find a suitable 'Done/Resolved' transition for issue ${issue.key}`);
                    }
                }
            } else {
                console.log('✅ No active CI bugs found. Clean run.');
            }
        }
    } catch (error) {
        console.error('❌ Automation Script Failed:', error.message);
        process.exit(1);
    }
}

run();
