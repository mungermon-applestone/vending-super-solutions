/**
 * Preview wrapper component for Contentful draft content
 */

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { validatePreviewToken } from '@/config/preview';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Eye } from 'lucide-react';

interface PreviewWrapperProps {
  children: React.ReactNode;
}

export function PreviewWrapper({ children }: PreviewWrapperProps) {
  const [searchParams] = useSearchParams();
  const [isValidToken, setIsValidToken] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setIsValidToken(false);
        setIsChecking(false);
        return;
      }

      try {
        const valid = await validatePreviewToken(token);
        setIsValidToken(valid);
      } catch (error) {
        console.error('Token validation error:', error);
        setIsValidToken(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkToken();
  }, [searchParams]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Validating preview access...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-muted-foreground">
              Invalid or missing preview token. This content is not publicly accessible.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Preview Banner */}
      <div className="bg-warning/20 border-b border-warning/30 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
          <Eye className="h-4 w-4 text-warning-foreground" />
          <span className="font-medium text-warning-foreground">
            Preview Mode - Draft Content
          </span>
          <span className="text-warning-foreground/70">
            This content is not published and only visible with a valid preview token
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div>{children}</div>
    </div>
  );
}
