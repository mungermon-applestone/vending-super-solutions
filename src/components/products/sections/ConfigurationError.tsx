
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DebugInfo {
  spaceId?: string;
  environmentId?: string;
  hasToken: boolean;
}

interface ConfigurationErrorProps {
  debugInfo: DebugInfo;
}

const ConfigurationError = ({ debugInfo }: ConfigurationErrorProps) => {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-md p-6 text-center mb-8">
      <h3 className="text-lg font-semibold text-amber-800 mb-2">Contentful Configuration Missing</h3>
      <p className="text-amber-700 mb-4">
        Please set up your Contentful environment variables to display product data.
      </p>
      <div className="text-sm bg-white p-3 rounded border border-amber-100 mx-auto max-w-lg mb-4">
        <p className="font-mono mb-1">VITE_CONTENTFUL_SPACE_ID: {debugInfo.spaceId || 'Not set'}</p>
        <p className="font-mono mb-1">VITE_CONTENTFUL_ENVIRONMENT_ID: {debugInfo.environmentId || 'Not set'}</p>
        <p className="font-mono">CONTENTFUL_DELIVERY_TOKEN: {debugInfo.hasToken ? 'Set' : 'Not set'}</p>
      </div>
      <p className="text-xs text-gray-500">
        Note: These environment variables must be set in your deployment environment.
      </p>
    </div>
  );
};

export default ConfigurationError;
