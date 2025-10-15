import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

const API_SECRET = "TkJ5Mk94N9N37yt9N}";
const API_ENDPOINTS = [
  "https://api.applestoneoem.com",
  "https://api.fastcorpadmin.com"
];

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
      console.log(`Attempting authentication with ${baseUrl}`);
      
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
        console.log('Authentication failed with 403:', data);
        const errorData = data as ErrorResponse;
        return {
          success: false,
          error: errorData.message?.replace('[403] ', '') || 'Authentication failed'
        };
      }

      // If successful
      if (response.ok && response.status === 200) {
        console.log('Authentication successful');
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
      lastError = new Error(data.message || `Server error: ${response.status}`);
      
    } catch (error) {
      console.error(`Network error with ${baseUrl}:`, error);
      lastError = error as Error;
      // Continue to next endpoint
    }
  }

  // If we've tried all endpoints and none worked
  return {
    success: false,
    error: lastError?.message || 'Unable to connect to authentication service'
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, password } = await req.json() as AuthRequest;

    // Validate input
    if (!email || !password) {
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

    // Attempt authentication
    const result = await authenticateUser(email, password);

    return new Response(
      JSON.stringify(result),
      { 
        status: result.success ? 200 : 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in customer-auth function:', error);
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
