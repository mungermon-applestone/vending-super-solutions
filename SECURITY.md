# Security Documentation

## Customer Credential Protection

This document outlines the security measures in place to protect customer credentials and sensitive data.

## 🔒 Authentication Security

### Password Handling
- ✅ **Never logged**: Passwords are never written to console logs or error messages
- ✅ **Never stored client-side**: No passwords in localStorage, sessionStorage, or cookies
- ✅ **Transmitted securely**: Only sent via POST to edge function over HTTPS
- ✅ **Server-side only**: Edge function acts as secure proxy to external auth APIs

### Rate Limiting
- **5 failed attempts** triggers account lockout
- **15-minute lockout** period to prevent brute force attacks
- Rate limiting tracked server-side in Supabase
- Client-side fallback counter for unparseable errors

### Session Management
- **15-minute inactivity timeout** with 2-minute warning
- **2-hour absolute session timeout**
- Session data stored in sessionStorage: `{ email, username, userId, loginTime }`
- **No sensitive data** stored in session (no passwords, tokens, or secrets)

## 🛡️ Security Measures

### Content Security Policy (CSP)
- Implemented in `index.html` to prevent XSS attacks
- Restricts script sources to trusted domains only
- Blocks inline scripts except where necessary
- Prevents loading of untrusted resources

### XSS Prevention
- `sanitizeInput()` utility available in `src/utils/securityUtils.ts`
- Sanitizes user input before rendering
- Escapes HTML special characters: `<`, `>`, `"`, `'`

### Email Sanitization in Logs
- Authentication logs show only first 3 characters: `abc***@...`
- Prevents exposure of full email addresses in server logs
- Implemented in edge function at multiple points

### CORS Protection
- Whitelist of allowed origins in edge function
- Only permits requests from:
  - `https://applestonesolutions.com`
  - `https://www.applestonesolutions.com`
  - `*.lovable.app`, `*.lovable.dev`, `*.lovableproject.com`

## 🔐 Secret Management

### CRITICAL: API Secrets
**Never hardcode secrets in code files!**

All API secrets must be stored as Supabase secrets:

1. **CUSTOMER_AUTH_API_SECRET**: Used by customer-auth edge function
   - Required for authentication with external APIs
   - Must be set in Supabase Dashboard → Edge Functions → Secrets

2. **Other Required Secrets**:
   - SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY
   - SUPABASE_ANON_KEY

### How to Add Secrets
1. Go to Supabase Dashboard
2. Navigate to Edge Functions → Secrets
3. Add the secret name and value
4. Redeploy edge functions

## 🚨 Known Issues & Mitigations

### SessionStorage XSS Risk
**Issue**: sessionStorage can be accessed by any JavaScript on the page
**Mitigation**: 
- CSP prevents loading of untrusted scripts
- No sensitive data stored in sessionStorage
- Session expires after inactivity

**Future Enhancement**: Consider using httpOnly cookies for token storage

### No Password Strength Requirements
**Issue**: Users can set weak passwords
**Mitigation**: Handled by external authentication service
**Future Enhancement**: Add client-side password strength validator

## 📋 Security Checklist

When making changes to authentication code:

- [ ] Never log passwords or sensitive data
- [ ] Never store passwords client-side
- [ ] Use environment variables for secrets
- [ ] Sanitize user inputs before rendering
- [ ] Validate all inputs server-side
- [ ] Check rate limiting is functioning
- [ ] Verify CORS headers are correct
- [ ] Ensure HTTPS is used for all requests
- [ ] Test session timeout behavior
- [ ] Review CSP after adding new external resources

## 🔍 Security Audit Trail

### Last Audit: 2025-10-17
**Findings**:
1. ✅ Fixed: Moved hardcoded API secret to environment variable
2. ✅ Fixed: Added Content Security Policy header
3. ⚠️ Accepted Risk: sessionStorage usage (mitigated by CSP)
4. ⚠️ Future: Consider password strength requirements

### Testing Performed
- ✅ Rate limiting (5 attempts, 15-min lockout)
- ✅ Password error messages (no credential leakage)
- ✅ Session timeouts (15 min inactivity, 2 hours absolute)
- ✅ Email sanitization in logs
- ✅ No passwords in console/network logs

## 📞 Reporting Security Issues

If you discover a security vulnerability:
1. **Do not** open a public GitHub issue
2. Contact security team immediately
3. Provide detailed description and reproduction steps
4. Allow time for patch before public disclosure

## 🔗 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/security)
- [Content Security Policy Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
