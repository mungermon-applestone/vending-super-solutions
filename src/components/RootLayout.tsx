
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Header from './layout/Header';
import Footer from './layout/Footer';

const RootLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      {/* Main content */}
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 py-6 text-white">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Applestone Solutions. All rights reserved.</p>
          <div className="mt-2">
            <Link to="/admin" className="text-xs text-gray-400 hover:text-white">
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RootLayout;
