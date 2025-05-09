
# Email Handling Implementation

This document outlines how email functionality is implemented in the application.

## Current Implementation

The application uses a configurable approach to handle email functionality:

1. **Client-side components** use the `sendEmail` function from `src/services/email/emailAdapter.ts`
2. **The adapter** decides which implementation to use based on the configuration in `emailConfig.ts`:
   - `SENDGRID`: Direct integration with SendGrid's API (recommended)
   - `ADAPTER`: The legacy implementation using a proxy API endpoint

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
  provider: 'SENDGRID', // 'SENDGRID' | 'ADAPTER'
  defaultRecipient: 'munger@applestonesolutions.com',
  defaultSender: 'noreply@applestonesolutions.com',
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

## Testing Email Functionality

To test the email functionality:

1. In development, emails are not actually sent but logged to the console
2. For production testing, verify that the SendGrid API key is correctly configured
3. Submit a test form and check if the success message appears
4. Use the `EmailServiceTester` component to verify configuration

## Development vs Production Behavior

In development mode:
- Emails are logged to the console instead of being sent
- The `logEmails` configuration option can be toggled to control this behavior
- You can force development mode with the `forceDevelopmentMode` option

In production:
- Emails are sent using the configured provider
- SendGrid API key must be properly set
