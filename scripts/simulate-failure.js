const fs = require('fs');
const { execSync } = require('child_process');

console.log('🤖 Simulating a Postman Test Failure...');

// 1. Create a mock failed Newman report
const mockFailedReport = {
  run: {
    stats: {
      assertions: {
        failed: 1
      }
    },
    failures: [
      {
        error: {
          name: "AssertionError",
          message: "expected response status code 200 but got 500 Internal Server Error"
        },
        source: {
          name: "User Login Authentication Test",
          request: {
            method: "POST",
            url: "http://localhost:8080/api/auth/login"
          }
        }
      }
    ]
  }
};

fs.writeFileSync('./newman-report.json', JSON.stringify(mockFailedReport, null, 2), 'utf8');
console.log('📝 Created mock failed report at ./newman-report.json');

// 2. Run the sync script
try {
  console.log('🚀 Triggering Jira sync script...');
  execSync('node ./scripts/jira-sync.js', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Sync script failed to execute:', error.message);
}
