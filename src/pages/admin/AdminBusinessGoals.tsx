
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { fetchBusinessGoals } from '@/services/cms/contentTypes/businessGoals';
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

const AdminBusinessGoals = () => {
  const navigate = useNavigate();
  
  // Log deprecation of this admin page
  React.useEffect(() => {
    logDeprecationWarning(
      "AdminBusinessGoals",
      "The Business Goals admin interface is deprecated and will be removed in a future version.",
      "Please use Contentful to manage business goal content."
    );
  }, []);
  
  // Fetch business goals - updated to use TanStack Query v5 API pattern
  const { data, isLoading } = useQuery({
    queryKey: ['businessGoals'],
    queryFn: async () => {
      return await fetchBusinessGoals();
    }
  });
  
  // Make sure data is always an array
  const businessGoals = Array.isArray(data) ? data : [];

  return (
    <DeprecatedAdminLayout
      title="Business Goals Management"
      description="View all business goals (read-only)"
      contentType="Business Goal"
      backPath="/admin/dashboard"
    >
      <div className="flex justify-between mb-6">
        <div></div>
        <Button 
          onClick={() => window.open('https://app.contentful.com/', '_blank')}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Add New Business Goal in Contentful
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="text-center py-10">Loading business goals...</div>
          ) : businessGoals.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">No business goals found</p>
              <Button onClick={() => window.open('https://app.contentful.com/', '_blank')}>
                Create Your First Business Goal
              </Button>
            </div>
          ) : (
            <Table>
              <TableCaption>A list of all business goals (read-only view).</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businessGoals.map((goal) => (
                  <TableRow key={goal.id}>
                    <TableCell className="font-medium">{goal.title}</TableCell>
                    <TableCell>{goal.category || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={goal.visible ? "default" : "outline"}>
                        {goal.visible ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open('https://app.contentful.com/', '_blank')}
                          className="h-8 px-2 w-8"
                          title="Edit business goal in Contentful"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/business-goals/${goal.slug}`)}
                          className="h-8 px-2 w-8"
                          title="View business goal"
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

export default AdminBusinessGoals;
