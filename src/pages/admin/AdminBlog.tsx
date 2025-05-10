
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, ChevronRight, Calendar } from 'lucide-react';
import { formatDate } from '@/utils/date';
import DeprecatedAdminLayout from '@/components/admin/layout/DeprecatedAdminLayout';
import { BlogPost } from '@/types/blog';
import { logDeprecationWarning } from '@/services/cms/utils/deprecationLogger';

const AdminBlog = () => {
  const navigate = useNavigate();
  
  // Log deprecation of this admin page
  React.useEffect(() => {
    logDeprecationWarning(
      "AdminBlog",
      "The Blog admin interface is deprecated and will be removed in a future version.",
      "Please use Contentful to manage blog content."
    );
  }, []);
  
  // Fetch all blog posts
  const { data: blogPosts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ['blogPosts'],
    queryFn: fetchBlogPosts
  });

  return (
    <DeprecatedAdminLayout
      title="Blog Management"
      description="View all blog posts (read-only)"
      contentType="Blog Post"
      backPath="/admin/dashboard"
    >
      <div className="flex justify-between mb-6">
        <div></div>
        <Button 
          onClick={() => window.open('https://app.contentful.com/', '_blank')}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Add New Blog Post in Contentful
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="text-center py-10">Loading blog posts...</div>
          ) : blogPosts.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">No blog posts found</p>
              <Button onClick={() => window.open('https://app.contentful.com/', '_blank')}>
                Create Your First Blog Post
              </Button>
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open('https://app.contentful.com/', '_blank')}
                          className="h-8 px-2 w-8"
                          title="Edit blog post in Contentful"
                        >
                          <Edit size={16} />
                        </Button>
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
      </Card>
    </DeprecatedAdminLayout>
  );
};

export default AdminBlog;
