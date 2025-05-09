
# Email Handling Implementation

This document outlines how email functionality is implemented in the application.

## Current Implementation

The application uses a simple "mailto:" approach to handle contact forms:

1. **Form data is collected** from the user input
2. **A "mailto:" link is generated** with the subject and body populated
3. **The user's default email client opens** with a pre-filled email message
4. **The user can review and send** the email from their own email account

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

The email functionality can be configured in `src/services/email/emailConfig.ts`:

```typescript
export const emailConfig = {
  defaultRecipient: 'contact@example.com',
  defaultSender: 'noreply@example.com'
};
```

## Future Implementation Notes

To implement a server-side email sending solution:

1. Create an API endpoint to handle form submissions
2. Update the ContactFormNew component to use fetch/axios instead of mailto
3. Add proper error handling and success states
4. Consider using a service like SendGrid, AWS SES, or other email providers
5. Add rate limiting and spam protection

## Testing Email Functionality

To test the email functionality:

1. Fill out any contact form on the site
2. Submit the form
3. Verify that your email client opens with the pre-filled message
4. For future server-side implementation, use the EmailServiceTester component in the admin panel
