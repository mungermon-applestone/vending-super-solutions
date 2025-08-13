import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { scanHelpDeskArticlesForMissingImages, type MissingImageScanResult } from '@/utils/helpdesk/missingImageScanner';
import { getContentfulEditUrl } from '@/utils/contentful/urlHelpers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { AlertTriangle, ExternalLink, RefreshCw, Image, FileX } from 'lucide-react';
import { toast } from 'sonner';

export const MissingImageReport: React.FC = () => {
  const {
    data: scanResult,
    isLoading,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['missing-images-scan'],
    queryFn: scanHelpDeskArticlesForMissingImages,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  });

  const handleRefresh = () => {
    refetch();
    toast.info('Refreshing missing image scan...');
  };

  const handleEditArticle = async (articleId: string) => {
    try {
      const editUrl = await getContentfulEditUrl(articleId);
      window.open(editUrl, '_blank');
    } catch (error) {
      console.error('Error opening edit URL:', error);
      toast.error('Failed to open article editor');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Spinner size="lg" />
        <p className="text-muted-foreground">Scanning help desk articles for missing images...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Scan Failed
          </CardTitle>
          <CardDescription>
            Failed to scan articles: {error instanceof Error ? error.message : 'Unknown error'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!scanResult) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Scan Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Missing Image Scan Report
              </CardTitle>
              <CardDescription>
                Scanned {scanResult.totalArticlesScanned} articles on{' '}
                {scanResult.scanTimestamp.toLocaleString()}
              </CardDescription>
            </div>
            <Button 
              onClick={handleRefresh} 
              variant="outline" 
              size="sm"
              disabled={isFetching}
            >
              {isFetching ? (
                <Spinner size="sm" className="mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">
                {scanResult.totalArticlesScanned}
              </div>
              <div className="text-sm text-muted-foreground">Total Articles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">
                {scanResult.articlesWithMissingImages.length}
              </div>
              <div className="text-sm text-muted-foreground">Articles with Issues</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">
                {scanResult.totalMissingImages}
              </div>
              <div className="text-sm text-muted-foreground">Missing Images</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {scanResult.articlesWithMissingImages.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              No Missing Images Found
            </h3>
            <p className="text-muted-foreground">
              All help desk articles have valid images. Great job!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Articles with Missing Images ({scanResult.articlesWithMissingImages.length})
          </h2>
          
          {scanResult.articlesWithMissingImages.map((article) => (
            <Card key={article.id} className="border-destructive/20">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <FileX className="h-4 w-4 text-destructive" />
                      {article.title}
                    </CardTitle>
                    <CardDescription>
                      Article ID: {article.id}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">
                      {article.missingImages.length} missing
                    </Badge>
                    <Badge variant="outline">
                      {article.totalImages} total images
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Missing Images:</h4>
                  <div className="space-y-2">
                    {article.missingImages.map((missingImage, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-2 p-2 bg-muted rounded-md text-sm"
                      >
                        <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0" />
                        <div className="flex-1">
                          <div>
                            <strong>Position:</strong> {missingImage.position + 1}
                            {missingImage.assetId && (
                              <span className="ml-2">
                                <strong>Asset ID:</strong> {missingImage.assetId}
                              </span>
                            )}
                          </div>
                          {missingImage.context && (
                            <div className="text-muted-foreground text-xs">
                              Location: {missingImage.context}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2">
                    <Button 
                      onClick={() => handleEditArticle(article.id)}
                      size="sm"
                      variant="outline"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Edit in Contentful
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};