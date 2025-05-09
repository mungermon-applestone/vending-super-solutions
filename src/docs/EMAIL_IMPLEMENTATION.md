
# Email Handling Implementation

This document outlines how email functionality is implemented in the application.

## Current Implementation

The application uses SendGrid's API to handle email functionality:

1. **Client-side components** use the `sendEmail` function from `src/services/email/emailAdapter.ts`
2. **The adapter** sends emails directly to SendGrid's API
3. **In development mode**, emails are logged to the console instead of being sent

## Form Components

The following components use the email functionality:

- `EmbeddedContactForm` - A configurable form with multiple variants (compact, full, inline)
- `ContactForm` - The main form used on the Contact page
- `InquiryForm` - Used for demo requests and product inquiries

## Analytics Tracking

All form interactions are tracked using the analytics service:

- `form_view` - When a form becomes visible
- `form_submit` - When a form is submitted
- `form_submit_success` - When a form is successfully submitted
- `form_submit_error` - When a form submission fails

## Configuration Options

The email functionality can be configured in `src/services/email/emailConfig.ts`:

```typescript
export const emailConfig = {
  developmentMode: {
    logEmails: true,
    forceDevelopmentMode: false
  },
  sendGrid: {
    endpoint: 'https://api.sendgrid.com/v3/mail/send'
  }
};
```

## Environment Variables

For SendGrid integration, the following environment variables are needed:

```
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_TO=recipient@example.com
EMAIL_FROM=sender@example.com
```

## Setting Up Environment Variables in Lovable

To configure your email settings in Lovable:

1. Go to Project Settings
2. Navigate to Environment Variables
3. Add the following variables:
   - `SENDGRID_API_KEY` - Your SendGrid API key
   - `EMAIL_TO` - The email where form submissions will be sent
   - `EMAIL_FROM` - The email address shown as the sender

## Testing Email Functionality

To test the email functionality:

1. In development, emails are not actually sent but logged to the console
2. Use the `EmailServiceTester` component in the admin panel to verify configuration
3. Submit a test form and check if the success message appears
4. For production testing, verify that the SendGrid API key is correctly configured

## Development vs Production Behavior

In development mode:
- Emails are logged to the console instead of being sent
- The `logEmails` configuration option can be toggled to control this behavior
- You can force development mode with the `forceDevelopmentMode` option

In production:
- Emails are sent using the SendGrid API
- SendGrid API key must be properly set in environment variables
