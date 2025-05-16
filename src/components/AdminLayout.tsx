
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import AdminNavigation from './admin/AdminNavigation';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Admin sidebar */}
      <AdminNavigation />

      {/* Admin content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex h-16 items-center justify-between px-6">
            <h1 className="text-xl font-semibold">Admin Panel</h1>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-sm text-blue-600 hover:underline">
                View Site
              </Link>
            </div>
          </div>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
