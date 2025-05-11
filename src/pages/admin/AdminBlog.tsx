
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { fetchBlogPosts } from '@/services/cms/contentTypes/blog';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar, ChevronRight } from 'lucide-react';
import { formatDate } from '@/utils/date';
import DeprecatedAdminLayout from '@/components/admin/layout/DeprecatedAdminLayout';
import ViewInContentful from '@/components/admin/ViewInContentful';
import { BlogPost } from '@/types/blog';
import { logDeprecationWarning } from '@/services/cms/utils/deprecationLogger';

const AdminBlog = () => {
  const navigate = useNavigate();
  
  // Log deprecation of this admin page
  useEffect(() => {
    logDeprecationWarning(
      "AdminBlog",
      "The Blog admin interface is deprecated and will be removed in a future version.",
      "Please use Contentful to manage blog content."
    );
  }, []);
  
  // Fetch all blog posts - using TanStack Query v5 API pattern
  const { data, isLoading } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: async () => {
      return await fetchBlogPosts();
    }
  });
  
  // Make sure data is always an array
  const blogPosts: BlogPost[] = Array.isArray(data) ? data : [];

  return (
    <DeprecatedAdminLayout
      title="Blog Management"
      description="View all blog posts (read-only)"
      contentType="Blog Post"
      backPath="/admin/dashboard"
    >
      <div className="flex justify-between mb-6">
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          Read-Only View
        </Badge>
        <ViewInContentful 
          contentType="blogPost"
          className="bg-blue-50 text-blue-700 border-blue-200"
        />
      </div>

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="text-center py-10">Loading blog posts...</div>
          ) : blogPosts.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">No blog posts found</p>
              <ViewInContentful 
                contentType="blogPost"
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              />
            </div>
          ) : (
            <Table>
              <TableCaption>A list of all blog posts (read-only view).</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>{formatDate(post.published_at || post.created_at)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={post.status === 'published' ? "default" : "outline"}>
                        {post.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ViewInContentful 
                          contentType="blogPost"
                          contentId={post.id}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/blog/${post.slug}`)}
                          className="h-8 px-2 w-8"
                          title="View blog post"
                        >
                          <ChevronRight size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="border-t bg-gray-50 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            This interface is read-only. All content management should be done in Contentful.
          </p>
          <ViewInContentful 
            contentType="blogPost"
            size="sm"
          />
        </CardFooter>
      </Card>
    </DeprecatedAdminLayout>
  );
};

export default AdminBlog;
