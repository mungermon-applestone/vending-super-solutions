
// Vercel API route handler for sending emails
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message, company, phone, formType, config } = req.body;
    
    // Log the submission data (useful for debugging)
    console.log('Form submission received:', {
      formType,
      name: name || '',
      email: email || '',
      subject: subject || '',
      message: message || '',
      company: company || '',
      phone: phone || ''
    });
    
    // Basic validation
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // Get email configuration - support both deployment methods
    // For Lovable deployment, config will be passed from the client
    // For Vercel deployment, process.env will be used
    const sendgridApiKey = config?.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY;
    const emailTo = config?.EMAIL_TO || process.env.EMAIL_TO || 'munger@applestonesolutons.com';
    const emailFrom = config?.EMAIL_FROM || process.env.EMAIL_FROM || 'noreply@applestonesolutions.com';
    
    // Check if we're in development or if SendGrid API key is missing
    if ((typeof window !== 'undefined' && window.location?.hostname === 'localhost') || !sendgridApiKey) {
      console.log('Email would be sent in production with the following details:');
      console.log('To:', emailTo);
      console.log('Subject:', `New ${formType || 'Contact Form'} Submission: ${subject || ''}`);
      console.log('Content:', {
        name: name || '',
        email: email || '',
        company: company || '',
        phone: phone || '',
        subject: subject || '',
        message: message || ''
      });
      
      return res.status(200).json({ 
        success: true, 
        message: 'Form submission received. In development mode, email not actually sent.'
      });
    }
    
    // In production with SendGrid configured
    try {
      // Import SendGrid - note this uses dynamic import since it might not be installed in dev
      const { default: sgMail } = await import('@sendgrid/mail');
      
      // Set API key
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
      
      // Send email
      await sgMail.send(msg);
      
      return res.status(200).json({ 
        success: true,
        message: 'Email sent successfully' 
      });
    } catch (emailError) {
      console.error('SendGrid error:', emailError);
      return res.status(500).json({ 
        error: 'Failed to send email',
        details: emailError.message
      });
    }
    
  } catch (error) {
    console.error('Error processing form submission:', error);
    return res.status(500).json({ 
      error: 'Failed to process form submission',
      details: error.message
    });
  }
}
