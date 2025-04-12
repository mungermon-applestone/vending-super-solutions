
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import AdminNavBar from '@/components/admin/AdminNavBar';
import AdminControls from '@/components/admin/AdminControls';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import LandingPageForm from '@/components/admin/landing-pages/LandingPageForm';
import { useLandingPages, useCreateLandingPage, useUpdateLandingPage } from '@/hooks/cms/useLandingPages';
import { LandingPageFormData, LandingPage } from '@/types/landingPage';

const LandingPageEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;
  
  const { data: landingPages = [], isLoading } = useLandingPages();
  const createMutation = useCreateLandingPage();
  const updateMutation = useUpdateLandingPage();
  
  // Debug the landing pages data
  useEffect(() => {
    console.log("LandingPageEditor - Landing pages data:", landingPages);
    console.log("LandingPageEditor - isEditing:", isEditing);
    console.log("LandingPageEditor - id:", id);
  }, [landingPages, isEditing, id]);
  
  // Find the current page being edited
  const currentPage = isEditing && Array.isArray(landingPages) ? 
    landingPages.find(page => page.id === id) : 
    undefined;
  
  useEffect(() => {
    console.log("LandingPageEditor - Current page:", currentPage);
    
    if (isEditing && !isLoading && Array.isArray(landingPages) && landingPages.length > 0 && !currentPage) {
      toast({
        title: "Error",
        description: "Landing page not found",
        variant: "destructive",
      });
      navigate('/admin/landing-pages');
    }
  }, [isEditing, landingPages, currentPage, navigate, toast, isLoading]);
  
  const handleSubmit = async (data: LandingPageFormData) => {
    console.log("LandingPageEditor - handleSubmit called with data:", data);
    try {
      if (isEditing && id) {
        console.log(`Updating landing page ${id}`);
        await updateMutation.mutateAsync({ id, data });
        toast({
          title: "Success",
          description: "Landing page updated successfully",
        });
      } else {
        console.log("Creating new landing page");
        const result = await createMutation.mutateAsync(data);
        console.log("Create mutation result:", result);
        toast({
          title: "Success",
          description: "Landing page created successfully",
        });
      }
      navigate('/admin/landing-pages');
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };
  
  const initialData: LandingPageFormData | undefined = currentPage
    ? {
        page_key: currentPage.page_key,
        page_name: currentPage.page_name,
        hero: {
          title: currentPage.hero_content.title,
          subtitle: currentPage.hero_content.subtitle,
          image_url: currentPage.hero_content.image_url,
          image_alt: currentPage.hero_content.image_alt,
          cta_primary_text: currentPage.hero_content.cta_primary_text || '',
          cta_primary_url: currentPage.hero_content.cta_primary_url || '',
          cta_secondary_text: currentPage.hero_content.cta_secondary_text || '',
          cta_secondary_url: currentPage.hero_content.cta_secondary_url || '',
          background_class: currentPage.hero_content.background_class || 'bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light',
        }
      }
    : undefined;
  
  return (
    <Layout>
      <AdminNavBar activeItem="landing-pages" />
      
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => navigate('/admin/landing-pages')}
          >
            <ChevronLeft size={16} className="mr-1" /> Back to Landing Pages
          </Button>
          
          <h1 className="text-2xl font-bold">
            {isEditing ? 'Edit Landing Page' : 'Create Landing Page'}
          </h1>
        </div>
        
        {isLoading && isEditing ? (
          <div className="flex justify-center py-10">
            <p className="text-gray-500">Loading landing page data...</p>
          </div>
        ) : (
          <LandingPageForm 
            initialData={initialData} 
            onSubmit={handleSubmit} 
            isSubmitting={createMutation.isPending || updateMutation.isPending}
          />
        )}
      </div>
      
      <AdminControls />
    </Layout>
  );
};

export default LandingPageEditor;
