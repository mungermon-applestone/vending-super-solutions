
# Email Functionality in the Application

This document explains how email functionality works in this application.

## How Email Works in This Application

The application uses a simple "mailto:" link approach to handle contact forms. When a user submits a form:

1. The form data is collected and formatted
2. A "mailto:" link is generated with the form data
3. The user's default email client opens with a pre-filled email
4. The user can review and send the email

## Configuration

The email recipient is configured in `src/services/email/emailConfig.ts`. You can update this file to change the default recipient email address.

```typescript
export const emailConfig = {
  defaultRecipient: 'your-email@example.com',
  defaultSender: 'noreply@yourdomain.com'
};
```

## Advantages of This Approach

- No server-side code required
- Works without API keys or paid services
- User can review the email before sending
- Email appears to come from the user's own address, improving deliverability

## Limitations

- Requires the user to have a configured email client
- Mobile users may have a less seamless experience
- Cannot track if the email was actually sent

## Future Improvements

If you want to implement a more sophisticated email solution in the future, consider:

1. Using a service like SendGrid or Mailgun
2. Setting up a server endpoint to handle form submissions
3. Implementing email templates for consistent formatting

