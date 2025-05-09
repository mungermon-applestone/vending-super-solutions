
/**
 * Email Service
 * 
 * Simple email utilities to support current "mailto:" implementation
 * and prepare for future server-side email sending.
 */

import { emailConfig } from './emailConfig';

/**
 * Creates a mailto URL with the provided form data
 */
export function createMailtoLink(
  subject: string,
  body: string,
  recipient: string = emailConfig.defaultRecipient
): string {
  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Format form data into an email body
 */
export function formatEmailBody(formData: Record<string, string>, metadata?: Record<string, string>): string {
  let body = '';
  
  // Add each form field
  for (const [key, value] of Object.entries(formData)) {
    if (value) {
      body += `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}\n`;
    }
  }
  
  // Add a separator
  body += '\n---\n\n';
  
  // Add metadata if provided
  if (metadata) {
    for (const [key, value] of Object.entries(metadata)) {
      body += `${key}: ${value}\n`;
    }
  }
  
  return body;
}

/**
 * Check email configuration status
 * (Placeholder for future server-side email implementation)
 */
export function getEmailConfigStatus() {
  return {
    isConfigured: true,
    provider: 'mailto'
  };
}
