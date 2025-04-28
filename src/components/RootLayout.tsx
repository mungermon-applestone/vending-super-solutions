
import React from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';

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
                <NavLink 
                  to="/" 
                  className={({ isActive }) => 
                    isActive ? "text-blue-600 font-medium" : "text-gray-800 hover:text-blue-600"
                  }
                  end
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/products" 
                  className={({ isActive }) => 
                    isActive ? "text-blue-600 font-medium" : "text-gray-800 hover:text-blue-600"
                  }
                >
                  Products
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/machines" 
                  className={({ isActive }) => 
                    isActive ? "text-blue-600 font-medium" : "text-gray-800 hover:text-blue-600"
                  }
                >
                  Machines
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/technology" 
                  className={({ isActive }) => 
                    isActive ? "text-blue-600 font-medium" : "text-gray-800 hover:text-blue-600"
                  }
                >
                  Technology
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/business-goals" 
                  className={({ isActive }) => 
                    isActive ? "text-blue-600 font-medium" : "text-gray-800 hover:text-blue-600"
                  }
                >
                  Business Goals
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/about" 
                  className={({ isActive }) => 
                    isActive ? "text-blue-600 font-medium" : "text-gray-800 hover:text-blue-600"
                  }
                >
                  About
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/blog" 
                  className={({ isActive }) => 
                    isActive ? "text-blue-600 font-medium" : "text-gray-800 hover:text-blue-600"
                  }
                >
                  Blog
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/contact" 
                  className={({ isActive }) => 
                    isActive ? "text-blue-600 font-medium" : "text-gray-800 hover:text-blue-600"
                  }
                >
                  Contact
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/admin" 
                  className={({ isActive }) => 
                    isActive ? "text-blue-600 font-medium" : "text-gray-800 hover:text-blue-600"
                  }
                >
                  Admin
                </NavLink>
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
