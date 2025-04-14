
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
  
  // Test connection to Supabase
  try {
    const { data, error } = await supabase.from('product_types').select('count').limit(1);
    
    if (error) {
      issues.push({
        type: 'error',
        message: 'Failed to connect to Supabase',
        details: error.message,
        fix: 'Check your Supabase connection configuration and ensure the service is running.'
      });
      result.status = 'critical';
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
  
  // Check major tables
  const tables = ['product_types', 'business_goals', 'technologies', 'machines'];
  const tableResults = await Promise.all(tables.map(async table => {
    try {
      const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
      return { 
        table, 
        exists: !error, 
        count: count || 0,
        error: error?.message
      };
    } catch (err) {
      return { 
        table, 
        exists: false, 
        count: 0,
        error: err instanceof Error ? err.message : 'Unknown error'
      };
    }
  }));
  
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
  
  // Add table status
  report += '<h3>Database Tables</h3><ul>';
  
  for (const table of tableResults) {
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
