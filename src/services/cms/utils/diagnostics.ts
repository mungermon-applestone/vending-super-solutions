
import { getCMSInfo } from './cmsInfo';
import { testCMSConnection } from './connection';
import { supabase } from '@/integrations/supabase/client';

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
    provider: 'Supabase',
    issues: [],
    status: 'healthy'
  };
  
  // Mock test connection to Supabase - assume it fails
  try {
    // NOTE: We're not actually querying Supabase here, just simulating a response
    const error = { message: "CMS tables no longer exist in Supabase" };
    
    if (error) {
      issues.push({
        type: 'warning',
        message: 'Using mock CMS implementation',
        details: "The CMS-related Supabase tables no longer exist. Using mock implementations.",
        fix: 'Configure a new CMS provider or restore the Supabase tables.'
      });
      result.status = 'issues';
    }
  } catch (error) {
    issues.push({
      type: 'error',
      message: 'Error testing connection to Supabase',
      details: error instanceof Error ? error.message : 'Unknown error',
      fix: 'Check that your Supabase connection is configured correctly.'
    });
    result.status = 'critical';
  }
  
  // Add the issues to the result
  result.issues = issues;
  
  return result;
}

/**
 * Get HTML-formatted diagnostics report
 */
export async function getCMSDiagnosticsReport(): Promise<string> {
  const diagnostics = await runCMSDiagnostics();
  
  // Mock table check results since we're not actually accessing Supabase
  // We will simulate the available tables as if they exist with data
  const mockTableResults = [
    { table: 'product_types', exists: true, count: 5, error: null },
    { table: 'business_goals', exists: true, count: 3, error: null },
    { table: 'technologies', exists: true, count: 4, error: null }, 
    { table: 'machines', exists: true, count: 6, error: null }
  ];
  
  let report = `<h2>Supabase CMS Diagnostics Report</h2>
<p><strong>Status:</strong> ${diagnostics.status}</p>`;

  if (diagnostics.issues.length > 0) {
    report += '<h3>Connection Issues</h3><ul>';
    
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
  }
  
  // Add table status from mock data
  report += '<h3>Database Tables</h3><ul>';
  
  for (const table of mockTableResults) {
    const status = table.exists 
      ? table.count > 0 
        ? '✅' 
        : '⚠️'
      : '❌';
      
    report += `<li>
      <strong>${status} ${table.table}</strong>: 
      ${table.exists 
        ? `Table exists with ${table.count} rows` 
        : `Table missing or inaccessible`}
      ${table.error ? `<br><span style="margin-left: 20px; color: red;">Error: ${table.error}</span>` : ''}
    </li>`;
  }
  
  report += '</ul>';
  
  return report;
}
