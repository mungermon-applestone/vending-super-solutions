import React, { createContext, useContext, useState, useEffect } from 'react';

interface CustomerAuthContextType {
  isCustomerAuthenticated: boolean;
  customerLogin: (username: string, password: string) => Promise<boolean>;
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
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const customerSession = sessionStorage.getItem('customerAuth');
    if (customerSession === 'true') {
      setIsCustomerAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const customerLogin = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simple demo authentication
    if (username === 'demo' && password === 'customer') {
      sessionStorage.setItem('customerAuth', 'true');
      setIsCustomerAuthenticated(true);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const customerLogout = () => {
    sessionStorage.removeItem('customerAuth');
    setIsCustomerAuthenticated(false);
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        isCustomerAuthenticated,
        customerLogin,
        customerLogout,
        isLoading,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};