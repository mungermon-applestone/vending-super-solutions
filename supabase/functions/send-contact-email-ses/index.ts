import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { AwsClient } from "https://esm.sh/aws4fetch@1.0.16";

// Set up CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Email validation regex
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// AWS client via aws4fetch (handles SigV4 correctly in Edge/Deno)
function createAws(region: string, accessKeyId: string, secretAccessKey: string) {
  return new AwsClient({
    region,
    service: "ses",
    accessKeyId: accessKeyId.trim(),
    secretAccessKey: secretAccessKey.trim(),
  });
}

// Send email using AWS SES API
async function sendSESEmail(
  fromEmail: string,
  toEmail: string,
  replyToEmail: string,
  subject: string,
  htmlContent: string,
  textContent: string,
  region: string,
  accessKeyId: string,
  secretAccessKey: string
) {
  const primaryEndpoint = `https://email.${region}.amazonaws.com/`;
  const fallbackEndpoint = `https://ses.${region}.amazonaws.com/`;

  // Create SES API request body
  const params = new URLSearchParams();
  params.append('Action', 'SendEmail');
  params.append('Version', '2010-12-01');
  params.append('Source', fromEmail);
  params.append('Destination.ToAddresses.member.1', toEmail);
  if (replyToEmail) params.append('ReplyToAddresses.member.1', replyToEmail);
  params.append('Message.Subject.Data', subject);
  params.append('Message.Subject.Charset', 'UTF-8');
  params.append('Message.Body.Html.Data', htmlContent);
  params.append('Message.Body.Html.Charset', 'UTF-8');
  params.append('Message.Body.Text.Data', textContent);
  params.append('Message.Body.Text.Charset', 'UTF-8');

  const body = params.toString();
  const aws = createAws(region, accessKeyId, secretAccessKey);

  async function sendTo(endpoint: string): Promise<string> {
    console.log('Attempting SES request to:', endpoint);
    const res = await aws.fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    const text = await res.text();
    if (!res.ok) {
      throw new Error(`SES API error (${endpoint}): ${res.status} ${res.statusText} - ${text}`);
    }
    return text;
  }

  try {
    // Try primary endpoint first (email.<region>.amazonaws.com)
    return await sendTo(primaryEndpoint);
  } catch (primaryErr) {
    console.error('Primary SES endpoint failed:', primaryErr);
    console.log('Falling back to alternate SES endpoint:', fallbackEndpoint);
    try {
      return await sendTo(fallbackEndpoint);
    } catch (fallbackErr) {
      console.error('Fallback SES endpoint also failed:', fallbackErr);
      // Re-throw with combined info
      throw new Error(`SES request failed. Primary error: ${primaryErr instanceof Error ? primaryErr.message : String(primaryErr)} | Fallback error: ${fallbackErr instanceof Error ? fallbackErr.message : String(fallbackErr)}`);
    }
  }
}

// Main request handler
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse form data from request
    const formData = await req.json();
    const { name, email, phone, company, subject, message, formType, location } = formData;

    console.log('Received form submission:', {
      name,
      email,
      subject,
      formType
    });

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields' 
        }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    // Validate email format
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid email format' 
        }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    // Get recipient and sender from env variables
    const emailTo = Deno.env.get('EMAIL_TO');
    const emailFrom = Deno.env.get('SES_FROM_EMAIL');

    console.log('Using email configuration:', { emailTo, emailFrom });

    if (!emailTo || !emailFrom) {
      console.error('Missing email configuration. EMAIL_TO:', emailTo, 'SES_FROM_EMAIL:', emailFrom);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Server configuration error: Missing email configuration', 
          fallback: true 
        }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    // Validate email addresses
    if (!emailRegex.test(emailTo)) {
      console.error('Invalid EMAIL_TO format:', emailTo);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Server configuration error: Invalid recipient email format', 
          fallback: true 
        }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    if (!emailRegex.test(emailFrom)) {
      console.error('Invalid SES_FROM_EMAIL format:', emailFrom);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Server configuration error: Invalid sender email format', 
          fallback: true 
        }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    // Format email subject
    const emailSubject = subject 
      ? `${formType || 'Contact Form'}: ${subject}`
      : `${formType || 'Contact Form'} Submission`;

    // Build HTML email content
    const htmlContent = `
      <h2>New message from ${name}</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
      ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
      <h3>Message:</h3>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><small>Sent from: ${location || 'Website'}</small></p>
      <p><small>Form type: ${formType || 'Contact Form'}</small></p>
    `;

    // Build text email content (fallback for non-HTML email clients)
    const textContent = `
      New message from ${name}
      
      Name: ${name}
      Email: ${email}
      ${phone ? `Phone: ${phone}\n` : ''}
      ${company ? `Company: ${company}\n` : ''}
      
      Message:
      ${message}
      
      --
      Sent from: ${location || 'Website'}
      Form type: ${formType || 'Contact Form'}
    `;

    // Validate AWS credentials
    const region = Deno.env.get('AWS_REGION') || 'us-east-1';
    const accessKeyId = Deno.env.get('AWS_ACCESS_KEY_ID') || '';
    const secretAccessKey = Deno.env.get('AWS_SECRET_ACCESS_KEY') || '';

    console.log('AWS Configuration:', {
      region,
      accessKeyIdPresent: !!accessKeyId,
      secretAccessKeyPresent: !!secretAccessKey,
      accessKeyIdLength: accessKeyId.length,
      secretAccessKeyLength: secretAccessKey.length
    });

    if (!accessKeyId || !secretAccessKey) {
      console.error('Missing AWS credentials:', {
        accessKeyId: !!accessKeyId,
        secretAccessKey: !!secretAccessKey
      });
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Server configuration error: Missing AWS credentials', 
          fallback: true 
        }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    console.log('Sending email with SES:', {
      from: emailFrom,
      to: emailTo,
      subject: emailSubject,
      replyTo: email,
      region
    });

    // Debug mode: do not send, just return config used
    if (formData && formData.debug === true) {
      return new Response(
        JSON.stringify({
          success: true,
          debug: {
            endpointPrimary: `https://email.${region}.amazonaws.com/`,
            endpointFallback: `https://ses.${region}.amazonaws.com/`,
            region,
            emailFrom,
            emailTo,
          }
        }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    try {
      const response = await sendSESEmail(
        emailFrom,
        emailTo,
        email,
        emailSubject,
        htmlContent,
        textContent,
        region,
        accessKeyId,
        secretAccessKey
      );
      console.log('SES response:', response);

      return new Response(
        JSON.stringify({ success: true }),
        { 
          status: 200, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    } catch (sendError) {
      // Enhanced error logging for SES errors
      console.error('SES error occurred:', sendError);
      
      if (sendError instanceof Error) {
        console.error('SES error message:', sendError.message);
        console.error('SES error stack:', sendError.stack);
        console.error('SES error name:', sendError.name);
      }
      
      // Log additional error properties if they exist
      const errorObj = sendError as any;
      if (errorObj.cause) console.error('SES error cause:', errorObj.cause);
      if (errorObj.code) console.error('SES error code:', errorObj.code);
      if (errorObj.statusCode) console.error('SES error statusCode:', errorObj.statusCode);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: sendError instanceof Error ? sendError.message : 'Error sending email',
          errorType: sendError instanceof Error ? sendError.name : typeof sendError,
          fallback: true 
        }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

  } catch (error) {
    console.error('Error in send-contact-email-ses function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        fallback: true 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
});