
import sgMail from '@sendgrid/mail';

// Initialize SendGrid with your API key
export const initSendGrid = () => {
  try {
    // Initialize using your existing SendGrid API key
    // Your API key should be stored in environment variables for production
    sgMail.setApiKey('GF7ahmvXoDxVofUpa');
    console.log('SendGrid initialized successfully');
  } catch (error) {
    console.error('Failed to initialize SendGrid:', error);
  }
};

// Send email function
export const sendEmail = async (params: {
  from_name: string;
  from_email: string;
  subject: string;
  message: string;
  form_type?: string;
  page_url?: string;
}) => {
  try {
    const msg = {
      to: 'admin@yourdomain.com', // Replace with your recipient email
      from: 'noreply@yourdomain.com', // Replace with your verified sender email
      subject: params.subject,
      text: params.message,
      html: `
        <div>
          <h3>${params.subject}</h3>
          <p><strong>From:</strong> ${params.from_name} (${params.from_email})</p>
          <p><strong>Message:</strong></p>
          <p>${params.message}</p>
          ${params.form_type ? `<p><strong>Form Type:</strong> ${params.form_type}</p>` : ''}
          ${params.page_url ? `<p><strong>Page URL:</strong> ${params.page_url}</p>` : ''}
        </div>
      `,
    };

    console.log('Sending email with SendGrid:', msg);
    const response = await sgMail.send(msg);
    console.log('SendGrid response:', response);
    return response;
  } catch (error) {
    console.error('SendGrid error:', error);
    throw error;
  }
};
