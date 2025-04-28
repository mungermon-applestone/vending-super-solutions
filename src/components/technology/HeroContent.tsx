
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

interface HeroContentProps {
  title: string;
  subtitle: string;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  error?: Error | unknown;
  isUsingFallback: boolean;
  entryId: string;
}

const HeroContent: React.FC<HeroContentProps> = ({
  title,
  subtitle,
  primaryButtonText,
  primaryButtonUrl,
  secondaryButtonText,
  secondaryButtonUrl,
  error,
  isUsingFallback,
  entryId,
}) => {
  return (
    <div className="space-y-6">
      {isUsingFallback && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-6">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
            <div>
              <p className="text-sm text-amber-800">
                {error instanceof Error && error.message === 'CONTENTFUL_CONFIG_MISSING' 
                  ? "Contentful is not configured. Using fallback content." 
                  : error instanceof Error && error.message.includes('CONTENTFUL_ENTRY_NOT_FOUND')
                    ? `Content entry (${entryId}) not found in Contentful`
                    : "Error loading content from Contentful. Using fallback content."}
              </p>
              {error instanceof Error && error.message === 'CONTENTFUL_CONFIG_MISSING' && (
                <p className="text-xs text-amber-700 mt-1">Configure Contentful in Admin → Environment Variables</p>
              )}
              
              {/* Development Mode Diagnostics */}
              {process.env.NODE_ENV === 'development' && error && (
                <details className="mt-2 text-xs text-amber-700">
                  <summary>Error Details</summary>
                  <pre className="p-2 bg-amber-100 rounded mt-1 overflow-auto max-h-40">
                    {error instanceof Error 
                      ? `${error.name}: ${error.message}\n${error.stack || "No stack trace"}` 
                      : JSON.stringify(error, null, 2)}
                  </pre>
                  <p className="mt-1">Entry ID: {entryId}</p>
                </details>
              )}
            </div>
          </div>
        </div>
      )}

      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-vending-blue-dark">
        {title}
      </h1>
      <p className="text-xl text-gray-700">
        {subtitle}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        {primaryButtonText && (
          <Button asChild size="lg">
            <Link to={primaryButtonUrl || '#'}>
              {primaryButtonText}
            </Link>
          </Button>
        )}
        
        {secondaryButtonText && (
          <Button asChild variant="outline" size="lg">
            <Link to={secondaryButtonUrl || '#'}>
              {secondaryButtonText}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default HeroContent;
