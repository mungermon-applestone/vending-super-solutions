
import { trackEvent, trackFormSuccess, trackFormError } from '@/utils/analytics';

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
 * This service can be configured to use SendGrid or other email providers
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
    if (process.env.NODE_ENV === 'development') {
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
      return { 
        success: true, 
        message: 'Form submission received successfully. In development mode, email not actually sent.' 
      };
    }
    
    // In production, send the email through a proxy endpoint that connects to SendGrid
    // This is a temporary adapter that maintains compatibility with existing code
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.error || 'Failed to send message');
    }
    
    // Track successful submission
    trackFormSuccess(data.formType, data.location || window.location.pathname);
    
    return {
      success: true,
      message: responseData.message || 'Email sent successfully'
    };
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
