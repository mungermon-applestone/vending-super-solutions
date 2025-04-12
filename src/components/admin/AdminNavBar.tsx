
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const AdminNavBar = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Only show admin controls for admin users and on admin routes
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  if (!isAdmin && !isAdminRoute) {
    return null;
  }

  // If we're on an admin route but the user is not an admin, they should be redirected
  if (isAdminRoute && !user) {
    return (
      <div className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-bold">Admin Panel</span>
          </div>
          <Button variant="outline" onClick={() => navigate('/admin/sign-in')}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }
  
  if (!isAdminRoute || !isAdmin) {
    return null;
  }
  
  const adminRoutes = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Products', path: '/admin/products' },
    { name: 'Machines', path: '/admin/machines' },
    { name: 'Business Goals', path: '/admin/business-goals' },
    { name: 'Technology', path: '/admin/technology' },
    { name: 'Blog', path: '/admin/blog' },
    { name: 'Media', path: '/admin/media' },
    { name: 'Users', path: '/admin/users' },
  ];
  
  const isActive = (path: string): boolean => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  return (
    <div className="bg-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center py-3">
          <div className="flex items-center">
            <Link to="/admin" className="font-bold text-xl mr-8">Admin Panel</Link>
            <div className="hidden md:flex space-x-1">
              {adminRoutes.map((route) => (
                <Button
                  key={route.path}
                  variant={isActive(route.path) ? "secondary" : "ghost"}
                  className={`${isActive(route.path) ? 'bg-gray-700' : 'text-gray-300 hover:text-white hover:bg-gray-700'}`}
                  asChild
                >
                  <Link to={route.path}>{route.name}</Link>
                </Button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <>
                <span className="text-sm hidden md:inline">{user.email}</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={async () => {
                    await signOut();
                    navigate('/');
                  }}
                >
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="md:hidden overflow-x-auto">
        <div className="flex space-x-2 p-2 bg-gray-900">
          {adminRoutes.map((route) => (
            <Button
              key={route.path}
              variant={isActive(route.path) ? "secondary" : "ghost"}
              className={`${isActive(route.path) ? 'bg-gray-700' : 'text-gray-300 hover:text-white hover:bg-gray-700'} whitespace-nowrap`}
              size="sm"
              asChild
            >
              <Link to={route.path}>{route.name}</Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminNavBar;
