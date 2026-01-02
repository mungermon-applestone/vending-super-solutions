import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { token } = await req.json()

    if (!token || typeof token !== 'string') {
      console.log('Preview validation failed: missing or invalid token')
      return new Response(
        JSON.stringify({ valid: false, error: 'Token is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get the server-side preview token from environment variables
    const validPreviewToken = Deno.env.get('CONTENTFUL_PREVIEW_TOKEN')
    
    if (!validPreviewToken) {
      console.error('CONTENTFUL_PREVIEW_TOKEN not configured in environment')
      return new Response(
        JSON.stringify({ valid: false, error: 'Preview service not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate the provided token against the server-side secret
    const isValid = token === validPreviewToken

    if (!isValid) {
      console.log('Preview validation failed: invalid token provided')
    } else {
      console.log('Preview validation successful')
    }

    return new Response(
      JSON.stringify({ valid: isValid }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in validate-preview function:', error)
    return new Response(
      JSON.stringify({ valid: false, error: 'Validation failed' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
