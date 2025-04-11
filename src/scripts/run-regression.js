
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Parse command line arguments
const args = process.argv.slice(2);
const generateReport = args.includes('--report');
const componentOnly = args.includes('--component-only');
const e2eOnly = args.includes('--e2e-only');

// Configuration
const outputDir = path.join(process.cwd(), 'test-results');
const reportDir = path.join(outputDir, 'report');
const timestamp = new Date().toISOString().replace(/:/g, '-');
const reportFile = path.join(reportDir, `regression-${timestamp}.html`);

// Ensure output directories exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}

console.log('\n🧪 Starting regression tests');
console.log('===============================\n');

let exitCode = 0;
const results = {
  component: { passed: true, output: '' },
  e2e: { passed: true, output: '' }
};

// Run component tests
if (!e2eOnly) {
  console.log('📦 Running component tests...');
  try {
    results.component.output = execSync('npx vitest run', { encoding: 'utf8' });
    console.log('✅ Component tests passed!');
  } catch (error) {
    results.component.passed = false;
    results.component.output = error.stdout;
    console.error('❌ Component tests failed!');
    exitCode = 1;
  }
}

// Run e2e tests
if (!componentOnly) {
  console.log('\n🌐 Running E2E tests...');
  try {
    const cypressCommand = 'npx cypress run';
    results.e2e.output = execSync(cypressCommand, { encoding: 'utf8' });
    console.log('✅ E2E tests passed!');
  } catch (error) {
    results.e2e.passed = false;
    results.e2e.output = error.stdout;
    console.error('❌ E2E tests failed!');
    exitCode = 1;
  }
}

// Generate HTML report if requested
if (generateReport) {
  console.log('\n📊 Generating HTML report...');
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Regression Test Report - ${new Date().toLocaleString()}</title>
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
        h1, h2, h3 { color: #333; }
        .summary { display: flex; gap: 20px; margin-bottom: 20px; }
        .summary-item { padding: 15px; border-radius: 5px; flex: 1; }
        .pass { background-color: #d4edda; color: #155724; }
        .fail { background-color: #f8d7da; color: #721c24; }
        .test-output { background-color: #f8f9fa; padding: 15px; border-radius: 5px; overflow-x: auto; margin-bottom: 30px; }
        pre { white-space: pre-wrap; margin: 0; }
        .timestamp { color: #6c757d; font-style: italic; }
      </style>
    </head>
    <body>
      <h1>Regression Test Report</h1>
      <p class="timestamp">Generated on: ${new Date().toLocaleString()}</p>
      
      <div class="summary">
        <div class="summary-item ${results.component.passed ? 'pass' : 'fail'}">
          <h2>Component Tests: ${results.component.passed ? 'PASSED' : 'FAILED'}</h2>
        </div>
        <div class="summary-item ${results.e2e.passed ? 'pass' : 'fail'}">
          <h2>E2E Tests: ${results.e2e.passed ? 'PASSED' : 'FAILED'}</h2>
        </div>
      </div>
      
      <h2>Component Test Results</h2>
      <div class="test-output">
        <pre>${results.component.output}</pre>
      </div>
      
      <h2>E2E Test Results</h2>
      <div class="test-output">
        <pre>${results.e2e.output}</pre>
      </div>
    </body>
    </html>
  `;
  
  fs.writeFileSync(reportFile, html);
  console.log(`📄 Report saved to: ${reportFile}`);
  
  // Try to open the report in the default browser
  try {
    let command;
    switch (os.platform()) {
      case 'darwin': command = `open "${reportFile}"`; break;
      case 'win32': command = `start "" "${reportFile}"`; break;
      default: command = `xdg-open "${reportFile}"`; break;
    }
    execSync(command);
  } catch (error) {
    console.log('Note: Could not automatically open the report.');
  }
}

console.log('\n===============================');
console.log(`🏁 Regression tests ${exitCode === 0 ? 'PASSED' : 'FAILED'}`);
console.log('===============================\n');

process.exit(exitCode);
