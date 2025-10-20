import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, FileText, MessageSquare, ShieldCheck } from 'lucide-react';
import { useCustomerAuth } from '@/context/CustomerAuthContext';

interface CustomerLayoutProps {
  children: React.ReactNode;
}

const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
  const { customerLogout, customerUser } = useCustomerAuth();
  const navigate = useNavigate();

  const adminConsoleUrl = useMemo(() => {
    if (customerUser?.email?.toLowerCase().includes('fastcorp')) {
      return 'https://console.fastcorpadmin.com/';
    }
    return 'https://console.applestoneoem.com/';
  }, [customerUser?.email]);

  const handleLogout = () => {
    customerLogout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Customer Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/knowledge-base" className="flex items-center">
              <h1 className="text-xl font-bold text-vending-blue-dark m-0">
                Applestone Solutions Customer Portal
              </h1>
            </Link>

            {/* Customer Navigation */}
            <nav className="flex items-center space-x-4">
              <Button asChild variant="ghost">
                <Link to="/knowledge-base" className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Knowledge Base</span>
                </Link>
              </Button>
              
              <Button asChild variant="ghost">
                <Link to="/support-ticket" className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Submit Support Ticket</span>
                </Link>
              </Button>

              <Button asChild variant="ghost">
                <a href={adminConsoleUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Admin Console Login</span>
                </a>
              </Button>

              <Button
                variant="outline" 
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
};

export default CustomerLayout;