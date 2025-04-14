
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import RootLayout from '../components/RootLayout';

const NotFound = () => {
  const location = useLocation();

  return (
    <RootLayout>
      {() => (
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="text-center max-w-lg px-4">
            <h1 className="text-5xl font-bold mb-6 text-blue-600">404</h1>
            <p className="text-xl text-gray-700 mb-8">
              We couldn't find the page you were looking for.
            </p>
            <div className="space-y-4">
              <p className="text-gray-600">
                The page at <span className="font-mono bg-gray-100 px-2 py-1 rounded">{location.pathname}</span> doesn't exist.
              </p>
              <Link 
                to="/" 
                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      )}
    </RootLayout>
  );
};

export default NotFound;
