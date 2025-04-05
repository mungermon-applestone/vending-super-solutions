
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/layout/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-lg px-4">
          <h1 className="text-5xl font-bold mb-6 text-vending-blue-dark">404</h1>
          <p className="text-xl text-gray-700 mb-8">
            We couldn't find the page you were looking for.
          </p>
          <div className="space-y-4">
            <p className="text-gray-600">
              The page at <span className="font-mono bg-gray-100 px-2 py-1 rounded">{location.pathname}</span> doesn't exist.
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center justify-center bg-vending-blue hover:bg-vending-blue-dark text-white font-medium py-3 px-6 rounded-md transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
