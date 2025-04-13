
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Database, Settings, Server, Box, Target, List, Layers } from 'lucide-react';
import { getCMSInfo } from '@/services/cms/utils/cmsInfo';

const AdminNavigation: React.FC = () => {
  const location = useLocation();
  const cmsInfo = getCMSInfo();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { 
      path: "/admin", 
      label: "Dashboard", 
      icon: <Layers className="h-4 w-4 mr-2" /> 
    },
    { 
      path: "/admin/machines", 
      label: "Machines", 
      icon: <Box className="h-4 w-4 mr-2" /> 
    },
    { 
      path: "/admin/product-types", 
      label: "Product Types", 
      icon: <List className="h-4 w-4 mr-2" /> 
    },
    { 
      path: "/admin/business-goals", 
      label: "Business Goals", 
      icon: <Target className="h-4 w-4 mr-2" /> 
    },
    { 
      path: "/admin/technologies", 
      label: "Technologies", 
      icon: <Database className="h-4 w-4 mr-2" /> 
    },
    { 
      path: "/admin/settings", 
      label: "Settings", 
      icon: <Settings className="h-4 w-4 mr-2" /> 
    }
  ];
  
  // Add Strapi integration link if Strapi is the active CMS provider
  if (cmsInfo.provider === 'Strapi') {
    navItems.splice(navItems.length - 1, 0, { 
      path: "/admin/strapi", 
      label: "Strapi Integration", 
      icon: <Server className="h-4 w-4 mr-2" /> 
    });
  }
  
  return (
    <nav className="space-y-1 py-4">
      {navItems.map((item) => (
        <Link key={item.path} to={item.path}>
          <Button
            variant={isActive(item.path) ? "default" : "ghost"}
            className={cn(
              "w-full justify-start",
              isActive(item.path) ? "" : "text-muted-foreground"
            )}
          >
            {item.icon}
            {item.label}
          </Button>
        </Link>
      ))}
    </nav>
  );
};

export default AdminNavigation;
