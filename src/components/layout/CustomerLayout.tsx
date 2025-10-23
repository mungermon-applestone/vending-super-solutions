import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, FileText, MessageSquare, ShieldCheck, Menu, X } from 'lucide-react';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface CustomerLayoutProps {
  children: React.ReactNode;
}

const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
  const { customerLogout, customerUser } = useCustomerAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const adminConsoleUrl = useMemo(() => {
    const domain = customerUser?.adminDomain || 'applestoneoem';
    return `https://console.${domain}.com/`;
  }, [customerUser?.adminDomain]);

  const handleLogout = () => {
    customerLogout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Customer Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-2 md:py-0">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
            <Link to="/knowledge-base" className="flex items-center">
              <h1 className="text-lg md:text-xl font-bold text-vending-blue-dark m-0">
                <span className="hidden md:inline">Applestone Solutions Customer Portal</span>
                <span className="md:hidden">Customer Portal</span>
              </h1>
            </Link>

            {/* Desktop Navigation */}
            {!isMobile && (
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
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Navigation Panel */}
      {isMobile && isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Slide-out Menu */}
          <div className="fixed top-0 right-0 bottom-0 w-72 bg-white shadow-xl z-50 flex flex-col">
            {/* Close Button */}
            <div className="flex justify-end p-4 border-b">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 flex flex-col p-4 space-y-2">
              <Button 
                asChild 
                variant="ghost" 
                className="justify-start h-12"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link to="/knowledge-base" className="flex items-center space-x-3">
                  <FileText className="h-5 w-5" />
                  <span className="text-base">Knowledge Base</span>
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="ghost" 
                className="justify-start h-12"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link to="/support-ticket" className="flex items-center space-x-3">
                  <MessageSquare className="h-5 w-5" />
                  <span className="text-base">Submit Support Ticket</span>
                </Link>
              </Button>

              <Button 
                asChild 
                variant="ghost" 
                className="justify-start h-12"
              >
                <a href={adminConsoleUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3">
                  <ShieldCheck className="h-5 w-5" />
                  <span className="text-base">Admin Console Login</span>
                </a>
              </Button>

              {/* Spacer to push logout to bottom */}
              <div className="flex-1" />

              <Button
                variant="outline" 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="justify-start h-12 mt-4"
              >
                <LogOut className="h-5 w-5 mr-3" />
                <span className="text-base">Logout</span>
              </Button>
            </nav>
          </div>
        </>
      )}

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
};

export default CustomerLayout;