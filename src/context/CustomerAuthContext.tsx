import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

  const customerLogin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('customer-auth', {
        body: { email, password }
      });

      if (error) {
        setIsLoading(false);

        // Debug the shapes (sanitized)
        try {
          console.debug('[customerLogin] raw invoke result', {
            hasData: Boolean(data),
            dataType: typeof data,
            errorName: (error as any)?.name,
            ctxType: typeof (error as any)?.context,
          });
        } catch {}

        // Helper to extract message from various shapes
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

        // 1) Try data-first (Edge Function JSON often lives here even on non-2xx)
        if (data) {
          const { msg } = tryExtractFromAny(data);
          if (msg) extractedMessage = msg;
        }

        // 2) Robustly parse FunctionsHttpError.context when data is empty or unhelpful
        if (!extractedMessage) {
          const httpError: any = error as any;
          const ctx = httpError?.context;

          // Some versions expose a direct status/code
          status = (ctx && (ctx.status ?? ctx.code)) ?? httpError?.status ?? httpError?.code;

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

        // Suppress generic Functions message
        if (extractedMessage?.toLowerCase().includes('edge function returned a non-2xx status code')) {
          extractedMessage = undefined;
        }

        const msg = (extractedMessage || '').toLowerCase();

        // Final debug with derived status/message
        try {
          console.debug('[customerLogin] invoke parse (derived)', { status, msg: extractedMessage, suppressedGeneric: !extractedMessage });
        } catch {}

        // Client-side fallback counter
        const ATTEMPTS_KEY = 'customerAuthLoginAttempts';
        const LOCKOUT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
        
        let attemptsData: { count: number; firstAttemptAt: number } | null = null;
        try {
          const stored = sessionStorage.getItem(ATTEMPTS_KEY);
          if (stored) {
            attemptsData = JSON.parse(stored);
            // Reset if window expired
            if (attemptsData && Date.now() - attemptsData.firstAttemptAt > LOCKOUT_WINDOW_MS) {
              attemptsData = null;
            }
          }
        } catch {}

        // Increment counter
        if (!attemptsData) {
          attemptsData = { count: 1, firstAttemptAt: Date.now() };
        } else {
          attemptsData.count += 1;
        }

        try {
          sessionStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attemptsData));
        } catch {}

        // 3) Prefer status mapping even if message is missing
        if (status === 429 || msg.includes('too many') || msg.includes('rate limit') || msg.includes('locked')) {
          // Clear counter on server 429
          try {
            sessionStorage.removeItem(ATTEMPTS_KEY);
          } catch {}
          return {
            success: false,
            error: extractedMessage || 'Too many login attempts. Please try again in 15 minutes.',
          };
        }

        if (status === 401 || status === 403 || msg.includes('invalid') || msg.includes('unauthorized')) {
          return {
            success: false,
            error: 'Invalid email or password',
          };
        }

        // Client-side fallback: if >= 5 attempts and no clear status/message
        if (attemptsData.count >= 5 && !status && !extractedMessage) {
          return {
            success: false,
            error: 'Too many login attempts. Please try again in 15 minutes.',
          };
        }

        // 4) If we at least have a message, surface it
        if (extractedMessage) {
          return {
            success: false,
            error: extractedMessage,
          };
        }

        // 5) True connectivity/parse failure fallback
        return {
          success: false,
          error: 'Unable to connect to authentication service',
        };
      }

      if (data.success && data.user) {
        const user: CustomerUser = {
          email: data.user.email,
          username: data.user.username,
          userId: data.user.userId
        };
        
        // Store in session with login time
        sessionStorage.setItem('customerAuth', JSON.stringify({
          isAuthenticated: true,
          email: user.email,
          username: user.username,
          userId: user.userId,
          loginTime: Date.now(),
        }));
        
        // Clear login attempts on success
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