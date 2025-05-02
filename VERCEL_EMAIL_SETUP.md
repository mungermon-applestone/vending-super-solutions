
# Setting up Email Functionality in Vercel

This document explains how to configure the email functionality for the contact forms when deploying to Vercel.

## Step 1: Choose an Email Service Provider

You'll need an email service provider to send emails. Here are some popular options:
- [SendGrid](https://sendgrid.com/) (recommended)
- [Mailgun](https://www.mailgun.com/)
- [AWS SES](https://aws.amazon.com/ses/)

## Step 2: Set up Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Add the following environment variables:

```
EMAIL_TO=munger@applestonesolutons.com
EMAIL_FROM=noreply@yourdomain.com  # Replace with a verified sender email
```

For SendGrid:
```
SENDGRID_API_KEY=your_sendgrid_api_key
```

For Mailgun:
```
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_mailgun_domain
```

## Step 3: Install Required Dependencies

Depending on which email provider you choose, you'll need to install the corresponding package:

For SendGrid:
```
npm install @sendgrid/mail
```

For Mailgun:
```
npm install mailgun.js
```

## Step 4: Update the API Endpoint

Once you've chosen your email provider, update the `/api/send-email.js` file to uncomment and modify the email sending code for your chosen provider.

### Example with SendGrid

```javascript
import sgMail from '@sendgrid/mail';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message, company, phone, formType } = req.body;
    
    // Set API key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    // Create email message
    const msg = {
      to: process.env.EMAIL_TO || 'munger@applestonesolutons.com',
      from: process.env.EMAIL_FROM || 'noreply@yourdomain.com',
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
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
```

## Testing Your Setup

1. Deploy your project to Vercel
2. Fill out and submit one of the contact forms
3. Check if you receive the email at the specified address
4. If you encounter issues, check the Vercel Function Logs in your Vercel dashboard

## Additional Notes

- Make sure to verify your sender email address with your email service provider
- For production use, consider implementing rate limiting to prevent abuse
- Consider adding CAPTCHA to prevent spam submissions
