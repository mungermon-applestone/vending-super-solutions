/**
 * Help Desk Article Preview Page
 * Displays draft Help Desk Article content from Contentful Preview API
 */

import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PreviewWrapper } from '@/components/preview/PreviewWrapper';
import { contentfulHelpDeskArticlePreviewAdapter } from '@/services/cms/adapters/helpDeskArticles/contentfulHelpDeskArticlePreviewAdapter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import { AlertCircle, FileText, Clock, Tag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const richTextOptions = {
  renderNode: {
    [BLOCKS.HEADING_1]: (node: any, children: any) => (
      <h1 className="text-4xl font-bold mb-6 text-foreground">{children}</h1>
    ),
    [BLOCKS.HEADING_2]: (node: any, children: any) => (
      <h2 className="text-3xl font-semibold mb-4 text-foreground">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (node: any, children: any) => (
      <h3 className="text-2xl font-semibold mb-3 text-foreground">{children}</h3>
    ),
    [BLOCKS.PARAGRAPH]: (node: any, children: any) => (
      <p className="text-muted-foreground mb-4 leading-relaxed">{children}</p>
    ),
    [BLOCKS.UL_LIST]: (node: any, children: any) => (
      <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (node: any, children: any) => (
      <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (node: any, children: any) => (
      <li className="text-muted-foreground">{children}</li>
    ),
  },
};

export function HelpDeskArticlePreview() {
  const { slug } = useParams<{ slug: string }>();

  const { data: article, isLoading, error } = useQuery({
    queryKey: ['helpDeskArticle', 'preview', slug],
    queryFn: () => contentfulHelpDeskArticlePreviewAdapter.getBySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <PreviewWrapper>
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-muted-foreground">Loading article preview...</p>
            </CardContent>
          </Card>
        </div>
      </PreviewWrapper>
    );
  }

  if (error || !article) {
    return (
      <PreviewWrapper>
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Preview Error</h1>
              <p className="text-muted-foreground">
                {error ? 'Failed to load article preview' : 'Article not found'}
              </p>
            </CardContent>
          </Card>
        </div>
      </PreviewWrapper>
    );
  }

  return (
    <PreviewWrapper>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Article Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start gap-4">
              <FileText className="h-8 w-8 text-primary mt-1" />
              <div className="flex-1">
                <CardTitle className="text-3xl font-bold mb-4">
                  {article.fields.articleTitle}
                </CardTitle>
                
                {/* Article Metadata */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      Updated {formatDistanceToNow(new Date(article.sys.updatedAt))} ago
                    </span>
                  </div>
                  
                  {article.fields.category && (
                    <Badge variant="secondary">
                      {article.fields.category}
                    </Badge>
                  )}
                  
                  {article.fields.status && (
                    <Badge variant={article.fields.status === 'published' ? 'default' : 'outline'}>
                      {article.fields.status}
                    </Badge>
                  )}
                </div>

                {/* Tags */}
                {article.fields.tags && article.fields.tags.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      {article.fields.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Article Content */}
        <Card>
          <CardContent className="p-8">
            {article.fields.content ? (
              <div className="prose prose-lg max-w-none">
                {documentToReactComponents(article.fields.content, richTextOptions)}
              </div>
            ) : (
              <p className="text-muted-foreground italic">No content available</p>
            )}
          </CardContent>
        </Card>

        {/* Debug Information */}
        <Card className="mt-8 border-dashed">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Debug Information
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-2">
            <div><strong>Content ID:</strong> {article.sys.id}</div>
            <div><strong>Content Type:</strong> {article.sys.contentType.sys.id}</div>
            <div><strong>Created:</strong> {new Date(article.sys.createdAt).toLocaleString()}</div>
            <div><strong>Updated:</strong> {new Date(article.sys.updatedAt).toLocaleString()}</div>
            <div><strong>Published:</strong> {article.sys.publishedAt ? new Date(article.sys.publishedAt).toLocaleString() : 'Draft'}</div>
            <div><strong>Slug:</strong> {article.fields.slug}</div>
          </CardContent>
        </Card>
      </div>
    </PreviewWrapper>
  );
}