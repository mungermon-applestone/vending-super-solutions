
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
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
import { ChevronRight } from 'lucide-react';
import DeprecatedAdminLayout from '@/components/admin/layout/DeprecatedAdminLayout';
import ViewInContentful from '@/components/admin/ViewInContentful';
import { logDeprecationWarning } from '@/services/cms/utils/deprecationLogger';

const AdminCaseStudies = () => {
  const navigate = useNavigate();
  
  // Log deprecation of this admin page
  useEffect(() => {
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
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          Read-Only View
        </Badge>
        <ViewInContentful 
          contentType="caseStudy"
          className="bg-blue-50 text-blue-700 border-blue-200"
        />
      </div>

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="text-center py-10">Loading case studies...</div>
          ) : caseStudies.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">No case studies found</p>
              <ViewInContentful 
                contentType="caseStudy"
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              />
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
                      <Badge variant={study.visible ? "default" : "outline"}>
                        {study.visible ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ViewInContentful 
                          contentType="caseStudy"
                          contentId={study.id}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        />
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
        <CardFooter className="border-t bg-gray-50 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            This interface is read-only. All content management should be done in Contentful.
          </p>
          <ViewInContentful 
            contentType="caseStudy"
            size="sm"
          />
        </CardFooter>
      </Card>
    </DeprecatedAdminLayout>
  );
};

export default AdminCaseStudies;
