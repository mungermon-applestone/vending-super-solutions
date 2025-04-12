
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { LayoutDashboard, PackageSearch, Box, BarChart, BookOpen, ImageIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const AdminControls = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAuth();
  
  // Only show admin controls for admin users and on admin routes
  if (!isAdmin || !location.pathname.startsWith('/admin')) {
    return null;
  }
  
  const adminRoutes = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Products', path: '/admin/products', icon: <PackageSearch className="h-5 w-5" /> },
    { name: 'Machines', path: '/admin/machines', icon: <Box className="h-5 w-5" /> },
    { name: 'Business Goals', path: '/admin/business-goals', icon: <BarChart className="h-5 w-5" /> },
    { name: 'Technology', path: '/admin/technology', icon: <Zap className="h-5 w-5" /> },
    { name: 'Blog', path: '/admin/blog', icon: <BookOpen className="h-5 w-5" /> },
    { name: 'Media', path: '/admin/media', icon: <ImageIcon className="h-5 w-5" /> },
  ];
  
  const isActive = (path: string): boolean => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  return (
    <nav className="hidden">
      {/* The content is hidden but kept for reference */}
      <div className="p-4">
        <h2 className="text-2xl font-semibold">Admin Panel</h2>
      </div>
      <ul>
        {adminRoutes.map((route) => (
          <li key={route.path} className="mb-1">
            <button
              onClick={() => navigate(route.path)}
              className={`flex items-center w-full p-3 text-gray-300 hover:bg-gray-800 hover:text-white transition duration-200 ${
                isActive(route.path) ? 'bg-gray-800 text-white' : ''
              }`}
            >
              <span className="mr-2">{route.icon}</span>
              {route.name}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AdminControls;
