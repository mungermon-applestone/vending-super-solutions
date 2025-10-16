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
        console.error('Edge function error:', error);
        setIsLoading(false);
        
        // For non-2xx responses, Supabase still populates 'data' with the JSON response
        // Check data first before parsing the generic error object
        if (data) {
          const responseData = data as any;
          
          // Extract the actual error message from the Edge Function response
          const errorMessage = responseData.error || responseData.message;
          const isRateLimited = errorMessage?.toLowerCase().includes('too many');
          const isInvalidCreds = errorMessage?.toLowerCase().includes('invalid');
          
          console.debug('[customerLogin] Edge Function response', { 
            hasData: true, 
            errorMessage,
            isRateLimited,
            isInvalidCreds
          });
          
          if (isRateLimited) {
            return {
              success: false,
              error: errorMessage || 'Too many login attempts. Please try again in 15 minutes.'
            };
          }
          
          if (isInvalidCreds) {
            return {
              success: false,
              error: errorMessage || 'Invalid email or password'
            };
          }
          
          // Return any other specific error from the Edge Function
          if (errorMessage) {
            return {
              success: false,
              error: errorMessage
            };
          }
        }
        
        // True connection error - couldn't reach the function or parse response
        return { 
          success: false, 
          error: 'Unable to connect to authentication service' 
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
