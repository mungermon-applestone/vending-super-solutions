import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';
import { create, verify } from "https://deno.land/x/djwt@v3.0.2/mod.ts";

const allowedOrigins = [
  'https://applestonesolutions.com',
  'https://www.applestonesolutions.com',
];

const allowedOriginPatterns = [
  /^https:\/\/.*\.lovable\.app$/,
  /^https:\/\/.*\.lovable\.dev$/,
  /^https:\/\/.*\.lovableproject\.com$/,
];

function getCorsHeaders(origin: string | null): Record<string, string> {
  const isAllowed = origin && (
    allowedOrigins.includes(origin) ||
    allowedOriginPatterns.some(pattern => pattern.test(origin))
  );

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

interface AuthRequest {
  email: string;
  password: string;
}

interface CognitoResponse {
  statusCode: number;
  body: {
    idToken: {
      payload: {
        email: string;
        'cognito:username': string;
        sub: string;
      };
    };
  };
}

interface ErrorResponse {
  error: boolean;
  message: string;
}

// Load API secret from environment variable for security
const API_SECRET = Deno.env.get('CUSTOMER_AUTH_API_SECRET') ?? '';
const API_ENDPOINTS = [
  "https://api.applestoneoem.com",
  "https://api.fastcorpadmin.com"
];

const RATE_LIMIT_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MINUTES = 15;
const LOCKOUT_DURATION_MINUTES = 15;
const SESSION_EXPIRY_HOURS = 2;

// JWT secret for session tokens
const JWT_SECRET = Deno.env.get('JWT_SECRET') ?? '';

// Create crypto key for JWT signing
async function getJwtKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(JWT_SECRET);
  return await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

// Generate a session token
async function generateSessionToken(user: {
  email: string;
  username: string;
  userId: string;
  adminDomain: string;
}): Promise<string> {
  const key = await getJwtKey();
  const now = Math.floor(Date.now() / 1000);
  const exp = now + (SESSION_EXPIRY_HOURS * 60 * 60);
  
  const payload = {
    sub: user.userId,
    email: user.email,
    username: user.username,
    adminDomain: user.adminDomain,
    iat: now,
    exp: exp,
  };
  
  return await create({ alg: "HS256", typ: "JWT" }, payload, key);
}

// Validate a session token
async function validateSessionToken(token: string): Promise<{ valid: boolean; user?: any; error?: string }> {
  if (!JWT_SECRET) {
    console.error('JWT_SECRET not configured');
    return { valid: false, error: 'Server configuration error' };
  }
  
  try {
    const key = await getJwtKey();
    const payload = await verify(token, key);
    
    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && (payload.exp as number) < now) {
      return { valid: false, error: 'Session expired' };
    }
    
    return {
      valid: true,
      user: {
        userId: payload.sub,
        email: payload.email,
        username: payload.username,
        adminDomain: payload.adminDomain,
      }
    };
  } catch (error) {
    console.error('Token validation error:', error);
    return { valid: false, error: 'Invalid session token' };
  }
}

// Initialize Supabase client for database operations
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

async function checkRateLimit(email: string, ipAddress: string): Promise<{ allowed: boolean; remainingMinutes?: number }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('login_attempts')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking rate limit:', error);
      return { allowed: true }; // Allow on error to not block legitimate users
    }

    if (!data) {
      return { allowed: true };
    }

    const now = new Date();
    const lockedUntil = data.locked_until ? new Date(data.locked_until) : null;

    // Check if account is currently locked
    if (lockedUntil && lockedUntil > now) {
      const remainingMs = lockedUntil.getTime() - now.getTime();
      const remainingMinutes = Math.ceil(remainingMs / 60000);
      return { allowed: false, remainingMinutes };
    }

    // Check if we're within the rate limit window
    const lastAttempt = new Date(data.last_attempt_at);
    const timeSinceLastAttempt = now.getTime() - lastAttempt.getTime();
    const windowMs = RATE_LIMIT_WINDOW_MINUTES * 60 * 1000;

    if (timeSinceLastAttempt > windowMs) {
      // Outside the window, reset is handled in recordLoginAttempt
      return { allowed: true };
    }

    // Within the window, check attempt count
    if (data.attempt_count >= RATE_LIMIT_ATTEMPTS) {
      return { allowed: false, remainingMinutes: LOCKOUT_DURATION_MINUTES };
    }

    return { allowed: true };
  } catch (error) {
    console.error('Exception in checkRateLimit:', error);
    return { allowed: true }; // Allow on exception to not block legitimate users
  }
}

async function recordLoginAttempt(email: string, ipAddress: string, success: boolean): Promise<void> {
  try {
    const now = new Date();

    const { data: existing } = await supabaseAdmin
      .from('login_attempts')
      .select('*')
      .eq('email', email)
      .single();

    if (success) {
      // Reset on successful login
      if (existing) {
        await supabaseAdmin
          .from('login_attempts')
          .delete()
          .eq('email', email);
      }
      return;
    }

    // Failed attempt
    if (!existing) {
      // First failed attempt
      await supabaseAdmin
        .from('login_attempts')
        .insert({
          email,
          ip_address: ipAddress,
          attempt_count: 1,
          first_attempt_at: now.toISOString(),
          last_attempt_at: now.toISOString(),
        });
    } else {
      const lastAttempt = new Date(existing.last_attempt_at);
      const timeSinceLastAttempt = now.getTime() - lastAttempt.getTime();
      const windowMs = RATE_LIMIT_WINDOW_MINUTES * 60 * 1000;

      if (timeSinceLastAttempt > windowMs) {
        // Reset the counter if outside the window
        await supabaseAdmin
          .from('login_attempts')
          .update({
            attempt_count: 1,
            first_attempt_at: now.toISOString(),
            last_attempt_at: now.toISOString(),
            locked_until: null,
          })
          .eq('email', email);
      } else {
        // Increment the counter
        const newCount = existing.attempt_count + 1;
        const updates: any = {
          attempt_count: newCount,
          last_attempt_at: now.toISOString(),
        };

        // Lock the account if threshold reached
        if (newCount >= RATE_LIMIT_ATTEMPTS) {
          const lockoutUntil = new Date(now.getTime() + LOCKOUT_DURATION_MINUTES * 60 * 1000);
          updates.locked_until = lockoutUntil.toISOString();
        }

        await supabaseAdmin
          .from('login_attempts')
          .update(updates)
          .eq('email', email);
      }
    }
  } catch (error) {
    console.error('Error recording login attempt:', error);
  }
}

async function logAuthAttempt(
  email: string,
  ipAddress: string,
  userAgent: string,
  success: boolean,
  failureReason?: string
): Promise<void> {
  try {
    const sanitizedEmail = email.substring(0, 3) + '***';
    
    await supabaseAdmin
      .from('auth_logs')
      .insert({
        email: sanitizedEmail,
        ip_address: ipAddress,
        user_agent: userAgent,
        success,
        failure_reason: failureReason,
      });
  } catch (error) {
    console.error('Error logging auth attempt:', error);
  }
}

async function authenticateUser(email: string, password: string): Promise<any> {
  const payload = {
    email,
    password,
    secret: API_SECRET
  };

  let lastError: Error | null = null;
  let lastStatus: number | null = null;
  let lastResponseBody: any = null;
  let forbiddenCount = 0; // Track how many 403s we receive

  // Try each endpoint
  for (const baseUrl of API_ENDPOINTS) {
    try {
      const sanitizedEmail = email.substring(0, 3) + '***@...';
      console.log(`Attempting authentication for ${sanitizedEmail} with ${baseUrl}`);
      
      const response = await fetch(`${baseUrl}/users_api/admins/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      lastStatus = response.status;
      lastResponseBody = data;

      // Log the response for debugging
      console.log(`Response from ${baseUrl}: status=${response.status}, body=${JSON.stringify(data).substring(0, 200)}`);

      // If we get a 403, track it and continue to next endpoint
      // The credentials might be valid for a different domain
      if (response.status === 403) {
        forbiddenCount++;
        console.log(`Authentication failed with 403 for ${sanitizedEmail} at ${baseUrl}, trying next endpoint`);
        lastError = new Error(data?.message || 'Invalid credentials for this domain');
        continue;
      }

      // Check for 400 errors that might indicate validation/format issues
      if (response.status === 400) {
        const errorMessage = data?.message || data?.error || JSON.stringify(data);
        const lowerMessage = errorMessage.toLowerCase();
        
        // If the error suggests invalid format or validation issues, treat as credential error
        if (lowerMessage.includes('invalid') || 
            lowerMessage.includes('format') || 
            lowerMessage.includes('character') ||
            lowerMessage.includes('validation') ||
            lowerMessage.includes('email')) {
          console.log(`Backend validation error (400) for ${sanitizedEmail}: ${errorMessage}`);
          return {
            success: false,
            error: 'Invalid email or password format'
          };
        }
        
        // Otherwise, try next endpoint
        console.log(`Error 400 from ${baseUrl}: ${errorMessage}, trying next endpoint`);
        lastError = new Error(`Bad request: ${errorMessage}`);
        continue;
      }

      // If successful
      if (response.ok && response.status === 200) {
        console.log(`Authentication successful for ${sanitizedEmail}`);
        const cognitoData = data as CognitoResponse;
        
        // Determine admin domain based on which endpoint succeeded
        const adminDomain = baseUrl.includes('fastcorpadmin') ? 'fastcorpadmin' : 'applestoneoem';
        
        const user = {
          email: cognitoData.body.idToken.payload.email,
          username: cognitoData.body.idToken.payload['cognito:username'],
          userId: cognitoData.body.idToken.payload.sub,
          adminDomain
        };
        
        // Generate session token
        const sessionToken = await generateSessionToken(user);
        
        return {
          success: true,
          user,
          sessionToken
        };
      }

      // For other errors (500, etc.), try next endpoint
      const errorMsg = data?.message || data?.error || `Server error: ${response.status}`;
      console.log(`Error ${response.status} from ${baseUrl}: ${errorMsg}, trying next endpoint`);
      lastError = new Error(errorMsg);
      
    } catch (error) {
      const sanitizedEmail = email.substring(0, 3) + '***@...';
      console.error(`Network error for ${sanitizedEmail} with ${baseUrl}:`, error);
      lastError = error as Error;
      // Continue to next endpoint
    }
  }

  // If we've tried all endpoints and none worked
  console.error(`All endpoints failed. Last status: ${lastStatus}, Last error: ${lastError?.message}`);
  
  // If all endpoints returned 403, the credentials are truly invalid
  if (forbiddenCount === API_ENDPOINTS.length) {
    return {
      success: false,
      error: 'Invalid email or password'
    };
  }
  
  // Provide more specific error messages based on what we learned
  if (lastStatus === 400) {
    return {
      success: false,
      error: 'Invalid email or password format'
    };
  }
  
  return {
    success: false,
    error: 'Unable to connect to authentication service'
  };
}

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname.split('/').pop();

  // Handle session validation endpoint
  if (path === 'validate') {
    try {
      const authHeader = req.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(
          JSON.stringify({ valid: false, error: 'No session token provided' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const token = authHeader.substring(7);
      const result = await validateSessionToken(token);
      
      return new Response(
        JSON.stringify(result),
        { 
          status: result.valid ? 200 : 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } catch (error) {
      console.error('Error validating session:', error);
      return new Response(
        JSON.stringify({ valid: false, error: 'Validation failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  try {
    const { email, password } = await req.json() as AuthRequest;
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Validate input presence
    if (!email || !password) {
      await logAuthAttempt(email || 'unknown', ipAddress, userAgent, false, 'Missing credentials');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Email and password are required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || email.length > 255) {
      await logAuthAttempt(email, ipAddress, userAgent, false, 'Invalid email format');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid email format' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate password length
    if (password.length < 1 || password.length > 128) {
      await logAuthAttempt(email, ipAddress, userAgent, false, 'Invalid password length');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid password length' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check for potentially malicious characters in email only
    // Passwords can contain special characters and are never logged, so they're safe
    const hasInvalidEmailChars = /[<>{}\\;]/.test(email);
    if (hasInvalidEmailChars) {
      await logAuthAttempt(email, ipAddress, userAgent, false, 'Invalid characters in email');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid email format' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Check rate limit
    const rateLimitCheck = await checkRateLimit(email, ipAddress);
    if (!rateLimitCheck.allowed) {
      await logAuthAttempt(email, ipAddress, userAgent, false, 'Rate limit exceeded');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Too many login attempts. Please try again in ${rateLimitCheck.remainingMinutes} minutes.` 
        }),
        { 
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Attempt authentication
    const result = await authenticateUser(email, password);

    // Record the login attempt
    await recordLoginAttempt(email, ipAddress, result.success);

    // Log the authentication attempt
    await logAuthAttempt(
      email, 
      ipAddress, 
      userAgent, 
      result.success, 
      result.success ? undefined : result.error
    );

    return new Response(
      JSON.stringify(result),
      { 
        status: result.success ? 200 : 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in customer-auth function');
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
