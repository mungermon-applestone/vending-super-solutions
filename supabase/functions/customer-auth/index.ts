import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

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

// Validate that required secrets are present
if (!API_SECRET) {
  console.error('CRITICAL: CUSTOMER_AUTH_API_SECRET environment variable is not set');
}

const RATE_LIMIT_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MINUTES = 15;
const LOCKOUT_DURATION_MINUTES = 15;

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

      // If we get a 403, it's an authentication error - don't try other endpoints
      if (response.status === 403) {
        console.log(`Authentication failed with 403 for ${sanitizedEmail}`);
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }

      // If successful
      if (response.ok && response.status === 200) {
        console.log(`Authentication successful for ${sanitizedEmail}`);
        const cognitoData = data as CognitoResponse;
        
        return {
          success: true,
          user: {
            email: cognitoData.body.idToken.payload.email,
            username: cognitoData.body.idToken.payload['cognito:username'],
            userId: cognitoData.body.idToken.payload.sub
          }
        };
      }

      // For other errors (400, 500), try next endpoint
      console.log(`Error ${response.status} from ${baseUrl}, trying next endpoint`);
      lastError = new Error(`Server error: ${response.status}`);
      
    } catch (error) {
      const sanitizedEmail = email.substring(0, 3) + '***@...';
      console.error(`Network error for ${sanitizedEmail} with ${baseUrl}`);
      lastError = error as Error;
      // Continue to next endpoint
    }
  }

  // If we've tried all endpoints and none worked
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

  try {
    const { email, password } = await req.json() as AuthRequest;
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Validate input
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
