import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Customer Authentication Context
 * 
 * This context manages customer authentication state with a dual-layer security approach:
 * 
 * 1. **Server-Side Rate Limiting**: The Edge Function enforces a 15-minute lockout after 5 failed attempts
 * 2. **Client-Side Fallback**: Tracks failed attempts in sessionStorage as a safety net when server errors aren't parseable
 * 
 * **Session Management**:
 * - Inactivity timeout: 15 minutes (warning at 13 minutes)
 * - Absolute session timeout: 2 hours
 * - Session data stored in sessionStorage for persistence across page refreshes
 * 
 * **Critical Error Handling**:
 * Supabase Functions can return errors in multiple inconsistent formats:
 * - Sometimes `data` contains the error JSON even on non-2xx responses
 * - Sometimes `error.context` contains response details as a string or object
 * - Sometimes only generic messages like "Edge Function returned a non-2xx status code"
 * 
 * To handle this, we use a three-layer parsing approach:
 * 1. Try extracting from `data` first
 * 2. Parse `error.context` in all its possible shapes
 * 3. Use client-side attempt counter as fallback when server errors aren't parseable
 * 
 * **SessionStorage Keys**:
 * - `customerAuth`: Stores authenticated user session data
 * - `customerAuthLoginAttempts`: Tracks failed login attempts for client-side fallback
 */

interface CustomerUser {
  email: string;
  username: string;
  userId: string;
}

interface CustomerAuthContextType {
  isCustomerAuthenticated: boolean;
  customerUser: CustomerUser | null;
  customerLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  customerLogout: () => void;
  isLoading: boolean;
  showTimeoutWarning: boolean;
  extendSession: () => void;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (context === undefined) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
};

const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes
const ABSOLUTE_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours
const WARNING_BEFORE_TIMEOUT = 2 * 60 * 1000; // 2 minutes warning

export const CustomerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCustomerAuthenticated, setIsCustomerAuthenticated] = useState(false);
  const [customerUser, setCustomerUser] = useState<CustomerUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const { toast } = useToast();

  // Track user activity
  useEffect(() => {
    const handleActivity = () => {
      setLastActivity(Date.now());
      setShowTimeoutWarning(false);
    };

    const events = ['mousemove', 'keypress', 'click', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, []);

  // Check session validity
  useEffect(() => {
    const interval = setInterval(() => {
      const sessionData = sessionStorage.getItem('customerAuth');
      if (sessionData && isCustomerAuthenticated) {
        const { loginTime } = JSON.parse(sessionData);
        const now = Date.now();
        const sessionAge = now - loginTime;
        const timeSinceActivity = now - lastActivity;

        // Absolute timeout: 2 hours
        if (sessionAge > ABSOLUTE_TIMEOUT) {
          customerLogout();
          toast({
            title: "Session Expired",
            description: "Your session has expired. Please log in again.",
            variant: "destructive",
          });
          return;
        }

        // Show warning at 13 minutes of inactivity
        if (timeSinceActivity > (INACTIVITY_TIMEOUT - WARNING_BEFORE_TIMEOUT) && 
            timeSinceActivity < INACTIVITY_TIMEOUT) {
          setShowTimeoutWarning(true);
        }

        // Inactivity timeout: 15 minutes
        if (timeSinceActivity > INACTIVITY_TIMEOUT) {
          customerLogout();
          toast({
            title: "Logged Out",
            description: "You have been logged out due to inactivity.",
            variant: "destructive",
          });
        }
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [lastActivity, isCustomerAuthenticated]);

  // Check for existing session on mount
  useEffect(() => {
    const sessionData = sessionStorage.getItem('customerAuth');
    if (sessionData) {
      try {
        const { isAuthenticated, email, username, userId } = JSON.parse(sessionData);
        if (isAuthenticated && email) {
          setIsCustomerAuthenticated(true);
          setCustomerUser({ email, username, userId });
        }
      } catch (error) {
        console.error('Error parsing session data:', error);
        sessionStorage.removeItem('customerAuth');
      }
    }
    setIsLoading(false);
  }, []);

  /**
   * Customer Login Function
   * 
   * Authenticates a customer via the customer-auth Edge Function and handles
   * complex error parsing to provide clear user-facing messages.
   * 
   * @param email - Customer email address
   * @param password - Customer password
   * @returns Promise with success status and optional error message
   * 
   * **Error Handling Strategy**:
   * This function implements robust error parsing because Supabase Functions return
   * errors in inconsistent formats depending on the version and error type.
   * 
   * See inline comments below for details on the three-layer parsing approach.
   */
  const customerLogin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('customer-auth', {
        body: { email, password }
      });

      if (error) {
        setIsLoading(false);

        /**
         * ⚠️ CRITICAL ERROR PARSING SECTION
         * 
         * DO NOT SIMPLIFY THIS CODE without understanding all possible error shapes!
         * 
         * Supabase Functions return errors in multiple inconsistent formats:
         * - Old versions: error.context as string containing JSON
         * - New versions: error.context as object with nested body
         * - Sometimes: data contains error JSON even on non-2xx status
         * - Generic fallback: "Edge Function returned a non-2xx status code"
         * 
         * We must handle ALL these cases to provide accurate user-facing messages.
         */

        // Debug the shapes (sanitized - no sensitive data)
        try {
          console.debug('[customerLogin] raw invoke result', {
            hasData: Boolean(data),
            dataType: typeof data,
            errorName: (error as any)?.name,
            ctxType: typeof (error as any)?.context,
          });
        } catch {}

        /**
         * Helper function to extract error messages from various data shapes.
         * Handles both string (JSON) and object formats.
         */
        const tryExtractFromAny = (v: unknown): { msg?: string } => {
          if (!v) return {};
          if (typeof v === 'string') {
            try {
              const parsed = JSON.parse(v);
              return { msg: parsed?.error || parsed?.message || parsed?.body?.error || parsed?.body?.message };
            } catch {
              return {};
            }
          }
          if (typeof v === 'object') {
            const obj = v as any;
            return { msg: obj?.error || obj?.message || obj?.body?.error || obj?.body?.message };
          }
          return {};
        };

        let extractedMessage: string | undefined;
        let status: number | undefined;

        /**
         * LAYER 1: Data-First Parsing
         * Edge Function JSON responses often appear in `data` even on non-2xx status codes
         */
        if (data) {
          const { msg } = tryExtractFromAny(data);
          if (msg) extractedMessage = msg;
        }

        /**
         * LAYER 2: Context Parsing
         * When data is empty/unhelpful, parse error.context in all its possible formats.
         * Context can be a string (JSON), an object, or contain nested response objects.
         */
        if (!extractedMessage) {
          const httpError: any = error as any;
          const ctx = httpError?.context;

          // Extract status from multiple possible locations
          status = (ctx && (ctx.status ?? ctx.code)) ?? httpError?.status ?? httpError?.code;

          // Handle string context (older Supabase versions return JSON as string)
          if (typeof ctx === 'string') {
            try {
              const parsed = JSON.parse(ctx);
              extractedMessage =
                parsed?.error || parsed?.message || parsed?.body?.error || parsed?.body?.message;
              status = parsed?.status ?? status;
            } catch {/* ignore */}
          } else if (typeof ctx === 'object' && ctx) {
            // Many functions put details in ctx.body
            const { msg } = tryExtractFromAny((ctx as any).body ?? ctx);
            if (msg) extractedMessage = msg;

            // Some shapes carry status at ctx.response?.status
            if (!status && (ctx as any).response?.status) {
              status = (ctx as any).response.status;
            }
            // Also consider top-level fields
            if (!extractedMessage) {
              extractedMessage =
                (ctx as any)?.error ||
                (ctx as any)?.message ||
                (ctx as any)?.body?.error ||
                (ctx as any)?.body?.message;
            }
            if (!status && ((ctx as any)?.status || (ctx as any)?.code)) {
              status = (ctx as any)?.status ?? (ctx as any)?.code;
            }
          }

          // Final fallback to the error message string
          if (!extractedMessage && httpError?.message && typeof httpError.message === 'string') {
            extractedMessage = httpError.message;
          }
        }

        /**
         * ⚠️ CRITICAL: Suppress unhelpful generic message
         * 
         * Some Supabase versions return "Edge Function returned a non-2xx status code"
         * which provides no value to users. We suppress it to fall back to status-based
         * or client-side fallback messages instead.
         */
        if (extractedMessage?.toLowerCase().includes('edge function returned a non-2xx status code')) {
          extractedMessage = undefined;
        }

        // Convert to lowercase for keyword matching (preserving original for display)
        const msg = (extractedMessage || '').toLowerCase();

        // Final debug with derived status/message
        try {
          console.debug('[customerLogin] invoke parse (derived)', { status, msg: extractedMessage, suppressedGeneric: !extractedMessage });
        } catch {}

        /**
         * LAYER 3: Client-Side Fallback Counter
         * 
         * ⚠️ WARNING: This is a SAFETY NET for when server errors aren't parseable!
         * 
         * Primary rate limiting happens server-side in the Edge Function.
         * This counter ensures we still show proper messages even when:
         * - The server returns generic/unparseable errors
         * - Network issues prevent proper error transmission
         * - Supabase client library changes error format again
         * 
         * The counter tracks failed attempts in sessionStorage with a 15-minute window
         * matching the server-side lockout duration.
         */
        const ATTEMPTS_KEY = 'customerAuthLoginAttempts';
        const LOCKOUT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes (matches server lockout)
        
        let attemptsData: { count: number; firstAttemptAt: number } | null = null;
        // Load existing attempts data from sessionStorage
        try {
          const stored = sessionStorage.getItem(ATTEMPTS_KEY);
          if (stored) {
            attemptsData = JSON.parse(stored);
            // Reset counter if 15-minute lockout window has expired
            if (attemptsData && Date.now() - attemptsData.firstAttemptAt > LOCKOUT_WINDOW_MS) {
              attemptsData = null;
            }
          }
        } catch {}

        // Increment failure counter (starts at 1 for first failure)
        if (!attemptsData) {
          attemptsData = { count: 1, firstAttemptAt: Date.now() };
        } else {
          attemptsData.count += 1;
        }

        // Persist updated attempt count
        try {
          sessionStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attemptsData));
        } catch {}

        /**
         * ⚠️ STATUS-BASED MESSAGE MAPPING
         * 
         * IMPORTANT: Always check BOTH status codes AND keywords!
         * - Status codes may be missing in some error formats
         * - Keywords ensure we catch server messages even without status
         * 
         * Priority order:
         * 1. Rate limit (429 or keywords) → Show lockout message
         * 2. Auth failure (401/403 or keywords) → Show credential error
         * 3. Client-side fallback (≥5 attempts) → Show lockout message
         * 4. Any other extracted message → Display as-is
         * 5. True connectivity failure → Generic error
         */
        // RATE LIMIT: Server confirmed lockout
        if (status === 429 || msg.includes('too many') || msg.includes('rate limit') || msg.includes('locked')) {
          // Clear client counter since server is handling rate limiting
          try {
            sessionStorage.removeItem(ATTEMPTS_KEY);
          } catch {}
          return {
            success: false,
            error: extractedMessage || 'Too many login attempts. Please try again in 15 minutes.',
          };
        }

        // INVALID CREDENTIALS: Auth failure
        if (status === 401 || status === 403 || msg.includes('invalid') || msg.includes('unauthorized')) {
          return {
            success: false,
            error: 'Invalid email or password',
          };
        }

        /**
         * CLIENT-SIDE FALLBACK: Show lockout after 5 unparseable failures
         * 
         * This only triggers when we have NO clear status/message from the server.
         * It prevents users from being stuck with generic errors during actual lockouts.
         */
        if (attemptsData.count >= 5 && !status && !extractedMessage) {
          return {
            success: false,
            error: 'Too many login attempts. Please try again in 15 minutes.',
          };
        }

        // EXTRACTED MESSAGE: Display any other server message we successfully parsed
        if (extractedMessage) {
          return {
            success: false,
            error: extractedMessage,
          };
        }

        // CONNECTIVITY FAILURE: True network/parse failure (rare)
        return {
          success: false,
          error: 'Unable to connect to authentication service',
        };
      }

      /**
       * SUCCESS PATH: User authenticated successfully
       * 
       * Store session data in sessionStorage for persistence across page refreshes.
       * loginTime is used for absolute session timeout (2 hours) and inactivity tracking.
       */
      if (data.success && data.user) {
        const user: CustomerUser = {
          email: data.user.email,
          username: data.user.username,
          userId: data.user.userId
        };
        
        // Store authenticated session with timestamp for timeout tracking
        sessionStorage.setItem('customerAuth', JSON.stringify({
          isAuthenticated: true,
          email: user.email,
          username: user.username,
          userId: user.userId,
          loginTime: Date.now(), // Used for absolute timeout and inactivity tracking
        }));
        
        /**
         * Clear failed login attempts counter on successful authentication.
         * This ensures the counter resets when user successfully logs in.
         */
        try {
          sessionStorage.removeItem('customerAuthLoginAttempts');
        } catch {}
        
        setIsCustomerAuthenticated(true);
        setCustomerUser(user);
        setLastActivity(Date.now());
        setIsLoading(false);
        
        toast({
          title: "Login Successful",
          description: `Welcome back, ${user.username}!`,
        });
        
        return { success: true };
      } else {
        setIsLoading(false);
        // Handle rate limiting and other errors with generic message
        const errorMessage = data.error?.includes('Too many login attempts') 
          ? data.error 
          : 'Invalid email or password';
        
        return { 
          success: false, 
          error: errorMessage
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return { 
        success: false, 
        error: 'An unexpected error occurred. Please try again.' 
      };
    }
  };

  const customerLogout = () => {
    sessionStorage.removeItem('customerAuth');
    setIsCustomerAuthenticated(false);
    setCustomerUser(null);
    setShowTimeoutWarning(false);
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const extendSession = () => {
    setLastActivity(Date.now());
    setShowTimeoutWarning(false);
    toast({
      title: "Session Extended",
      description: "Your session has been extended.",
    });
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        isCustomerAuthenticated,
        customerUser,
        customerLogin,
        customerLogout,
        isLoading,
        showTimeoutWarning,
        extendSession,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};