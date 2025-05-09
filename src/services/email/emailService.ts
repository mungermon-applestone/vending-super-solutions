
import { trackEvent, trackFormSuccess, trackFormError } from '@/utils/analytics';
import { emailConfig, getEmailEnvironment } from './emailConfig';
import { sendWithSendGrid } from './sendGridService';

// Type definitions for form submission data
export interface FormSubmissionData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message?: string;
  formType: string;
  location?: string;
}

/**
 * Sends an email with the form submission data
 * This service now directly uses the SendGrid integration
 * 
 * @param data Form submission data
 * @returns Promise that resolves with success message or rejects with error
 */
export async function sendContactEmail(data: FormSubmissionData): Promise<{ success: boolean, message: string }> {
  try {
    // Track the form submission
    trackEvent('form_submit', {
      form_type: data.formType,
      location: data.location || window.location.pathname
    });
    
    // In development mode, just log the email data
    const env = getEmailEnvironment();
    if (env.logEmails) {
      console.log('Email would be sent in production with the following details:');
      console.log('Form Type:', data.formType);
      console.log('Content:', {
        name: data.name || '',
        email: data.email || '',
        company: data.company || '',
        phone: data.phone || '',
        subject: data.subject || '',
        message: data.message || '',
        location: data.location || window.location.pathname || 'unknown'
      });
      
      // Simulate success in development
      trackFormSuccess(data.formType, data.location || window.location.pathname);
      return { 
        success: true, 
        message: 'Form submission received successfully. In development mode, email not actually sent.' 
      };
    }
    
    // Use SendGrid service to send the email
    const result = await sendWithSendGrid(data);
    
    if (result.success) {
      // Track successful submission
      trackFormSuccess(data.formType, data.location || window.location.pathname);
    } else {
      // Track submission error
      trackFormError(
        data.formType, 
        result.message || 'Unknown error',
        data.location || window.location.pathname
      );
    }
    
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Track submission error
    trackFormError(
      data.formType, 
      error instanceof Error ? error.message : 'Unknown error',
      data.location || window.location.pathname
    );
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send message'
    };
  }
}
