import React from "react";
import { useHelpDeskArticlesByCategory } from "@/hooks/useHelpDeskArticles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, FileText, ArrowRight, FileStack, Edit2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/seo/SEO";
import { createContentfulEditHandler } from "@/utils/contentful/urlHelpers";
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import CustomerLayout from '@/components/layout/CustomerLayout';

const KnowledgeBase: React.FC = () => {
  const { data: articlesByCategory, isLoading, error } = useHelpDeskArticlesByCategory({ enableToasts: true });
  const [searchTerm, setSearchTerm] = React.useState("");
  const { isCustomerAuthenticated } = useCustomerAuth();

  // Filter articles based on search term
  const filteredCategories = React.useMemo(() => {
    if (!articlesByCategory || !searchTerm) return articlesByCategory;

    const filtered: Record<string, typeof articlesByCategory[string]> = {};
    
    Object.entries(articlesByCategory).forEach(([category, articles]) => {
      const matchingArticles = articles.filter(article =>
        article.fields.articleTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (matchingArticles.length > 0) {
        filtered[category] = matchingArticles;
      }
    });
    
    return filtered;
  }, [articlesByCategory, searchTerm]);

  // Get total article count
  const totalArticles = React.useMemo(() => {
    if (!articlesByCategory) return 0;
    return Object.values(articlesByCategory).reduce((total, articles) => total + articles.length, 0);
  }, [articlesByCategory]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-16">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-muted-foreground">Loading knowledge base...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-16">
        <Card className="max-w-2xl mx-auto text-center">
          <CardHeader>
            <CardTitle className="text-destructive">Unable to Load Knowledge Base</CardTitle>
            <CardDescription>
              We're having trouble loading the help articles. Please try again later.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link to="/">Return to Homepage</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const content = (
    <>
      <SEO 
        title="Knowledge Base - Help Center"
        description="Find answers to common questions and learn how to make the most of our vending solutions. Browse our comprehensive knowledge base organized by topic."
        type="website"
      />
      
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="p-3 bg-primary/10 rounded-full">
                  <BookOpen className="h-12 w-12 text-primary" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Knowledge Base
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Find answers to common questions and learn how to make the most of our vending solutions. 
                Search our comprehensive help center organized by topic.
              </p>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>{totalArticles} articles</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{Object.keys(articlesByCategory || {}).length} categories</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
            
            {/* Single Page View Link */}
            <div className="mt-6 text-center">
              <Button asChild variant="outline" size="sm">
                <Link to="/knowledge-base/single-page">
                  <FileStack className="h-4 w-4 mr-2" />
                  View As Single Page (May Take a Moment to Load)
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Articles by Category */}
        <div className="container mx-auto px-4 pb-16">
          {filteredCategories && Object.keys(filteredCategories).length > 0 ? (
            <div className="space-y-12">
              {Object.entries(filteredCategories)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([category, articles]) => (
                  <section key={category} className="max-w-6xl mx-auto">
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                        <div className="w-1 h-8 bg-primary rounded-full"></div>
                        {category}
                      </h2>
                      <p className="text-muted-foreground">
                        {articles.length} article{articles.length !== 1 ? 's' : ''} in this category
                      </p>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {articles.map((article) => {
                        const slug = article.fields.articleTitle
                          .toLowerCase()
                          .replace(/[^a-z0-9\s-]/g, '')
                          .replace(/\s+/g, '-')
                          .trim();
                        
                        return (
                          <Card key={article.sys.id} className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-border/50 hover:border-primary/20">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                                <Link 
                                  to={`/knowledge-base/${encodeURIComponent(slug)}`}
                                  className="flex items-start justify-between gap-2"
                                >
                                  <span className="flex-1">{article.fields.articleTitle}</span>
                                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-0.5" />
                                </Link>
                              </CardTitle>
                            </CardHeader>
                            
                            <CardContent className="pt-0">
                              <div className="flex items-center justify-between">
                                <div>
                                  {article.fields.headingCategory && (
                                    <Badge variant="outline" className="text-xs">
                                      {article.fields.headingCategory}
                                    </Badge>
                                  )}
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={createContentfulEditHandler(article.sys.id)}
                                  className="text-xs h-7"
                                >
                                  <Edit2 className="h-3 w-3 mr-1" />
                                  Edit in Contentful
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </section>
                ))}
            </div>
          ) : searchTerm ? (
            <div className="max-w-2xl mx-auto text-center py-16">
              <div className="p-4 bg-muted/50 rounded-full w-fit mx-auto mb-6">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground mb-6">
                We couldn't find any articles matching "{searchTerm}". Try adjusting your search terms.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setSearchTerm("")}
              >
                Clear search
              </Button>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto text-center py-16">
              <div className="p-4 bg-muted/50 rounded-full w-fit mx-auto mb-6">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No articles available</h3>
              <p className="text-muted-foreground mb-6">
                We're working on creating helpful content for you. Please check back soon!
              </p>
              <Button asChild variant="outline">
                <Link to="/">Return to Homepage</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );

  // Always wrap with customer layout since this is a protected route
  return <CustomerLayout>{content}</CustomerLayout>;
};

export default KnowledgeBase;