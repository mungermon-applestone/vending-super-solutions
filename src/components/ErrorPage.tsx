
import React from 'react';
import { useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError() as any;
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-4 text-2xl font-bold text-red-600">Oops!</h1>
        <p className="mb-4">Sorry, an unexpected error has occurred.</p>
        <p className="text-slate-500">
          <i>{error?.statusText || error?.message || "Unknown error"}</i>
        </p>
        <div className="mt-6">
          <a 
            href="/" 
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
