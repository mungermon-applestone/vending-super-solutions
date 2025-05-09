
# Email Handling Implementation

This document outlines how email functionality is implemented in the application.

## Current Implementation

The application uses a transitional approach to handle email functionality:

1. **Client-side components** use the `sendEmail` function from `src/services/email/emailAdapter.ts`
2. **The adapter** currently routes requests to the legacy API endpoint (`/api/send-email`)
3. **Future implementation** will use direct integration with SendGrid or a similar email service

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

## Future Implementation

In the future, we will:

1. Implement direct SendGrid integration in `sendGridService.ts`
2. Update the `emailAdapter.ts` to use the direct integration
3. Remove the legacy Vercel API route

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
3. Submit a test form and check if the success message appears and email is received

