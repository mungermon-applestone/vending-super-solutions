import React from "react";
import { Loader2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useContentfulBlogPageContent } from "@/hooks/useContentfulBlogPageContent";
import {
  useContentfulBlogPosts,
  ContentfulBlogPost
} from "@/hooks/useContentfulBlogPosts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import BlogHeroCard from "@/components/blog/BlogHeroCard";
import Image from "@/components/common/Image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const placeholderImages = [
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
  "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
  "https://images.unsplash.com/photo-1518770660439-4636190af475",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
];

const BlogCard: React.FC<{ post: ContentfulBlogPost; idx: number }> = ({ post, idx }) => {
  const imageUrl =
    post.featuredImage?.url ||
    placeholderImages[idx % placeholderImages.length];

  return (
    <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-shadow group card-hover">
      <div className="relative w-full h-48 rounded-t-lg overflow-hidden">
        <Image
          src={imageUrl}
          alt={post.featuredImage?.title || post.title}
          className="object-cover w-full h-full"
        />
      </div>
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-lg leading-tight mb-1">
          <Link to={`/blog/${post.slug}`} className="hover:underline">{post.title}</Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow px-4 py-1">
        <p className="text-gray-600 text-sm line-clamp-3">
          {post.excerpt ||
            (typeof post.content === "string"
              ? post.content.slice(0, 85) + "..."
              : "No excerpt available")}
        </p>
      </CardContent>
      <CardFooter className="px-4 pb-3 pt-0 flex items-center gap-2 text-xs text-gray-500">
        {post.publishDate && (
          <span>
            <span className="sr-only">Published</span>
            <time dateTime={post.publishDate}>{format(new Date(post.publishDate), "MMM d, yyyy")}</time>
          </span>
        )}
      </CardFooter>
    </Card>
  );
};

const BlogPage: React.FC = () => {
  const { toast } = useToast();
  const { data: pageContent, isLoading: isLoadingContent, error: contentError } = useContentfulBlogPageContent();
  const { data: blogPosts = [], isLoading: isLoadingPosts, error: postsError } = useContentfulBlogPosts({ limit: 9 });

  const isLoading = isLoadingContent || isLoadingPosts;
  const error = contentError || postsError;
  const hasPosts = blogPosts.length > 0;

  // Get the latest post for the hero, and the rest for the grid
  const [latestPost, ...olderPosts] = hasPosts ? blogPosts : [];

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    toast({
      title: "Message Sent",
      description: "We've received your message and will get back to you soon.",
    });
    
    e.currentTarget.reset();
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-5">{pageContent?.introTitle || "Our Blog"}</h1>
          <p className="text-lg text-gray-600">{pageContent?.introDescription || "Insights, news, and updates from our team."}</p>
        </div>
        {/* Featured/Hero Blog Post Section */}
        {!isLoading && latestPost && (
          <div className="mb-12">
            <BlogHeroCard post={latestPost} />
          </div>
        )}

        {/* Blog Posts Section */}
        <div>
          <h2 className="text-2xl font-bold mb-8">{pageContent?.latestArticlesTitle || "Latest Articles"}</h2>
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 p-4 rounded-md">
              <h3 className="text-lg font-medium text-red-800 mb-2">Error loading blog posts</h3>
              <p className="text-red-600">{error instanceof Error ? error.message : "Unknown error"}</p>
            </div>
          ) : olderPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500">No blog posts found. Check back soon for new content!</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {olderPosts.map((post, idx) => (
                <BlogCard key={post.id} post={post} idx={idx} />
              ))}
            </div>
          )}
        </div>

        {/* Contact Section */}
        <div className="mt-20 bg-gray-50 rounded-lg py-16 px-6">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              Get In Touch
            </h2>
            <p className="text-center text-gray-600 mb-10">
              Have questions about our blog content or want to discuss an article? 
              Reach out to us directly.
            </p>
            
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <Input 
                    id="name" 
                    placeholder="John Doe" 
                    required 
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="john@example.com" 
                    required 
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <Input 
                  id="subject" 
                  placeholder="Blog Inquiry" 
                  required 
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <Textarea 
                  id="message" 
                  rows={5} 
                  placeholder="Tell us about your thoughts on our latest articles or any questions you have." 
                  required 
                />
              </div>
              
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BlogPage;
