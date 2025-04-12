
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface AdminNavBarProps {
  activeItem?: string;
}

const AdminNavBar: React.FC<AdminNavBarProps> = ({ activeItem }) => {
  const items = [
    { name: 'Dashboard', path: '/admin', key: 'dashboard' },
    { name: 'Products', path: '/admin/products', key: 'products' },
    { name: 'Machines', path: '/admin/machines', key: 'machines' },
    { name: 'Business Goals', path: '/admin/business-goals', key: 'business-goals' },
    { name: 'Technology', path: '/admin/technology', key: 'technology' },
    { name: 'Blog', path: '/admin/blog', key: 'blog' },
    { name: 'Case Studies', path: '/admin/case-studies', key: 'case-studies' },
    { name: 'Landing Pages', path: '/admin/landing-pages', key: 'landing-pages' },
    { name: 'Media', path: '/admin/media', key: 'media' },
    { name: 'Users', path: '/admin/users', key: 'users' },
  ];

  return (
    <div className="bg-white border-b">
      <div className="container mx-auto overflow-auto">
        <nav className="flex space-x-1 py-2">
          {items.map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap',
                  activeItem === item.key || isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                )
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default AdminNavBar;
