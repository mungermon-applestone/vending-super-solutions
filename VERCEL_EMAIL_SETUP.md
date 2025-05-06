
# Setting up Email Functionality in Vercel

This document explains how to configure the email functionality for the contact forms when deploying to Vercel.

## Step 1: Choose an Email Service Provider

You'll need an email service provider to send emails. Here are some popular options:
- [SendGrid](https://sendgrid.com/) (recommended)
- [Mailgun](https://www.mailgun.com/)
- [AWS SES](https://aws.amazon.com/ses/)

## Step 2: Configure Email Settings

There are two ways to set up your email configuration:

### Option 1: Using the runtime-config file (Recommended for Development)

For local development and testing before deployment, update the email settings in the `public/api/runtime-config` file:

```json
{
  "VITE_CONTENTFUL_SPACE_ID": "your_space_id",
  "VITE_CONTENTFUL_DELIVERY_TOKEN": "your_token",
  "VITE_CONTENTFUL_ENVIRONMENT_ID": "master",
  "SENDGRID_API_KEY": "your_sendgrid_api_key",
  "EMAIL_TO": "recipient@example.com",
  "EMAIL_FROM": "sender@example.com"
}
```

### Option 2: Setting Environment Variables in Vercel (For Production)

When deploying to Vercel, set the following environment variables:

1. Go to your Vercel project dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Add the following environment variables:

```
EMAIL_TO=recipient@example.com
EMAIL_FROM=sender@example.com
SENDGRID_API_KEY=your_sendgrid_api_key
```

## Step 3: Install Required Dependencies

For SendGrid:
```
npm install @sendgrid/mail
```

## Step 4: Testing Your Setup

1. Fill out and submit one of the contact forms
2. Check if you receive the email at the specified address
3. If you encounter issues, check the console logs for error messages

## Additional Notes

- Make sure to verify your sender email address with your email service provider
- For production use, consider implementing rate limiting to prevent abuse
- Consider adding CAPTCHA to prevent spam submissions
