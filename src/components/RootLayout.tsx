
import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const RootLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="text-xl font-bold">Application</Link>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link to="/" className="text-gray-800 hover:text-blue-600">Home</Link>
              </li>
              <li>
                <Link to="/admin" className="text-gray-800 hover:text-blue-600">Admin</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 py-6 text-white">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Application. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default RootLayout;
