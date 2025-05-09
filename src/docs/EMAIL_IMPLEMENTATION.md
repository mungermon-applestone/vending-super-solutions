
# Email Handling Implementation

This document outlines how email functionality is implemented in the application.

## Current Implementation

The application uses a dual approach to handle contact forms:

### Primary Method: SendGrid via Supabase Edge Functions

1. **Form data is collected** from the user input
2. **Data is sent to a Supabase Edge Function** that connects to SendGrid
3. **An email is sent** to the configured recipient
4. **Success/error status is returned** to the user

### Fallback Method: Mailto Links

If the primary method fails (API errors, network issues, etc.), the application falls back to:

1. **Form data is collected** from the user input
2. **A "mailto:" link is generated** with the subject and body populated
3. **The user's default email client opens** with a pre-filled email message
4. **The user can review and send** the email from their own email client

## Form Components

The following components use the email functionality:

- `ContactFormNew` - The core implementation used by all contact forms
- `SimpleForm` - A compact form wrapper around ContactFormNew
- `ContactForm` - The main form used on the Contact page
- `EmbeddedContactForm` - A configurable form that can be embedded anywhere
- `ContactFormToggle` - A component that toggles between a CTA and a form
- `InquiryForm` - Used for demo requests and product inquiries

## Analytics Tracking

All form interactions are tracked using the analytics service:

- `form_view` - When a form becomes visible
- `form_submit` - When a form is submitted
- `form_submit_success` - When a form is successfully submitted
- `form_submit_error` - When a form submission fails

## Configuration Options

The email functionality can be configured in:

1. **Supabase Secrets** (production environment):
   - `SENDGRID_API_KEY` - Your SendGrid API key
   - `EMAIL_TO` - The recipient email address
   - `EMAIL_FROM` - The sender email address

2. **Fallback Configuration** (in `src/services/email/emailConfig.ts`):
   ```typescript
   export const emailConfig = {
     defaultRecipient: 'contact@example.com',
     defaultSender: 'noreply@example.com'
   };
   ```

## Deployment Requirements

To deploy the contact form functionality to production:

1. Ensure the Supabase secrets are properly set:
   - `SENDGRID_API_KEY` - Your SendGrid API key
   - `EMAIL_TO` - The recipient email address
   - `EMAIL_FROM` - The sender email address
   
2. Verify that the Edge Function is deployed
   
3. Test the form in production to ensure everything works correctly

## Testing Email Functionality

To test the email functionality:

1. Fill out any contact form on the site
2. Submit the form
3. Verify that the success message appears
4. Check the recipient mailbox for the email
5. If no email is received, check the Edge Function logs in Supabase
