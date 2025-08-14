import React, { useEffect, useRef } from "react";
import { useHelpDeskArticlesByCategory } from "@/hooks/useHelpDeskArticles";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft, Menu, Edit2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import SEO from "@/components/seo/SEO";
import { renderRichText } from "@/utils/contentful/richTextRenderer";
import { createContentfulEditHandler } from "@/utils/contentful/urlHelpers";
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import CustomerLayout from '@/components/layout/CustomerLayout';

const KnowledgeBaseSinglePage: React.FC = () => {
  const { data: articlesByCategory, isLoading, error } = useHelpDeskArticlesByCategory({ enableToasts: true });
  const [activeSection, setActiveSection] = React.useState<string>("");
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const sectionRefs = useRef<Record<string, HTMLElement>>({});
  const { isCustomerAuthenticated } = useCustomerAuth();

  // Generate anchor ID from text
  const generateAnchorId = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  // Scroll to section when anchor is clicked
  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };

  // Set up intersection observer for active section tracking
  useEffect(() => {
    if (!articlesByCategory) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [articlesByCategory]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-16">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-muted-foreground">Loading complete knowledge base...</span>
        </div>
      </div>
    );
  }

  if (error || !articlesByCategory) {
    return (
      <div className="container mx-auto py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4 text-destructive">Unable to Load Knowledge Base</h1>
          <p className="text-muted-foreground mb-6">
            We're having trouble loading the help articles. Please try again later.
          </p>
          <Button asChild variant="outline">
            <Link to="/knowledge-base">Return to Knowledge Base</Link>
          </Button>
        </div>
      </div>
    );
  }

  const sortedCategories = Object.entries(articlesByCategory).sort(([a], [b]) => a.localeCompare(b));

  const content = (
    <>
      <SEO
        title="Knowledge Base - Complete Guide"
        description="Complete knowledge base with all help articles on a single page. Browse all topics and articles in one convenient location."
        type="website"
      />
      
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden"
                >
                  <Menu className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-primary" />
                  <h1 className="text-xl font-bold">Complete Knowledge Base</h1>
                </div>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/knowledge-base">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Overview
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-73px)]">
          {/* Sidebar */}
          <ResizablePanel 
            defaultSize={25} 
            minSize={20} 
            maxSize={40}
            className={`${sidebarOpen ? 'block' : 'hidden'} lg:block`}
          >
            <div className="h-full border-r bg-muted/30">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <h2 className="font-semibold mb-4 text-sm uppercase tracking-wide text-muted-foreground">
                    Navigation
                  </h2>
                  <nav className="space-y-2">
                    {sortedCategories.map(([category, articles]) => {
                      const categoryId = generateAnchorId(category);
                      return (
                        <div key={category}>
                          <button
                            onClick={() => scrollToSection(categoryId)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted ${
                              activeSection === categoryId ? 'bg-primary/10 text-primary' : 'text-foreground'
                            }`}
                          >
                            {category}
                          </button>
                          <div className="ml-4 space-y-1">
                            {articles.map((article) => {
                              const articleId = generateAnchorId(`${category}-${article.fields.articleTitle}`);
                              return (
                                <button
                                  key={article.sys.id}
                                  onClick={() => scrollToSection(articleId)}
                                  className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors hover:bg-muted ${
                                    activeSection === articleId ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                                  }`}
                                >
                                  {article.fields.articleTitle}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </nav>
                </div>
              </ScrollArea>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Content */}
          <ResizablePanel defaultSize={75}>
            <ScrollArea className="h-full">
              <div className="p-8 max-w-4xl mx-auto">
                <div className="mb-8">
                  <p className="text-muted-foreground">
                    All {Object.values(articlesByCategory).reduce((total, articles) => total + articles.length, 0)} articles 
                    across {Object.keys(articlesByCategory).length} categories in one place.
                  </p>
                </div>

                <div className="space-y-16">
                  {sortedCategories.map(([category, articles]) => {
                    const categoryId = generateAnchorId(category);
                    return (
                      <section
                        key={category}
                        id={categoryId}
                        ref={(el) => {
                          if (el) sectionRefs.current[categoryId] = el;
                        }}
                        className="scroll-mt-24"
                      >
                        <div className="mb-8">
                          <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                            <div className="w-1 h-8 bg-primary rounded-full"></div>
                            {category}
                          </h2>
                          <Badge variant="secondary">
                            {articles.length} article{articles.length !== 1 ? 's' : ''}
                          </Badge>
                        </div>

                        <div className="space-y-12">
                          {articles.map((article) => {
                            const articleId = generateAnchorId(`${category}-${article.fields.articleTitle}`);
                            return (
                              <article
                                key={article.sys.id}
                                id={articleId}
                                ref={(el) => {
                                  if (el) sectionRefs.current[articleId] = el;
                                }}
                                className="scroll-mt-24 border rounded-lg p-6 bg-card"
                              >
                                <header className="mb-6">
                                  <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-2xl font-semibold flex-1">
                                      {article.fields.articleTitle}
                                    </h3>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={createContentfulEditHandler(article.sys.id)}
                                      className="text-xs h-7 ml-4"
                                    >
                                      <Edit2 className="h-3 w-3 mr-1" />
                                      Edit
                                    </Button>
                                  </div>
                                  {article.fields.headingCategory && (
                                    <Badge variant="outline" className="text-xs">
                                      {article.fields.headingCategory}
                                    </Badge>
                                  )}
                                </header>
                                
                                <div className="prose prose-neutral dark:prose-invert max-w-none">
                                  {article.fields.articleContent && 
                                    renderRichText(article.fields.articleContent, {
                                      includedAssets: [],
                                      contentIncludes: {}
                                    })
                                  }
                                </div>
                              </article>
                            );
                          })}
                        </div>
                      </section>
                    );
                  })}
                </div>
              </div>
            </ScrollArea>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  );

  // Always wrap with customer layout since this is a protected route
  return <CustomerLayout>{content}</CustomerLayout>;
};

export default KnowledgeBaseSinglePage;