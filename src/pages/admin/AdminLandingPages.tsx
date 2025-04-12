
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import AdminControls from '@/components/admin/AdminControls';
import AdminNavBar from '@/components/admin/AdminNavBar';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Eye, ArrowRight } from 'lucide-react';
import { useLandingPages } from '@/hooks/cms/useLandingPages';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useDeleteLandingPage } from '@/hooks/cms/useLandingPages';
import { Badge } from '@/components/ui/badge';
import LandingPageTableRow from '@/components/admin/landing-pages/LandingPageTableRow';
import { LandingPage } from '@/types/landingPage';

const AdminLandingPages = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: landingPages, isLoading, error } = useLandingPages();
  const deleteMutation = useDeleteLandingPage();

  // Type assertion to ensure landingPages is treated as an array of LandingPage
  const typedLandingPages = landingPages as LandingPage[] | undefined;

  const handleDeletePage = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast({
        title: 'Success',
        description: 'Landing page deleted successfully',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete landing page',
        variant: 'destructive',
      });
    }
  };

  const handlePreviewPage = (pageKey: string) => {
    let path = '/';
    
    // Map page key to actual route
    switch (pageKey) {
      case 'home':
        path = '/';
        break;
      case 'products':
        path = '/products';
        break;
      case 'business-goals':
        path = '/business-goals';
        break;
      case 'machines':
        path = '/machines';
        break;
      default:
        path = `/${pageKey}`;
    }
    
    window.open(path, '_blank');
  };

  return (
    <Layout>
      <AdminNavBar activeItem="landing-pages" />
      
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Landing Pages</h1>
            <p className="text-gray-500">Manage hero content for landing pages</p>
          </div>
          <Button onClick={() => navigate('/admin/landing-pages/new')} className="flex items-center">
            <Plus size={16} className="mr-2" /> Add Landing Page
          </Button>
        </div>
        
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border border-gray-200 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-60" />
                  </div>
                  <div className="flex space-x-2">
                    <Skeleton className="h-9 w-9 rounded" />
                    <Skeleton className="h-9 w-9 rounded" />
                    <Skeleton className="h-9 w-9 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg">
            <p className="font-semibold">Error loading landing pages</p>
            <p>{error instanceof Error ? error.message : 'An unknown error occurred'}</p>
          </div>
        )}
        
        {!isLoading && !error && typedLandingPages && typedLandingPages.length === 0 && (
          <div className="text-center py-12 border border-dashed rounded-lg">
            <h3 className="font-medium text-lg mb-2">No Landing Pages Found</h3>
            <p className="text-gray-500 mb-6">Start by adding your first landing page</p>
            <Button onClick={() => navigate('/admin/landing-pages/new')}>
              Add Landing Page
            </Button>
          </div>
        )}
        
        {!isLoading && typedLandingPages && typedLandingPages.length > 0 && (
          <div className="bg-white rounded-md shadow overflow-hidden">
            <div className="grid grid-cols-12 bg-gray-100 p-4 font-medium text-gray-600">
              <div className="col-span-3">Page Name</div>
              <div className="col-span-3">Key</div>
              <div className="col-span-3">Hero Title</div>
              <div className="col-span-3 text-right">Actions</div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {typedLandingPages.map((page) => (
                <LandingPageTableRow 
                  key={page.id} 
                  page={page} 
                  onEdit={() => navigate(`/admin/landing-pages/edit/${page.id}`)}
                  onDelete={() => handleDeletePage(page.id)}
                  onPreview={() => handlePreviewPage(page.page_key)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
      <AdminControls />
    </Layout>
  );
};

export default AdminLandingPages;
