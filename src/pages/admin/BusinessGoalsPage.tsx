
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, ExternalLink, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { fetchBusinessGoals } from '@/services/cms/contentTypes/businessGoals';
import DeprecatedAdminLayout from '@/components/admin/layout/DeprecatedAdminLayout';
import { logDeprecationWarning } from '@/services/cms/utils/deprecationLogger';
import ContentfulButton from '@/components/admin/ContentfulButton';
import { Alert, AlertDescription } from '@/components/ui/alert';

const BusinessGoalsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    logDeprecationWarning(
      "BusinessGoalsPage",
      "The Business Goals admin page is deprecated and will be removed in a future version.",
      "Please use Contentful to manage business goal content."
    );
    
    toast({
      title: "Read-Only View",
      description: "This is a read-only view. To manage business goals, please use Contentful.",
      variant: "default",
    });
  }, [toast]);
  
  // Fetch all business goals to display in the table
  const { data: businessGoals = [], error, isLoading } = useQuery({
    queryKey: ['businessGoals'],
    queryFn: fetchBusinessGoals,
  });

  const handleOpenContentful = () => {
    window.open(`https://app.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/${process.env.CONTENTFUL_ENVIRONMENT_ID || 'master'}/entries?contentTypeId=businessGoal`, "_blank");
  };

  return (
    <DeprecatedAdminLayout
      title="Business Goal Management"
      description="View all business goals (read-only view)"
      contentType="Business Goal"
      backPath="/admin/dashboard"
    >
      <div className="flex justify-between items-center mb-6">
        <Alert variant="warning" className="flex-1 mr-4">
          <AlertDescription>
            Business goal management has been moved to Contentful CMS. This is a read-only view.
          </AlertDescription>
        </Alert>
        
        <ContentfulButton
          contentType="businessGoal"
          variant="default" 
          customText="Manage in Contentful"
          className="whitespace-nowrap"
        />
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Business Goals</CardTitle>
          <CardDescription>A read-only view of business goals from Contentful</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-10">Loading business goals...</div>
          ) : businessGoals.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">No business goals found</p>
              <Button onClick={handleOpenContentful}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Create in Contentful
              </Button>
            </div>
          ) : (
            <Table>
              <TableCaption>A list of all business goals (read-only view).</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businessGoals.map((goal) => (
                  <TableRow key={goal.id}>
                    <TableCell className="font-medium">{goal.title}</TableCell>
                    <TableCell>{goal.slug}</TableCell>
                    <TableCell>{goal.visible ? 'Visible' : 'Hidden'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/business-goals/${goal.slug}`)}
                          className="h-8 px-2"
                          title="View business goal page"
                        >
                          <Eye size={16} />
                        </Button>
                        <ContentfulButton
                          size="sm"
                          variant="outline"
                          entryId={goal.id}
                          contentType="businessGoal"
                          className="h-8"
                        />
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

export default BusinessGoalsPage;
