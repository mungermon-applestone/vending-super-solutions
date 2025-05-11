
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { 
  LayoutDashboard, 
  Package, 
  Monitor, 
  CircuitBoard, 
  Target, 
  FileText, 
  BookOpen, 
  BriefcaseBusiness,
  Database,
  BarChart,
  AlertTriangle
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Machines', href: '/admin/machines', icon: Monitor },
  { name: 'Technology', href: '/admin/technology', icon: CircuitBoard },
  { name: 'Business Goals', href: '/admin/business-goals', icon: Target },
  { name: 'Landing Pages', href: '/admin/landing-pages', icon: FileText },
  { name: 'Blog', href: '/admin/blog', icon: BookOpen },
  { name: 'Case Studies', href: '/admin/case-studies', icon: BriefcaseBusiness },
];

const secondaryNavigation: NavigationItem[] = [
  { name: 'Content Management', href: '/admin/contentful', icon: Database },
  { name: 'Deprecation Stats', href: '/admin/deprecation-stats', icon: AlertTriangle },
  { name: 'Performance', href: '/admin/performance-testing', icon: BarChart },
];

export default function AdminNavigation() {
  return (
    <nav className="mt-6">
      <div className="space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center py-2 px-4 text-sm font-medium rounded-md ${
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <item.icon className="mr-3 h-5 w-5 flex-shrink-0 text-gray-500" aria-hidden="true" />
            {item.name}
          </NavLink>
        ))}
      </div>
      <div className="mt-8">
        <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Administration
        </h3>
        <div className="mt-2 space-y-1">
          {secondaryNavigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center py-2 px-4 text-sm font-medium rounded-md ${
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0 text-gray-500" aria-hidden="true" />
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
