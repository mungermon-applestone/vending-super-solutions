
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { fetchCaseStudies } from '@/services/cms/contentTypes/caseStudies';
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
import { Plus, Edit, ChevronRight } from 'lucide-react';
import DeprecatedAdminLayout from '@/components/admin/layout/DeprecatedAdminLayout';
import { logDeprecationWarning } from '@/services/cms/utils/deprecationLogger';

const AdminCaseStudies = () => {
  const navigate = useNavigate();
  
  // Log deprecation of this admin page
  React.useEffect(() => {
    logDeprecationWarning(
      "AdminCaseStudies",
      "The Case Studies admin interface is deprecated and will be removed in a future version.",
      "Please use Contentful to manage case study content."
    );
  }, []);
  
  // Fetch case studies - updated to use TanStack Query v5 API pattern
  const { data, isLoading } = useQuery({
    queryKey: ['caseStudies'],
    queryFn: async () => {
      return await fetchCaseStudies();
    }
  });
  
  // Make sure data is always an array
  const caseStudies = Array.isArray(data) ? data : [];

  return (
    <DeprecatedAdminLayout
      title="Case Studies Management"
      description="View all case studies (read-only)"
      contentType="Case Study"
      backPath="/admin/dashboard"
    >
      <div className="flex justify-between mb-6">
        <div></div>
        <Button 
          onClick={() => window.open('https://app.contentful.com/', '_blank')}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Add New Case Study in Contentful
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="text-center py-10">Loading case studies...</div>
          ) : caseStudies.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">No case studies found</p>
              <Button onClick={() => window.open('https://app.contentful.com/', '_blank')}>
                Create Your First Case Study
              </Button>
            </div>
          ) : (
            <Table>
              <TableCaption>A list of all case studies (read-only view).</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {caseStudies.map((study) => (
                  <TableRow key={study.id}>
                    <TableCell className="font-medium">{study.title}</TableCell>
                    <TableCell>{study.industry || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={study.published ? "default" : "outline"}>
                        {study.published ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open('https://app.contentful.com/', '_blank')}
                          className="h-8 px-2 w-8"
                          title="Edit case study in Contentful"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/case-studies/${study.slug}`)}
                          className="h-8 px-2 w-8"
                          title="View case study"
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

export default AdminCaseStudies;
