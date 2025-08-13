import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useHelpDeskArticleBySlug } from "@/hooks/useHelpDeskArticles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Tag, Clock, Edit2 } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import SEO from "@/components/seo/SEO";
import { renderRichText } from "@/utils/contentful/richTextRenderer";
import { createContentfulEditHandler } from "@/utils/contentful/urlHelpers";

const KnowledgeBaseArticle: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const { data: article, isLoading, error } = useHelpDeskArticleBySlug(
    slug ? decodeURIComponent(slug) : undefined,
    { enableToasts: true }
  );

  if (isLoading) {
    return (
      <div className="container mx-auto py-16">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-10 w-24 bg-muted rounded"></div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-destructive">Article Not Found</CardTitle>
              <CardDescription>
                {error 
                  ? "We're having trouble loading this article. Please try again later."
                  : "The article you're looking for doesn't exist or has been moved."
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3 justify-center">
                <Button asChild variant="outline">
                  <Link to="/knowledge-base">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Knowledge Base
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/">Return to Homepage</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const publishedDate = article.sys.publishedAt ? new Date(article.sys.publishedAt) : null;
  const updatedDate = new Date(article.sys.updatedAt);

  return (
    <>
      <SEO 
        title={`${article.fields.articleTitle} - Knowledge Base`}
        description={`Learn about ${article.fields.articleTitle}. Find step-by-step instructions and helpful information in our knowledge base.`}
        type="article"
        openGraph={{
          title: article.fields.articleTitle,
          description: `Learn about ${article.fields.articleTitle}. Find step-by-step instructions and helpful information in our knowledge base.`,
          type: 'article'
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/10">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Navigation */}
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="mb-4 -ml-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <nav className="text-sm text-muted-foreground">
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <span className="mx-2">→</span>
                <Link to="/knowledge-base" className="hover:text-primary transition-colors">
                  Knowledge Base
                </Link>
                <span className="mx-2">→</span>
                <span className="text-foreground">
                  {article.fields.articleTitle}
                </span>
              </nav>
            </div>

            {/* Article Header */}
            <header className="mb-12">
              <div className="space-y-6">
                {/* Categories */}
                <div className="flex flex-wrap gap-2">
                  {article.fields.sectionCategory && (
                    <Badge variant="secondary" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {article.fields.sectionCategory}
                    </Badge>
                  )}
                  {article.fields.headingCategory && (
                    <Badge variant="outline" className="text-xs">
                      {article.fields.headingCategory}
                    </Badge>
                  )}
                </div>

                {/* Title */}
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-3xl md:text-4xl font-bold leading-tight flex-1">
                    {article.fields.articleTitle}
                  </h1>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={createContentfulEditHandler(article.sys.id)}
                    className="shrink-0"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit in Contentful
                  </Button>
                </div>

                {/* Meta Information */}
                <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                  {publishedDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Published {format(publishedDate, "MMM d, yyyy")}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      Updated {formatDistanceToNow(updatedDate, { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            </header>

            {/* Article Content */}
            <article className="mb-12">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8 md:p-12">
                  <div className="prose prose-slate max-w-none prose-headings:font-semibold prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r prose-ul:text-muted-foreground prose-ol:text-muted-foreground prose-li:text-muted-foreground">
                    {article.fields.articleContent ? (
                      renderRichText(article.fields.articleContent, {
                        includedAssets: [],
                        contentIncludes: article.includes
                      })
                    ) : (
                      <p className="text-muted-foreground italic">
                        No content available for this article.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </article>

            {/* Footer Actions */}
            <div className="border-t pt-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <Button asChild variant="outline">
                  <Link to="/knowledge-base">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Knowledge Base
                  </Link>
                </Button>
                
                <div className="text-sm text-muted-foreground text-center sm:text-right">
                  <p>Was this article helpful?</p>
                  <p className="mt-1">
                    <Link to="/contact" className="text-primary hover:underline">
                      Contact us
                    </Link>
                    {" "}if you need additional assistance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default KnowledgeBaseArticle;