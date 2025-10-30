import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SupportRequestData {
  firstName: string;
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
    if (!requestData.firstName?.trim() || !requestData.subject?.trim() || !requestData.description?.trim()) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'First name, subject, and description are required' 
        }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    // Get Jira configuration from environment
    let jiraDomain = Deno.env.get('JIRA_DOMAIN');
    const jiraEmail = Deno.env.get('JIRA_USER_EMAIL');
    const jiraToken = Deno.env.get('JIRA_API_TOKEN');
    const jiraServiceDeskId = Deno.env.get('JIRA_SERVICE_DESK_ID');
    const jiraRequestTypeId = Deno.env.get('JIRA_REQUEST_TYPE_ID');

    if (!jiraDomain || !jiraEmail || !jiraToken || !jiraServiceDeskId || !jiraRequestTypeId) {
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

    // Normalize domain - remove protocol and trailing slashes
    jiraDomain = jiraDomain.replace(/^https?:\/\//, '').replace(/\/+$/, '');
    console.log('Normalized Jira domain:', jiraDomain);
    console.log('Using JSM config:', { 
      serviceDeskId: jiraServiceDeskId, 
      requestTypeId: jiraRequestTypeId 
    });

    // Helper function to build plain text description for JSM
    const buildDescription = (data: SupportRequestData) => {
      let description = data.description + '\n\n';
      description += 'Contact Information:\n';
      description += `- Name: ${data.firstName}\n`;
      description += `- Email: ${data.email || 'Not provided'}\n\n`;
      
      if (data.context) {
        description += 'Context Information:\n';
        if (data.context.articleTitle) {
          description += `- Article: ${data.context.articleTitle}\n`;
        }
        if (data.context.articleSlug) {
          description += `- Article Slug: ${data.context.articleSlug}\n`;
        }
        if (data.context.pageUrl) {
          description += `- Page URL: ${data.context.pageUrl}\n`;
        }
        description += '\n';
      }

      description += `---\n`;
      description += `Request submitted: ${new Date().toISOString()}`;
      
      if (data.attachment) {
        description += `\nAttachment: ${data.attachment.fileName} (${Math.round(data.attachment.fileSize / 1024)}KB)`;
      }

      return description;
    };

    // Create Basic Auth header
    const authString = btoa(`${jiraEmail}:${jiraToken}`);
    const authHeader = `Basic ${authString}`;

    // Build JSM request payload
    const requestPayload = {
      serviceDeskId: jiraServiceDeskId,
      requestTypeId: jiraRequestTypeId,
      requestFieldValues: {
        summary: requestData.subject,
        description: buildDescription(requestData)
      },
      raiseOnBehalfOf: requestData.email
    };

    console.log('Creating JSM request with payload:', JSON.stringify(requestPayload, null, 2));

    // Create JSM request using Service Management API
    const createRequestResponse = await fetch(
      `https://${jiraDomain}/rest/servicedeskapi/request`,
      {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestPayload)
      }
    );

    const responseText = await createRequestResponse.text();
    console.log('JSM API response status:', createRequestResponse.status);
    console.log('JSM API response:', responseText);

    if (!createRequestResponse.ok) {
      // Parse error to check if it's a request type issue
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { errorMessage: responseText };
      }

      // Check if this is a "request type not found" error
      const isRequestTypeError = 
        createRequestResponse.status === 400 && 
        (errorData.i18nErrorMessage?.i18nKey === 'sd.customerview.error.requestTypeNotFound' ||
         errorData.errorMessage?.includes('request type'));

      if (isRequestTypeError) {
        console.log('Request type not found. Fetching available request types...');
        
        // Fetch available request types for this service desk
        try {
          const requestTypesResponse = await fetch(
            `https://${jiraDomain}/rest/servicedeskapi/servicedesk/${jiraServiceDeskId}/requesttype`,
            {
              method: 'GET',
              headers: {
                'Authorization': authHeader,
                'Accept': 'application/json'
              }
            }
          );

          if (requestTypesResponse.ok) {
            const requestTypesData = await requestTypesResponse.json();
            const availableTypes = requestTypesData.values?.map((rt: any) => ({
              id: rt.id,
              name: rt.name
            })) || [];
            
            console.log('Available request types:', JSON.stringify(availableTypes, null, 2));
            
            return new Response(
              JSON.stringify({ 
                success: false, 
                error: `Request type "${jiraRequestTypeId}" not found. Please update JIRA_REQUEST_TYPE_ID to one of the available IDs.`,
                requestTypes: availableTypes
              }),
              { 
                status: 200, 
                headers: { 'Content-Type': 'application/json', ...corsHeaders } 
              }
            );
          }
        } catch (rtError) {
          console.error('Failed to fetch request types:', rtError);
        }
      }

      // Return error with details but don't throw (return 200 so client can read error)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Jira API error (${createRequestResponse.status}): ${errorData.errorMessage || responseText}`
        }),
        { 
          status: 200, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    const requestData_response = JSON.parse(responseText);
    const issueKey = requestData_response.issueKey;
    const issueId = requestData_response.issueId;
    
    console.log(`JSM request created successfully: ${issueKey} (ID: ${issueId})`);

    // Upload attachment if present
    if (requestData.attachment && issueId) {
      try {
        console.log(`Uploading attachment to issue ${issueKey} (${issueId})...`);
        
        // Convert base64 to binary
        const binaryData = Uint8Array.from(atob(requestData.attachment.base64Data), c => c.charCodeAt(0));
        
        // Create form data for attachment
        const formData = new FormData();
        const blob = new Blob([binaryData], { type: requestData.attachment.fileType });
        formData.append('file', blob, requestData.attachment.fileName);

        const attachmentResponse = await fetch(
          `https://${jiraDomain}/rest/api/2/issue/${issueKey}/attachments`,
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
        issueId: issueId,
        issueKey: issueKey
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
