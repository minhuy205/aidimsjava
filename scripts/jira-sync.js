const fs = require('fs');
const path = require('path');

// Load environment variables from .env file if it exists
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
    const dotenvText = fs.readFileSync(envPath, 'utf8');
    dotenvText.split(/\r?\n/).forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('#')) {
            const match = trimmedLine.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
            if (match) {
                const key = match[1];
                let value = match[2] || '';
                // Remove quotes if present
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.substring(1, value.length - 1);
                }
                process.env[key] = value.trim();
            }
        }
    });
}

function cleanSecret(val) {
    if (!val) return '';
    let s = val.trim();
    if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
        s = s.substring(1, s.length - 1).trim();
    }
    return s;
}

// Configuration from environment variables
const JIRA_DOMAIN = cleanSecret(process.env.JIRA_DOMAIN); // e.g., https://your-domain.atlassian.net
const JIRA_EMAIL = cleanSecret(process.env.JIRA_EMAIL);
const JIRA_TOKEN = cleanSecret(process.env.JIRA_TOKEN);
const JIRA_PROJECT_KEY = cleanSecret(process.env.JIRA_PROJECT_KEY || 'KAN'); // Default Project Key
const REPORT_PATH = cleanSecret(process.env.NEWMAN_REPORT_PATH || './newman-report.json');

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
        console.log(` Verifying connection to Jira project "${JIRA_PROJECT_KEY}"...`);
        try {
            const projectInfo = await callJira(`/project/${JIRA_PROJECT_KEY}`);
            console.log(`✅ Successfully connected to Jira Project: ${projectInfo.name} (${projectInfo.key})`);
        } catch (err) {
            console.error(` Project verification failed: ${err.message}`);
        }

        console.log('🔍 Analyzing Newman test report...');

        if (!fs.existsSync(REPORT_PATH)) {
            console.error(` Error: Newman report file not found at: ${REPORT_PATH}`);
            process.exit(1);
        }

        const report = JSON.parse(fs.readFileSync(REPORT_PATH, 'utf8'));
        const failures = report.run.failures || [];
        const failedCount = report.run.stats.assertions.failed;

        console.log(` Stats: Total assertions failed: ${failedCount}. Executed failures length: ${failures.length}.`);

        // 1. Fetch all active bugs from Jira once using standard /search/jql endpoint and filter by [Bug-CI] in JavaScript
        console.log('🔍 Fetching active bugs from Jira...');
        const searchJql = `project = "${JIRA_PROJECT_KEY}" AND status != "Done" AND status != "Resolved"`;
        const searchResult = await callJira(`/search/jql?jql=${encodeURIComponent(searchJql)}&maxResults=100&fields=summary,status`);
        const allActiveBugs = searchResult.issues || [];
        
        // Filter bugs starting with [Bug-CI] in JavaScript to avoid JQL tokenization/lucene matching limitations
        const activeBugs = allActiveBugs.filter(bug => 
            bug && bug.fields && bug.fields.summary && bug.fields.summary.startsWith('[Bug-CI]')
        );
        console.log(` Found ${activeBugs.length} active CI-triggered bugs in Jira.`);

        // Build active bug map: summary -> bug object
        const activeBugMap = {};
        for (const bug of activeBugs) {
            activeBugMap[bug.fields.summary] = bug;
        }



        const currentFailedSummaries = new Set();
        const failedRequests = {};

        if (failedCount > 0) {
            console.log(' Failed assertions detected! Syncing errors to Jira...');

            // Group failures by request
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
                const summary = `[Bug-CI] Failure on API: ${requestMethod} - ${requestName}`;
                currentFailedSummaries.add(summary);

                const requestUrl = sampleFail.source.request.url.raw ||
                    (typeof sampleFail.source.request.url === 'string' ? sampleFail.source.request.url : formatUrl(sampleFail.source.request.url)) ||
                    '';

                // Check if bug already exists in our active bug map (bypassing JQL full-text matching limitations)
                if (activeBugMap[summary]) {
                    console.log(`ℹ️ Issue already exists for "${summary}". Skipping creation.`);
                    continue;
                }

                // Format details of all failures for this request
                const failureDetails = requestFailures.map((f, index) => {
                    const testcase = f.error.name || 'Assertion Error';
                    const message = f.error.message || 'Details not available';
                    return `Test #${index + 1}: ${testcase}\nMessage: ${message}\n`;
                }).join('\n');

                // Create issue body in Atlassian Document Format (ADF)
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
                                            text: ' Automated API test failure detected in CI/CD pipeline.\n\n',
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

                console.log(` Creating new Jira bug: "${summary}"`);
                const newIssue = await callJira('/issue', {
                    method: 'POST',
                    body: JSON.stringify(issueBody)
                });
                console.log(` Issue created successfully: ${newIssue.key}`);
            }
        } else {
            console.log(' All API tests passed!');
        }

        // 2. Check and close resolved bugs
        console.log('🔍 Checking if we need to resolve any previously logged Bugs on Jira...');
        if (activeBugs.length > 0) {
            for (const issue of activeBugs) {
                if (issue && issue.fields && issue.fields.summary) {
                    const bugSummary = issue.fields.summary;

                    // If the bug's summary is NOT in the current failed summaries, it means the API test passed in this run
                    if (!currentFailedSummaries.has(bugSummary)) {
                        console.log(`🔧 Resolving ${issue.key} ("${bugSummary}") as it passed in this run...`);

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
                                            text: '✅ CI/CD update: This specific API test has successfully passed in the latest run. This automated issue has been resolved.'
                                        }]
                                    }]
                                }
                            };
                            await callJira(`/issue/${issue.key}/comment`, {
                                method: 'POST',
                                body: JSON.stringify(commentBody)
                            });

                            console.log(` Issue ${issue.key} has been resolved and closed.`);
                        } else {
                            console.warn(` Warning: Could not find a suitable 'Done/Resolved' transition for issue ${issue.key}`);
                        }
                    } else {
                        console.log(` Bug ${issue.key} is still failing. Keeping it open.`);
                    }
                }
            }
        } else {
            console.log('✅ No active CI bugs found on Jira. Clean run.');
        }
    } catch (error) {
        console.error('❌ Automation Script Failed:', error.message);
        process.exit(1);
    }
}

run();
