const fs = require('fs');
const { execSync } = require('child_process');

console.log('🤖 Simulating a Postman Test Success (All Pass)...');

// 1. Create a mock successful Newman report
const mockSuccessReport = {
  run: {
    stats: {
      assertions: {
        failed: 0
      }
    },
    failures: []
  }
};

fs.writeFileSync('./newman-report.json', JSON.stringify(mockSuccessReport, null, 2), 'utf8');
console.log('📝 Created mock success report at ./newman-report.json');

// 2. Run the sync script
try {
  console.log('🚀 Triggering Jira sync script...');
  execSync('node ./scripts/jira-sync.js', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Sync script failed to execute:', error.message);
}
