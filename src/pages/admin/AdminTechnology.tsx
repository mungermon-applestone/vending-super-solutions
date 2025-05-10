
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
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
import { getTechnologies, deleteTechnology } from '@/services/cms';
import { useCloneTechnology } from '@/hooks/cms/useCloneCMS';
import TechnologyTableRow from '@/components/admin/technology/TechnologyTableRow';
import DeleteTechnologyDialog from '@/components/admin/technology/DeleteTechnologyDialog';
import { CMSTechnology } from '@/types/cms';
import DeprecatedInterfaceWarning from '@/components/admin/DeprecatedInterfaceWarning';

const AdminTechnology = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [technologyToDelete, setTechnologyToDelete] = useState<{ id: string; title: string; slug: string } | null>(null);
  
  // For cloning functionality
  const cloneTechnologyMutation = useCloneTechnology();
  const [cloningTechnologyId, setCloningTechnologyId] = useState<string | null>(null);
  
  const { data: technologies = [], isLoading: isLoadingTechnologies } = useQuery({
    queryKey: ['technologies'],
    queryFn: async () => {
      try {
        console.log('[AdminTechnology] Fetching technologies...');
        const techs = await getTechnologies();
        console.log('[AdminTechnology] Technologies loaded:', techs);
        return techs;
      } catch (error) {
        console.error('[AdminTechnology] Error fetching technologies:', error);
        toast({
          title: 'Error',
          description: 'Failed to load technologies. Please try again.',
          variant: 'destructive',
        });
        return [];
      }
    },
  });

  const handleDeleteClick = (technology: CMSTechnology) => {
    setTechnologyToDelete({
      id: technology.id,
      title: technology.title,
      slug: technology.slug
    });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!technologyToDelete) return;
    
    try {
      setIsDeleting(true);
      console.log(`[AdminTechnology] Deleting technology with slug: ${technologyToDelete.slug}`);
      
      await deleteTechnology(technologyToDelete.slug);
      
      toast({
        title: "Technology deleted",
        description: `${technologyToDelete.title} has been deleted successfully.`
      });
      
      queryClient.invalidateQueries({ queryKey: ['technologies'] });
      
      setDeleteDialogOpen(false);
      setTechnologyToDelete(null);
    } catch (error) {
      console.error("[AdminTechnology] Error deleting technology:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete technology. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloneTechnology = async (technology: CMSTechnology): Promise<void> => {
    try {
      setCloningTechnologyId(technology.id);
      const clonedTechnology = await cloneTechnologyMutation.mutateAsync(technology.id);
      
      if (clonedTechnology) {
        toast({
          title: "Technology cloned",
          description: `${technology.title} has been cloned successfully.`
        });
      }
    } catch (error) {
      console.error("[AdminTechnology] Error cloning technology:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to clone technology. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCloningTechnologyId(null);
    }
  };

  return (
    <Layout>
      <div className="container py-10">
        <DeprecatedInterfaceWarning 
          title="Deprecated Technology Administration" 
          message="This technology administration interface is being phased out. Please use Contentful directly to manage technology content."
          showContentfulLink={true}
        />

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Technology Management</h1>
            <p className="text-muted-foreground mt-1">
              Create, edit, and manage technology pages
            </p>
          </div>
          <Button 
            onClick={() => navigate('/admin/technology/new')}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Add New Technology
          </Button>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Technology Pages</CardTitle>
            <CardDescription>
              All technology pages in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingTechnologies ? (
              <div className="text-center py-10">Loading technologies...</div>
            ) : technologies.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">No technology pages found</p>
                <Button onClick={() => navigate('/admin/technology/new')}>
                  Create Your First Technology Page
                </Button>
              </div>
            ) : (
              <Table>
                <TableCaption>A list of all technology pages.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {technologies.map((technology) => (
                    <TechnologyTableRow 
                      key={technology.id} 
                      technology={technology}
                      onDeleteClick={handleDeleteClick}
                      onCloneClick={handleCloneTechnology}
                      isCloningId={cloningTechnologyId}
                    />
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
      
      <DeleteTechnologyDialog
        isOpen={deleteDialogOpen}
        setIsOpen={setDeleteDialogOpen}
        technologyToDelete={technologyToDelete}
        onConfirmDelete={confirmDelete}
        isDeleting={isDeleting}
      />
    </Layout>
  );
};

export default AdminTechnology;
