
// Vercel API route handler for sending emails
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message, company, phone, formType, productInfo } = req.body;
    
    // Log the submission data (useful for debugging)
    console.log('Form submission received:', {
      formType: formType || 'Contact Form',
      name: name || '',
      email: email || '',
      subject: subject || '',
      message: message || '',
      company: company || '',
      phone: phone || '',
      productInfo: productInfo || ''
    });
    
    // Basic validation
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // Determine subject line based on form type
    let emailSubject = subject || '';
    if (!emailSubject) {
      switch(formType) {
        case 'demo':
          emailSubject = 'Demo Request';
          break;
        case 'inquiry':
          emailSubject = productInfo ? `Inquiry about ${JSON.parse(productInfo).name}` : 'Product Inquiry';
          break;
        default:
          emailSubject = 'Website Contact';
      }
    }
    
    // Check if we're in development or production
    // In development, we'll just log and return success
    if (process.env.NODE_ENV === 'development' || !process.env.SENDGRID_API_KEY) {
      console.log('Email would be sent in production with the following details:');
      console.log('To:', process.env.EMAIL_TO || 'munger@applestonesolutons.com');
      console.log('Subject:', `New ${formType || 'Contact Form'} Submission: ${emailSubject}`);
      console.log('Content:', {
        name: name || '',
        email: email || '',
        company: company || '',
        phone: phone || '',
        subject: emailSubject || '',
        message: message || '',
        productInfo: productInfo || ''
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
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      
      // Parse product info if provided
      let productDetails = '';
      if (productInfo) {
        try {
          const product = JSON.parse(productInfo);
          productDetails = `
            Product Information:
            Name: ${product.name || 'Not specified'}
            Type: ${product.type || 'Not specified'}
            ID: ${product.id || 'Not specified'}
          `;
        } catch (e) {
          console.error('Error parsing product info:', e);
        }
      }
      
      // Create email message
      const msg = {
        to: process.env.EMAIL_TO || 'munger@applestonesolutons.com',
        from: process.env.EMAIL_FROM || 'noreply@applestonesolutions.com',
        subject: `New ${formType || 'Contact Form'} Submission: ${emailSubject}`,
        text: `
          Name: ${name || ''}
          Email: ${email || ''}
          ${company ? `Company: ${company}\n` : ''}
          ${phone ? `Phone: ${phone}\n` : ''}
          ${subject ? `Subject: ${subject}\n` : ''}
          ${productInfo ? productDetails : ''}
          
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
          ${productInfo ? `<div><strong>Product Information:</strong><br>${productDetails.replace(/\n/g, '<br>')}</div>` : ''}
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
        details: process.env.NODE_ENV === 'development' ? emailError.message : undefined 
      });
    }
    
  } catch (error) {
    console.error('Error processing form submission:', error);
    return res.status(500).json({ 
      error: 'Failed to process form submission',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
