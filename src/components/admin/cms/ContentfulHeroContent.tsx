
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useContentfulHeroes } from '@/hooks/cms/useContentfulHero';
import { PlusCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContentfulHeroContent: React.FC = () => {
  const { data: heroes = [], isLoading, error, refetch } = useContentfulHeroes();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const getPageUrl = (pageKey: string) => {
    switch (pageKey) {
      case 'home': return '/';
      case 'products': return '/products';
      case 'machines': return '/machines';
      case 'business-goals': return '/business-goals';
      case 'technology': return '/technology';
      case 'contact': return '/contact';
      case 'about': return '/about';
      case 'services': return '/services';
      default: return '/';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Hero Content Management</span>
          <Button size="sm" variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardTitle>
        <CardDescription>
          Manage page hero content in Contentful
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="mb-6">
          <Button
            onClick={() => window.open('https://app.contentful.com/', '_blank')}
            className="flex items-center"
            variant="outline"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Contentful to Create Hero Content
          </Button>
          <div className="mt-2 text-sm text-muted-foreground">
            <p>Use the "Hero Content" model in Contentful to create and edit hero sections.</p>
            <p>Remember to set the pageKey field to match the page you want the hero to appear on.</p>
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Content</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="machines">Machines</TabsTrigger>
            <TabsTrigger value="business-goals">Business Goals</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border rounded-md p-4">
                    <Skeleton className="h-8 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                ))}
              </div>
            ) : heroes.length === 0 ? (
              <div className="text-center py-8 border rounded-md">
                <p className="text-muted-foreground mb-4">No hero content found in Contentful</p>
                <Button
                  onClick={() => window.open('https://app.contentful.com/', '_blank')}
                  variant="default"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Hero Content in Contentful
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {heroes.map((hero) => (
                  <div key={hero.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{hero.title}</h3>
                        <p className="text-sm text-muted-foreground">Page: {hero.pageKey}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(getPageUrl(hero.pageKey), '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Page
                      </Button>
                    </div>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm line-clamp-3">{hero.subtitle}</p>
                        {hero.primaryButtonText && (
                          <p className="text-xs mt-2">
                            Primary CTA: {hero.primaryButtonText} → {hero.primaryButtonUrl}
                          </p>
                        )}
                        {hero.secondaryButtonText && (
                          <p className="text-xs mt-1">
                            Secondary CTA: {hero.secondaryButtonText} → {hero.secondaryButtonUrl}
                          </p>
                        )}
                      </div>
                      <div>
                        {hero.image?.url && (
                          <img
                            src={hero.image.url}
                            alt={hero.image.alt}
                            className="w-full h-32 object-cover rounded"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="products">
            <HeroContentByType heroes={heroes} type="products" isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="machines">
            <HeroContentByType heroes={heroes} type="machines" isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="business-goals">
            <HeroContentByType heroes={heroes} type="business-goals" isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Note: To edit hero content, you need to use the Contentful web interface directly.
        </p>
      </CardFooter>
    </Card>
  );
};

// Helper component to filter heroes by page key
const HeroContentByType: React.FC<{
  heroes: any[];
  type: string;
  isLoading: boolean;
}> = ({ heroes, type, isLoading }) => {
  const filtered = heroes.filter(hero => hero.pageKey === type);

  if (isLoading) {
    return (
      <div className="border rounded-md p-4">
        <Skeleton className="h-8 w-1/3 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md">
        <p className="text-muted-foreground mb-4">No hero content found for {type}</p>
        <Button
          onClick={() => window.open('https://app.contentful.com/', '_blank')}
          variant="default"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Hero Content for {type}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filtered.map((hero) => (
        <div key={hero.id} className="border rounded-md p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{hero.title}</h3>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => window.open(`/${type}`, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Page
            </Button>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm line-clamp-3">{hero.subtitle}</p>
              {hero.primaryButtonText && (
                <p className="text-xs mt-2">
                  Primary CTA: {hero.primaryButtonText} → {hero.primaryButtonUrl}
                </p>
              )}
              {hero.secondaryButtonText && (
                <p className="text-xs mt-1">
                  Secondary CTA: {hero.secondaryButtonText} → {hero.secondaryButtonUrl}
                </p>
              )}
            </div>
            <div>
              {hero.image?.url && (
                <img
                  src={hero.image.url}
                  alt={hero.image.alt}
                  className="w-full h-32 object-cover rounded"
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContentfulHeroContent;
