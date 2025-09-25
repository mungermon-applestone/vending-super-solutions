
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SESClient, SendEmailCommand } from "https://esm.sh/@aws-sdk/client-ses@3.554.0";

// Set up CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Email validation regex
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Initialize SES client
const createSESClient = () => {
  return new SESClient({
    region: Deno.env.get('AWS_REGION') || 'us-east-1',
    credentials: {
      accessKeyId: Deno.env.get('AWS_ACCESS_KEY_ID') || '',
      secretAccessKey: Deno.env.get('AWS_SECRET_ACCESS_KEY') || '',
    },
  });
};

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
    const sesClient = createSESClient();
    
    const sendEmailCommand = new SendEmailCommand({
      Source: emailFrom,
      Destination: {
        ToAddresses: [emailTo],
      },
      ReplyToAddresses: [email],
      Message: {
        Subject: {
          Data: emailSubject,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: htmlContent,
            Charset: 'UTF-8',
          },
          Text: {
            Data: textContent,
            Charset: 'UTF-8',
          },
        },
      },
    });

    console.log('Sending email with SES:', {
      from: emailFrom,
      to: emailTo,
      subject: emailSubject,
      replyTo: email
    });

    try {
      const response = await sesClient.send(sendEmailCommand);
      console.log('SES response:', JSON.stringify(response));

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
