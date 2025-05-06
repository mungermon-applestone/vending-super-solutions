
// Vercel API route handler for sending emails
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message, company, phone, formType, config } = req.body;
    
    // Log the submission data and config (useful for debugging)
    console.log('Form submission received:', {
      formType,
      name: name || '',
      email: email || '',
      subject: subject || '',
      company: company || '',
      phone: phone || '',
      message: message ? message.substring(0, 20) + '...' : ''
    });
    
    console.log('Email configuration:', {
      hasConfig: !!config,
      hasApiKey: config && !!config.SENDGRID_API_KEY,
      emailTo: config?.EMAIL_TO || '(not provided)',
      emailFrom: config?.EMAIL_FROM || '(not provided)'
    });
    
    // Basic validation
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // Get email configuration - fully rely on the config passed from the client
    // This is the correct approach for Lovable deployment
    const sendgridApiKey = config?.SENDGRID_API_KEY;
    const emailTo = config?.EMAIL_TO || 'hello@applestonesolutions.com';
    const emailFrom = config?.EMAIL_FROM || 'support@applestonesolutions.com';
    
    // Check if we have the required configuration
    if (!sendgridApiKey) {
      console.log('SendGrid API key missing, email cannot be sent');
      return res.status(200).json({ 
        success: false, 
        message: 'Email configuration incomplete. SendGrid API key missing.',
        debug: true
      });
    }
    
    // Try sending the email with SendGrid
    try {
      // Import SendGrid - note this uses dynamic import
      console.log('Importing SendGrid...');
      const { default: sgMail } = await import('@sendgrid/mail');
      
      // Set API key
      console.log('Setting SendGrid API key...');
      sgMail.setApiKey(sendgridApiKey);
      
      // Create email message
      const msg = {
        to: emailTo,
        from: emailFrom,
        subject: `New ${formType || 'Contact Form'} Submission: ${subject || ''}`,
        text: `
          Name: ${name || ''}
          Email: ${email || ''}
          ${company ? `Company: ${company}\n` : ''}
          ${phone ? `Phone: ${phone}\n` : ''}
          ${subject ? `Subject: ${subject}\n` : ''}
          
          Message:
          ${message || ''}
        `,
        html: `
          <h3>New ${formType || 'Contact Form'} Submission</h3>
          <p><strong>Name:</strong> ${name || ''}</p>
          <p><strong>Email:</strong> ${email || ''}</p>
          ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p>${message?.replace(/\n/g, '<br>') || ''}</p>
        `,
      };
      
      console.log('Sending email to:', emailTo);
      
      // Send email
      await sgMail.send(msg);
      
      console.log('Email sent successfully!');
      return res.status(200).json({ 
        success: true,
        message: 'Email sent successfully' 
      });
    } catch (emailError) {
      console.error('SendGrid error:', emailError);
      return res.status(500).json({ 
        error: 'Failed to send email',
        details: emailError.message,
        stack: emailError.stack
      });
    }
    
  } catch (error) {
    console.error('Error processing form submission:', error);
    return res.status(500).json({ 
      error: 'Failed to process form submission',
      details: error.message,
      stack: error.stack
    });
  }
}
