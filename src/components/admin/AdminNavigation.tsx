import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import {
  HomeIcon,
  LayoutDashboard,
  Settings,
  Image,
  ListOrdered,
  DatabaseIcon,
  ServerCog,
  BarChartBig,
  Aperture,
  Axe,
  FileJson
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const AdminNavigation: React.FC = () => {
  const location = useLocation();
  
  const navigationItems: NavItem[] = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/admin",
    },
    {
      title: "Products",
      icon: <ListOrdered className="h-5 w-5" />,
      href: "/admin/products",
    },
    {
      title: "Media",
      icon: <Image className="h-5 w-5" />,
      href: "/admin/media",
    },
    {
      title: "Machines",
      icon: <Aperture className="h-5 w-5" />,
      href: "/admin/machines",
    },
    {
      title: "Technologies",
      icon: <ServerCog className="h-5 w-5" />,
      href: "/admin/technologies",
    },
    {
      title: "Business Goals",
      icon: <BarChartBig className="h-5 w-5" />,
      href: "/admin/business-goals",
    },
    {
      title: "Regression Tests",
      icon: <Axe className="h-5 w-5" />,
      href: "/admin/regression-tests",
    },
    {
      title: "Data Management",
      icon: <DatabaseIcon className="h-5 w-5" />,
      href: "/admin/data-purge",
    },
    {
      title: "Contentful",
      icon: <FileJson className="h-5 w-5" />,
      href: "/admin/contentful",
    },
    {
      title: "Settings",
      icon: <Settings className="h-5 w-5" />,
      href: "/admin/settings",
    },
  ];
  
  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 h-full py-8 px-4">
      <div className="mb-8">
        <Link to="/" className="flex items-center space-x-2 font-bold text-lg text-gray-800">
          <HomeIcon className="h-6 w-6" />
          <span>Admin Panel</span>
        </Link>
      </div>
      
      <nav className="space-y-2">
        {navigationItems.map((item) => (
          <Link
            key={item.title}
            to={item.href}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200 ${location.pathname === item.href ? 'bg-gray-100 font-medium' : 'text-gray-600'}`}
          >
            {item.icon}
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminNavigation;
