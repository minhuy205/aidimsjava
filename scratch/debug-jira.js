const fs = require('fs');
const path = require('path');

// Load env
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

const JIRA_DOMAIN = cleanSecret(process.env.JIRA_DOMAIN);
const JIRA_EMAIL = cleanSecret(process.env.JIRA_EMAIL);
const JIRA_TOKEN = cleanSecret(process.env.JIRA_TOKEN);
const JIRA_PROJECT_KEY = cleanSecret(process.env.JIRA_PROJECT_KEY || 'KAN');

const authHeader = 'Basic ' + Buffer.from(`${JIRA_EMAIL}:${JIRA_TOKEN}`).toString('base64');

async function callJira(endpoint) {
    const url = `${JIRA_DOMAIN.replace(/\/$/, '')}/rest/api/3/${endpoint.replace(/^\//, '')}`;
    const response = await fetch(url, {
        headers: {
            'Authorization': authHeader,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });
    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Jira API Error [${response.status}]: ${errText}`);
    }
    return await response.json();
}

async function debug() {
    try {
        console.log('Fetching active bugs...');
        const searchJql = `project = "${JIRA_PROJECT_KEY}" AND summary ~ "Bug-CI" AND status != "Done" AND status != "Resolved"`;
        const searchResult = await callJira(`/search/jql?jql=${encodeURIComponent(searchJql)}&maxResults=10`);
        const activeBugs = searchResult.issues || [];
        console.log(`Fetched ${activeBugs.length} issues.`);
        for (const bug of activeBugs) {
            console.log(`- Key: ${bug.key}`);
            console.log(`  Summary: "${bug.fields.summary}"`);
        }
    } catch (e) {
        console.error(e);
    }
}

debug();
