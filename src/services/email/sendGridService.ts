
import { FormSubmissionData } from './emailService';
import { emailConfig, getEmailEnvironment } from './emailConfig';

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
    const env = getEmailEnvironment();
    
    // Check if we should log instead of sending
    if (env.logEmails) {
      console.log('SendGrid would send email in production with:', data);
      return {
        success: true,
        message: 'Development mode: Email logged to console instead of sending'
      };
    }
    
    // Prepare email content
    const emailSubject = data.subject || `New ${data.formType} Submission`;
    const recipient = env.recipientEmail;
    const sender = env.senderEmail;
    
    // Validate SendGrid API key
    if (!env.sendGridApiKey) {
      console.warn('SendGrid API key not found. Please check your environment variables.');
      return {
        success: false,
        message: 'Unable to send email: SendGrid API key not configured. Please contact the administrator.'
      };
    }
    
    // Create the request to SendGrid's public API endpoint
    const response = await fetch(emailConfig.sendGrid.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.sendGridApiKey}`,
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
      const errorText = await response.text().catch(() => 'Unknown error');
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText };
      }
      
      console.error('SendGrid API error:', errorData);
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
      message: error instanceof Error 
        ? `Failed to send email: ${error.message}` 
        : 'Failed to send email through SendGrid. Please try again later.'
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
  const env = getEmailEnvironment();
  
  // Check if we have the necessary environment variables for SendGrid
  const hasSendGridKey = Boolean(env.sendGridApiKey);
  const hasEmailTo = Boolean(env.recipientEmail);
  const hasEmailFrom = Boolean(env.senderEmail);
  
  const missingEnvVars = [];
  if (!hasSendGridKey) missingEnvVars.push('SENDGRID_API_KEY');
  if (!hasEmailTo) missingEnvVars.push('EMAIL_TO');
  if (!hasEmailFrom) missingEnvVars.push('EMAIL_FROM');
  
  return {
    isConfigured: hasSendGridKey,
    provider: 'SendGrid',
    missingEnvVars
  };
}
