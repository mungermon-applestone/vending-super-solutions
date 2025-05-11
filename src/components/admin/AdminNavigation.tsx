
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
  AlertTriangle,
  CheckSquare,
  Check,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CONTENT_TYPE_MIGRATION_STATUS } from '@/services/cms/constants';

interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  contentType?: string; // Optional reference to content type for migration status
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package, contentType: 'product' },
  { name: 'Machines', href: '/admin/machines', icon: Monitor, contentType: 'machine' },
  { name: 'Technology', href: '/admin/technology', icon: CircuitBoard, contentType: 'technology' },
  { name: 'Business Goals', href: '/admin/business-goals', icon: Target, contentType: 'businessGoal' },
  { name: 'Landing Pages', href: '/admin/landing-pages', icon: FileText, contentType: 'landingPage' },
  { name: 'Blog', href: '/admin/blog', icon: BookOpen, contentType: 'blog' },
  { name: 'Case Studies', href: '/admin/case-studies', icon: BriefcaseBusiness, contentType: 'caseStudy' },
];

const secondaryNavigation: NavigationItem[] = [
  { name: 'Contentful CMS', href: '/admin/contentful', icon: Database },
  { name: 'Migration Tasks', href: '/admin/migration-tasks', icon: CheckSquare },
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
              cn(
                "flex items-center py-2 px-4 text-sm font-medium rounded-md",
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )
            }
          >
            <item.icon className="mr-3 h-5 w-5 flex-shrink-0 text-gray-500" aria-hidden="true" />
            <span className="flex-1">{item.name}</span>
            {item.contentType && renderMigrationStatus(item.contentType)}
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
                cn(
                  "flex items-center py-2 px-4 text-sm font-medium rounded-md",
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )
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

function renderMigrationStatus(contentType: string) {
  const status = CONTENT_TYPE_MIGRATION_STATUS[contentType] || 'pending';
  
  switch (status) {
    case 'completed':
      return (
        <span className="inline-flex items-center ml-2 px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
          <Check className="h-3 w-3 mr-0.5" />
        </span>
      );
    case 'in-progress':
      return (
        <span className="inline-flex items-center ml-2 px-1.5 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
          <Clock className="h-3 w-3 mr-0.5" />
        </span>
      );
    default:
      return null;
  }
}
