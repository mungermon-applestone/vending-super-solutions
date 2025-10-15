import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import TranslatableText from '@/components/translation/TranslatableText';
import SessionTimeoutWarning from './SessionTimeoutWarning';

interface CustomerProtectedRouteProps {
  children: React.ReactNode;
}

const CustomerProtectedRoute: React.FC<CustomerProtectedRouteProps> = ({ children }) => {
  const { isCustomerAuthenticated, isLoading } = useCustomerAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-vending-blue"></div>
          <p className="mt-4 text-gray-600">
            <TranslatableText context="auth">Loading...</TranslatableText>
          </p>
        </div>
      </div>
    );
  }

  if (!isCustomerAuthenticated) {
    return <Navigate to="/customer-login" replace />;
  }

  return (
    <>
      <SessionTimeoutWarning />
      {children}
    </>
  );
};

export default CustomerProtectedRoute;