
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import sgMail from 'npm:@sendgrid/mail';

// Initialize SendGrid
sgMail.setApiKey(Deno.env.get('SENDGRID_API_KEY') || '');

// Set up CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Get recipient and sender from env variables
    const emailTo = Deno.env.get('EMAIL_TO');
    const emailFrom = Deno.env.get('EMAIL_FROM');

    if (!emailTo || !emailFrom) {
      console.error('Missing email configuration');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Server configuration error', 
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

    // Send the email
    const msg = {
      to: emailTo,
      from: emailFrom,
      subject: emailSubject,
      text: textContent,
      html: htmlContent,
      replyTo: email,
    };

    console.log('Sending email with data:', {
      to: emailTo,
      from: emailFrom,
      subject: emailSubject,
      replyTo: email
    });

    const response = await sgMail.send(msg);
    console.log('SendGrid response:', response);

    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );

  } catch (error) {
    console.error('Error sending email:', error);
    
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
