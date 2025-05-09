
import { FormSubmissionData } from './emailService';
import { emailConfig } from './emailConfig';

/**
 * SendGrid Email Service
 * 
 * This service provides direct integration with SendGrid to send emails
 * from client-side code.
 */

/**
 * Sends an email using SendGrid's direct API
 * 
 * @param data Form submission data
 * @returns Promise with success or error information
 */
export async function sendWithSendGrid(data: FormSubmissionData): Promise<{ success: boolean, message: string }> {
  try {
    // Check if we're in development mode
    if (process.env.NODE_ENV === 'development' && emailConfig.developmentMode.logEmails) {
      console.log('SendGrid would send email in production with:', data);
      return {
        success: true,
        message: 'Development mode: Email logged to console instead of sending'
      };
    }
    
    // Prepare email content
    const emailSubject = data.subject || `New ${data.formType} Submission`;
    const recipient = process.env.EMAIL_TO || emailConfig.defaultRecipient;
    const sender = process.env.EMAIL_FROM || emailConfig.defaultSender;
    
    // Create the request to SendGrid's public API endpoint
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY || ''}`,
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: recipient }],
          subject: emailSubject,
        }],
        from: { email: sender },
        content: [{
          type: 'text/html',
          value: createEmailHtml(data),
        }],
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `SendGrid API returned ${response.status}`);
    }
    
    return {
      success: true,
      message: 'Email sent successfully'
    };
  } catch (error) {
    console.error('SendGrid error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send email through SendGrid'
    };
  }
}

/**
 * Creates HTML content for the email
 */
function createEmailHtml(data: FormSubmissionData): string {
  const {
    name = '',
    email = '',
    phone = '',
    company = '',
    message = '',
    formType = 'Contact Form',
    location = ''
  } = data;
  
  return `
    <h3>New ${formType} Submission</h3>
    ${location ? `<p><strong>Submitted From:</strong> ${location}</p>` : ''}
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
    ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
    <p><strong>Message:</strong></p>
    <p>${message.replace(/\n/g, '<br>') || ''}</p>
  `;
}

/**
 * This function provides information about the SendGrid configuration status
 * This is useful for debugging and admin panels
 * 
 * @returns Configuration status
 */
export function getSendGridConfigStatus(): { 
  isConfigured: boolean; 
  provider: string;
  missingEnvVars: string[];
} {
  // Check if we have the necessary environment variables for SendGrid
  const hasSendGridKey = Boolean(process.env.SENDGRID_API_KEY);
  const hasEmailTo = Boolean(process.env.EMAIL_TO);
  const hasEmailFrom = Boolean(process.env.EMAIL_FROM);
  
  const missingEnvVars = [];
  if (!hasSendGridKey) missingEnvVars.push('SENDGRID_API_KEY');
  if (!hasEmailTo) missingEnvVars.push('EMAIL_TO');
  if (!hasEmailFrom) missingEnvVars.push('EMAIL_FROM');
  
  return {
    isConfigured: hasSendGridKey && hasEmailTo && hasEmailFrom,
    provider: 'SendGrid',
    missingEnvVars
  };
}
