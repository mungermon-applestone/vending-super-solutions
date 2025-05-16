
import React from 'react';
import { useTechnologySections } from '@/hooks/useTechnologySections';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Edit, Eye, EyeOff, Copy } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { deleteTechnology, cloneTechnology } from '@/services/cms/technologies';
import { useConfirm } from '@/hooks/useConfirm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format } from 'date-fns';
import { CMSTechnology } from '@/types/cms';

const TechnologyList = () => {
  const { technologies = [], isLoading, error, refetch } = useTechnologySections();
  const { toast, dismiss, toasts } = useToast();
  const { confirm, ConfirmDialog } = useConfirm();

  const handleDelete = async (technology: CMSTechnology) => {
    const confirmed = await confirm({
      title: `Delete ${technology.title}?`,
      description: "This action cannot be undone. This will permanently delete this technology and all associated data.",
    });

    if (confirmed) {
      try {
        await deleteTechnology(technology.slug);
        toast({
          title: "Technology deleted",
          description: `${technology.title} has been deleted successfully.`,
        });
        refetch();
      } catch (error) {
        console.error("Error deleting technology:", error);
        toast({
          title: "Error",
          description: "Failed to delete technology. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleClone = async (technology: CMSTechnology) => {
    try {
      await cloneTechnology(technology.id);
      refetch();
    } catch (error) {
      console.error("Error cloning technology:", error);
      toast({
        title: "Error",
        description: "Failed to clone technology. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Technologies</h2>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="border rounded-md">
          <div className="p-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-72" />
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-9 w-9 rounded-md" />
                  <Skeleton className="h-9 w-9 rounded-md" />
                  <Skeleton className="h-9 w-9 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <h2 className="text-lg font-semibold text-red-800">Error Loading Technologies</h2>
        <p className="text-red-600 mt-1">
          {error instanceof Error ? error.message : "An unknown error occurred"}
        </p>
        <Button onClick={() => refetch()} variant="outline" size="sm" className="mt-2">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Technologies ({technologies.length})</h2>
        <Button asChild>
          <Link to="/admin/technology/new">
            <Plus className="mr-2 h-4 w-4" /> Add Technology
          </Link>
        </Button>
      </div>

      {technologies.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Technologies Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You haven't created any technologies yet. Click the "Add Technology" button to create your first one.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sections</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {technologies.map((technology) => (
                <TableRow key={technology.id}>
                  <TableCell className="font-medium">{technology.title}</TableCell>
                  <TableCell>{technology.slug}</TableCell>
                  <TableCell>
                    {technology.visible ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <Eye className="h-3 w-3 mr-1" /> Visible
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        <EyeOff className="h-3 w-3 mr-1" /> Hidden
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {technology.sections?.length || 0} sections
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        asChild
                        title="View"
                      >
                        <Link to={`/technology/${technology.slug}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        asChild
                        title="Edit"
                      >
                        <Link to={`/admin/technology/edit/${technology.slug}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleClone(technology)}
                        title="Clone"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(technology)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      <ConfirmDialog />
    </div>
  );
};

export default TechnologyList;
