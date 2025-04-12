
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  PackageSearch, 
  Box, 
  BarChart, 
  Zap, 
  BookOpen, 
  ImageIcon,
  UserCog,
  LogOut
} from 'lucide-react';

const AdminNavBar: React.FC = () => {
  const { signOut, isAdmin } = useAuth();
  const location = useLocation();
  
  if (!isAdmin) return null;
  
  const adminRoutes = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="h-4 w-4" /> },
    { name: 'Products', path: '/admin/products', icon: <PackageSearch className="h-4 w-4" /> },
    { name: 'Machines', path: '/admin/machines', icon: <Box className="h-4 w-4" /> },
    { name: 'Business Goals', path: '/admin/business-goals', icon: <BarChart className="h-4 w-4" /> },
    { name: 'Technology', path: '/admin/technology', icon: <Zap className="h-4 w-4" /> },
    { name: 'Blog', path: '/admin/blog', icon: <BookOpen className="h-4 w-4" /> },
    { name: 'Media', path: '/admin/media', icon: <ImageIcon className="h-4 w-4" /> },
    { name: 'Admin Users', path: '/admin/users', icon: <UserCog className="h-4 w-4" /> },
  ];
  
  const isActive = (path: string): boolean => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  return (
    <div className="bg-gray-900 text-white px-4 py-2 w-full sticky top-0 z-40">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-1 overflow-x-auto">
          {adminRoutes.map((route) => (
            <Button
              key={route.path}
              asChild
              variant={isActive(route.path) ? "default" : "ghost"}
              size="sm"
              className={isActive(route.path) ? "" : "hover:bg-gray-700 text-white"}
            >
              <Link to={route.path} className="flex items-center">
                <span className="mr-1">{route.icon}</span>
                <span className="hidden sm:inline">{route.name}</span>
              </Link>
            </Button>
          ))}
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => signOut()}
          className="hover:bg-gray-700 text-white"
        >
          <LogOut className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      </div>
    </div>
  );
};

export default AdminNavBar;
