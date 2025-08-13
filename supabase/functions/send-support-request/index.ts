import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SESClient, SendEmailCommand } from "https://esm.sh/@aws-sdk/client-ses@3.554.0";

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

    // Get AWS SES configuration from environment
    const awsAccessKeyId = Deno.env.get('AWS_ACCESS_KEY_ID');
    const awsSecretAccessKey = Deno.env.get('AWS_SECRET_ACCESS_KEY');
    const awsRegion = Deno.env.get('AWS_REGION');
    const fromEmail = Deno.env.get('SES_FROM_EMAIL');
    const supportEmail = 'support@applestonesolutions.com';

    if (!awsAccessKeyId || !awsSecretAccessKey || !awsRegion || !fromEmail) {
      console.error('Missing AWS SES configuration');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Email service configuration error' 
        }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    // Initialize AWS SES client
    const sesClient = new SESClient({
      region: awsRegion,
      credentials: {
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey,
      },
    });

    // Build email content
    let emailText = `Support Request Details:\n\n`;
    emailText += `Subject: ${requestData.subject}\n\n`;
    emailText += `Description:\n${requestData.description}\n\n`;
    emailText += `Contact Email: ${requestData.email || 'Not provided'}\n\n`;
    
    if (requestData.context) {
      emailText += `Context Information:\n`;
      if (requestData.context.articleTitle) {
        emailText += `- Article: ${requestData.context.articleTitle}\n`;
      }
      if (requestData.context.articleSlug) {
        emailText += `- Article Slug: ${requestData.context.articleSlug}\n`;
      }
      if (requestData.context.pageUrl) {
        emailText += `- Page URL: ${requestData.context.pageUrl}\n`;
      }
      emailText += `\n`;
    }

    emailText += `---\n`;
    emailText += `Request submitted: ${new Date().toISOString()}\n`;
    
    if (requestData.attachment) {
      emailText += `Attachment: ${requestData.attachment.fileName} (${Math.round(requestData.attachment.fileSize / 1024)}KB)\n`;
    }

    // Build HTML email content
    let emailHtml = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>Support Request</h2>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3 style="margin-top: 0;">Subject: ${requestData.subject}</h3>
            <p><strong>Description:</strong></p>
            <p style="white-space: pre-wrap;">${requestData.description}</p>
            <p><strong>Contact Email:</strong> ${requestData.email || 'Not provided'}</p>
          </div>
    `;

    if (requestData.context) {
      emailHtml += `
        <div style="background-color: #e8f4fd; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <h4 style="margin-top: 0;">Context Information</h4>
      `;
      if (requestData.context.articleTitle) {
        emailHtml += `<p><strong>Article:</strong> ${requestData.context.articleTitle}</p>`;
      }
      if (requestData.context.articleSlug) {
        emailHtml += `<p><strong>Article Slug:</strong> ${requestData.context.articleSlug}</p>`;
      }
      if (requestData.context.pageUrl) {
        emailHtml += `<p><strong>Page URL:</strong> <a href="${requestData.context.pageUrl}">${requestData.context.pageUrl}</a></p>`;
      }
      emailHtml += `</div>`;
    }

    if (requestData.attachment) {
      emailHtml += `
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <h4 style="margin-top: 0;">Attachment</h4>
          <p><strong>File:</strong> ${requestData.attachment.fileName}</p>
          <p><strong>Size:</strong> ${Math.round(requestData.attachment.fileSize / 1024)}KB</p>
          <p><strong>Type:</strong> ${requestData.attachment.fileType}</p>
        </div>
      `;
    }

    emailHtml += `
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            Request submitted: ${new Date().toLocaleString()}<br>
            This is an automated message from the support request system.
          </p>
        </body>
      </html>
    `;

    // Prepare email parameters
    const emailParams = {
      Source: fromEmail,
      Destination: {
        ToAddresses: [supportEmail],
      },
      Message: {
        Subject: {
          Data: `Support Request: ${requestData.subject}`,
        },
        Body: {
          Text: {
            Data: emailText,
          },
          Html: {
            Data: emailHtml,
          },
        },
      },
    };

    // Add attachment if present
    if (requestData.attachment) {
      const attachmentData = `Content-Type: ${requestData.attachment.fileType}; name="${requestData.attachment.fileName}"\nContent-Transfer-Encoding: base64\nContent-Disposition: attachment; filename="${requestData.attachment.fileName}"\n\n${requestData.attachment.base64Data}`;
      
      // For SES with attachments, we need to use raw email format
      const boundary = `boundary-${Date.now()}`;
      const rawMessage = `Subject: Support Request: ${requestData.subject}
From: ${fromEmail}
To: ${supportEmail}
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="${boundary}"

--${boundary}
Content-Type: multipart/alternative; boundary="alt-${boundary}"

--alt-${boundary}
Content-Type: text/plain; charset=UTF-8

${emailText}

--alt-${boundary}
Content-Type: text/html; charset=UTF-8

${emailHtml}

--alt-${boundary}--

--${boundary}
${attachmentData}

--${boundary}--`;

      const rawEmailParams = {
        Source: fromEmail,
        Destinations: [supportEmail],
        RawMessage: {
          Data: new TextEncoder().encode(rawMessage),
        },
      };

      const sendRawEmailCommand = new (await import("https://esm.sh/@aws-sdk/client-ses@3.554.0")).SendRawEmailCommand(rawEmailParams);
      const response = await sesClient.send(sendRawEmailCommand);
      console.log('Email sent successfully with attachment:', response);
    } else {
      // Send regular email without attachment
      const sendEmailCommand = new SendEmailCommand(emailParams);
      const response = await sesClient.send(sendEmailCommand);
      console.log('Email sent successfully:', response);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Support request submitted successfully' 
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