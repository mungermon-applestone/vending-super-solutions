
import { getCMSInfo } from './cmsInfo';
import { testCMSConnection } from './connection';

export interface CMSDiagnosticsResult {
  provider: string;
  issues: Array<{
    type: 'error' | 'warning' | 'info';
    message: string;
    details?: string;
    fix?: string;
  }>;
  status: 'healthy' | 'issues' | 'critical';
}

/**
 * Run diagnostics on CMS configuration
 * @returns Diagnostics result with any issues found
 */
export async function runCMSDiagnostics(): Promise<CMSDiagnosticsResult> {
  const info = getCMSInfo();
  const issues: CMSDiagnosticsResult['issues'] = [];
  
  // Initialize the result
  const result: CMSDiagnosticsResult = {
    provider: info.provider,
    issues: [],
    status: 'healthy'
  };
  
  // Check for Strapi-specific issues
  if (info.provider === 'Strapi') {
    // Check if API URL is configured
    if (!info.apiUrl) {
      issues.push({
        type: 'error',
        message: 'Strapi API URL not configured',
        details: 'The Strapi API URL is required for connecting to the Strapi CMS.',
        fix: 'Set the VITE_STRAPI_API_URL environment variable or configure it in the Settings page.'
      });
      result.status = 'critical';
    }
    
    // Check if API key is configured
    if (!info.apiKeyConfigured) {
      issues.push({
        type: 'warning',
        message: 'Strapi API key not configured',
        details: 'The API key is recommended for authenticating with the Strapi API.',
        fix: 'Set the VITE_STRAPI_API_KEY environment variable or configure it in the Settings page.'
      });
      
      if (result.status !== 'critical') {
        result.status = 'issues';
      }
    }
    
    // Test the connection
    if (info.apiUrl) {
      try {
        const connectionTest = await testCMSConnection();
        
        if (!connectionTest.success) {
          issues.push({
            type: 'error',
            message: 'Failed to connect to Strapi API',
            details: connectionTest.message,
            fix: 'Check that your Strapi server is running and the API URL is correct.'
          });
          result.status = 'critical';
        }
      } catch (error) {
        issues.push({
          type: 'error',
          message: 'Error testing connection to Strapi API',
          details: error instanceof Error ? error.message : 'Unknown error',
          fix: 'Check that your Strapi server is running and the API URL is correct.'
        });
        result.status = 'critical';
      }
    }
  }
  
  // No specific checks for Supabase yet, as it's configured by default
  
  // Add the issues to the result
  result.issues = issues;
  
  return result;
}

/**
 * Get HTML-formatted diagnostics report
 */
export async function getCMSDiagnosticsReport(): Promise<string> {
  const diagnostics = await runCMSDiagnostics();
  
  let report = `<h2>CMS Diagnostics Report</h2>
<p><strong>Provider:</strong> ${diagnostics.provider}</p>
<p><strong>Status:</strong> ${diagnostics.status}</p>`;

  if (diagnostics.issues.length > 0) {
    report += '<h3>Issues</h3><ul>';
    
    for (const issue of diagnostics.issues) {
      const icon = issue.type === 'error' ? '❌' : 
                   issue.type === 'warning' ? '⚠️' : 'ℹ️';
                   
      report += `<li><strong>${icon} ${issue.message}</strong>`;
      
      if (issue.details) {
        report += `<br><span style="margin-left: 20px;">${issue.details}</span>`;
      }
      
      if (issue.fix) {
        report += `<br><span style="margin-left: 20px;"><em>Fix: ${issue.fix}</em></span>`;
      }
      
      report += '</li>';
    }
    
    report += '</ul>';
  } else {
    report += '<p>No issues detected.</p>';
  }
  
  return report;
}
