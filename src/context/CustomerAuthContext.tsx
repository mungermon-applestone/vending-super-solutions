import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (context === undefined) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
};

export const CustomerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCustomerAuthenticated, setIsCustomerAuthenticated] = useState(false);
  const [customerUser, setCustomerUser] = useState<CustomerUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        
        // Store in session
        sessionStorage.setItem('customerAuth', JSON.stringify({
          isAuthenticated: true,
          email: user.email,
          username: user.username,
          userId: user.userId
        }));
        
        setIsCustomerAuthenticated(true);
        setCustomerUser(user);
        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { 
          success: false, 
          error: data.error || 'Authentication failed' 
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
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        isCustomerAuthenticated,
        customerUser,
        customerLogin,
        customerLogout,
        isLoading,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};