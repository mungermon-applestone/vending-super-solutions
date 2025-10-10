import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SupportRequestData {
  subject: string;
  description: string;
  email: string;
  context?: {
    articleTitle?: string;
    articleSlug?: string;
    pageUrl?: string;
  };
  attachment?: {
    fileName: string;
    fileSize: number;
    fileType: string;
    base64Data: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }

  try {
    console.log('Support request function called');
    
    const requestData: SupportRequestData = await req.json();
    console.log('Request data received:', JSON.stringify(requestData, null, 2));

    // Validate required fields
    if (!requestData.subject?.trim() || !requestData.description?.trim()) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Subject and description are required' 
        }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    // Get Jira configuration from environment
    const jiraDomain = Deno.env.get('JIRA_DOMAIN');
    const jiraEmail = Deno.env.get('JIRA_USER_EMAIL');
    const jiraToken = Deno.env.get('JIRA_API_TOKEN');
    const jiraProjectKey = Deno.env.get('JIRA_PROJECT_KEY');
    const jiraRequestTypeId = Deno.env.get('JIRA_REQUEST_TYPE_ID');

    if (!jiraDomain || !jiraEmail || !jiraToken || !jiraProjectKey) {
      console.error('Missing Jira configuration');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Jira service configuration error' 
        }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    // Build Jira issue description
    let description = requestData.description + '\n\n';
    description += `*Contact Email:* ${requestData.email || 'Not provided'}\n\n`;
    
    if (requestData.context) {
      description += '*Context Information:*\n';
      if (requestData.context.articleTitle) {
        description += `- Article: ${requestData.context.articleTitle}\n`;
      }
      if (requestData.context.articleSlug) {
        description += `- Article Slug: ${requestData.context.articleSlug}\n`;
      }
      if (requestData.context.pageUrl) {
        description += `- Page URL: ${requestData.context.pageUrl}\n`;
      }
      description += '\n';
    }

    description += `---\n`;
    description += `Request submitted: ${new Date().toISOString()}`;
    
    if (requestData.attachment) {
      description += `\nAttachment: ${requestData.attachment.fileName} (${Math.round(requestData.attachment.fileSize / 1024)}KB)`;
    }

    // Create Basic Auth header
    const authString = btoa(`${jiraEmail}:${jiraToken}`);
    const authHeader = `Basic ${authString}`;

    // Build Jira issue payload
    const issuePayload: any = {
      fields: {
        project: {
          key: jiraProjectKey
        },
        summary: requestData.subject,
        description: description,
        issuetype: {
          name: 'Task'
        }
      }
    };

    // Add request type if using Jira Service Management
    if (jiraRequestTypeId) {
      issuePayload.fields.customfield_10010 = jiraRequestTypeId; // JSM request type field
    }

    console.log('Creating Jira issue with payload:', JSON.stringify(issuePayload, null, 2));

    // Create Jira issue
    const createIssueResponse = await fetch(
      `https://${jiraDomain}/rest/api/3/issue`,
      {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(issuePayload)
      }
    );

    const responseText = await createIssueResponse.text();
    console.log('Jira API response status:', createIssueResponse.status);
    console.log('Jira API response:', responseText);

    if (!createIssueResponse.ok) {
      throw new Error(`Jira API error (${createIssueResponse.status}): ${responseText}`);
    }

    const issueData = JSON.parse(responseText);
    const issueKey = issueData.key;
    const issueId = issueData.id;
    
    console.log(`Jira issue created successfully: ${issueKey}`);

    // Upload attachment if present
    if (requestData.attachment && issueKey) {
      try {
        console.log(`Uploading attachment to issue ${issueKey}...`);
        
        // Convert base64 to binary
        const binaryData = Uint8Array.from(atob(requestData.attachment.base64Data), c => c.charCodeAt(0));
        
        // Create form data for attachment
        const formData = new FormData();
        const blob = new Blob([binaryData], { type: requestData.attachment.fileType });
        formData.append('file', blob, requestData.attachment.fileName);

        const attachmentResponse = await fetch(
          `https://${jiraDomain}/rest/api/3/issue/${issueKey}/attachments`,
          {
            method: 'POST',
            headers: {
              'Authorization': authHeader,
              'X-Atlassian-Token': 'no-check'
            },
            body: formData
          }
        );

        if (attachmentResponse.ok) {
          console.log('Attachment uploaded successfully');
        } else {
          const attachmentError = await attachmentResponse.text();
          console.error('Failed to upload attachment:', attachmentError);
          // Don't fail the whole request if attachment upload fails
        }
      } catch (attachmentError) {
        console.error('Error uploading attachment:', attachmentError);
        // Don't fail the whole request if attachment upload fails
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Support request submitted successfully',
        issueKey: issueKey,
        issueUrl: `https://${jiraDomain}/browse/${issueKey}`
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );

  } catch (error) {
    console.error('Error in send-support-request function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
});
