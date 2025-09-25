
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Set up CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Email validation regex
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// AWS SigV4 signing implementation for SES
async function signRequest(
  method: string,
  url: string,
  headers: Record<string, string>,
  body: string,
  region: string,
  accessKeyId: string,
  secretAccessKey: string
) {
  const encoder = new TextEncoder();
  
  // Create canonical request
  const parsedUrl = new URL(url);
  const host = parsedUrl.hostname;
  const path = parsedUrl.pathname;
  
  const timestamp = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
  const date = timestamp.substr(0, 8);
  
  headers['host'] = host;
  headers['x-amz-date'] = timestamp;
  
  // Sort headers
  const sortedHeaders = Object.keys(headers).sort().map(key => `${key.toLowerCase()}:${headers[key]}`).join('\n');
  const signedHeaders = Object.keys(headers).sort().map(key => key.toLowerCase()).join(';');
  
  // Create payload hash
  const payloadHash = await crypto.subtle.digest('SHA-256', encoder.encode(body));
  const payloadHashHex = Array.from(new Uint8Array(payloadHash)).map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Create canonical request
  const canonicalRequest = [
    method,
    path,
    '', // query string
    sortedHeaders,
    '',
    signedHeaders,
    payloadHashHex
  ].join('\n');
  
  // Create string to sign
  const algorithm = 'AWS4-HMAC-SHA256';
  const credentialScope = `${date}/${region}/ses/aws4_request`;
  const canonicalRequestHash = await crypto.subtle.digest('SHA-256', encoder.encode(canonicalRequest));
  const canonicalRequestHashHex = Array.from(new Uint8Array(canonicalRequestHash)).map(b => b.toString(16).padStart(2, '0')).join('');
  
  const stringToSign = [
    algorithm,
    timestamp,
    credentialScope,
    canonicalRequestHashHex
  ].join('\n');
  
  // Create signature
  const signingKey = await getSignatureKey(secretAccessKey, date, region, 'ses');
  const signature = await crypto.subtle.sign('HMAC', signingKey, encoder.encode(stringToSign));
  const signatureHex = Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Create authorization header
  const authorization = `${algorithm} Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signatureHex}`;
  
  return authorization;
}

async function getSignatureKey(key: string, dateStamp: string, regionName: string, serviceName: string) {
  const encoder = new TextEncoder();
  
  const kDate = await crypto.subtle.importKey(
    'raw',
    encoder.encode('AWS4' + key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const kDateSigned = await crypto.subtle.sign('HMAC', kDate, encoder.encode(dateStamp));
  
  const kRegion = await crypto.subtle.importKey(
    'raw',
    kDateSigned,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const kRegionSigned = await crypto.subtle.sign('HMAC', kRegion, encoder.encode(regionName));
  
  const kService = await crypto.subtle.importKey(
    'raw',
    kRegionSigned,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const kServiceSigned = await crypto.subtle.sign('HMAC', kService, encoder.encode(serviceName));
  
  const kSigning = await crypto.subtle.importKey(
    'raw',
    kServiceSigned,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  return kSigning;
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
  const sesEndpoint = `https://ses.${region}.amazonaws.com`;
  
  // Create SES API request body
  const params = new URLSearchParams();
  params.append('Action', 'SendEmail');
  params.append('Version', '2010-12-01');
  params.append('Source', fromEmail);
  params.append('Destination.ToAddresses.member.1', toEmail);
  params.append('ReplyToAddresses.member.1', replyToEmail);
  params.append('Message.Subject.Data', subject);
  params.append('Message.Subject.Charset', 'UTF-8');
  params.append('Message.Body.Html.Data', htmlContent);
  params.append('Message.Body.Html.Charset', 'UTF-8');
  params.append('Message.Body.Text.Data', textContent);
  params.append('Message.Body.Text.Charset', 'UTF-8');
  
  const body = params.toString();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': body.length.toString(),
  };
  
  // Sign the request
  const authorization = await signRequest(
    'POST',
    sesEndpoint + '/',
    headers,
    body,
    region,
    accessKeyId,
    secretAccessKey
  );
  
  headers['Authorization'] = authorization;
  
  // Make the request
  const response = await fetch(sesEndpoint + '/', {
    method: 'POST',
    headers,
    body
  });
  
  const responseText = await response.text();
  
  if (!response.ok) {
    throw new Error(`SES API error: ${response.status} ${response.statusText} - ${responseText}`);
  }
  
  return responseText;
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

    // Create SES client and send email
    const region = Deno.env.get('AWS_REGION') || 'us-east-1';
    const accessKeyId = Deno.env.get('AWS_ACCESS_KEY_ID') || '';
    const secretAccessKey = Deno.env.get('AWS_SECRET_ACCESS_KEY') || '';

    console.log('Sending email with SES:', {
      from: emailFrom,
      to: emailTo,
      subject: emailSubject,
      replyTo: email
    });

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
      console.error('SES error details:', JSON.stringify(sendError, null, 2));
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: sendError instanceof Error ? sendError.message : 'Error sending email',
          details: sendError,
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
