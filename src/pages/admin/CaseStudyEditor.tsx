import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useCaseStudy, useCreateCaseStudy, useUpdateCaseStudy } from '@/hooks/useCaseStudies';
import CaseStudyForm from '@/components/admin/case-studies/CaseStudyForm';
import { CaseStudyFormData } from '@/types/caseStudy';

const CaseStudyEditor = () => {
  const { caseStudySlug } = useParams<{ caseStudySlug: string }>();
  const isEditing = Boolean(caseStudySlug);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, isLoading: authLoading } = useAuth();
  
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const { data: caseStudy, isLoading: isLoadingCaseStudy } = useCaseStudy(
    isEditing ? caseStudySlug : undefined
  );
  
  const createCaseStudy = useCreateCaseStudy();
  const updateCaseStudy = useUpdateCaseStudy();
  
  useEffect(() => {
    if (!authLoading && !isAdmin && !isRedirecting) {
      setIsRedirecting(true);
      navigate('/admin/sign-in');
    }
  }, [isAdmin, authLoading, navigate, isRedirecting]);

  if (authLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-10">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  if (isEditing && isLoadingCaseStudy) {
    return (
      <Layout>
        <div className="container mx-auto py-10">
          <p>Loading case study data...</p>
        </div>
      </Layout>
    );
  }

  const initialData: CaseStudyFormData | undefined = isEditing && caseStudy
    ? {
        title: caseStudy.title,
        slug: caseStudy.slug,
        summary: caseStudy.summary,
        content: caseStudy.content,
        solution: caseStudy.solution || '',
        industry: caseStudy.industry || '',
        image_url: caseStudy.image_url || '',
        image_alt: caseStudy.image_alt || '',
        visible: caseStudy.visible,
        results: caseStudy.results.map(result => ({ text: result.text })),
        testimonial: caseStudy.testimonial
          ? {
              quote: caseStudy.testimonial.quote,
              author: caseStudy.testimonial.author,
              company: caseStudy.testimonial.company || '',
              position: caseStudy.testimonial.position || '',
            }
          : {
              quote: '',
              author: '',
              company: '',
              position: '',
            },
      }
    : undefined;

  const handleSubmit = async (data: CaseStudyFormData) => {
    try {
      if (isEditing && caseStudy) {
        await updateCaseStudy.mutateAsync({
          id: caseStudy.id,
          data,
        });
      } else {
        await createCaseStudy.mutateAsync(data);
      }
      navigate('/admin/case-studies');
    } catch (error) {
      console.error('Error saving case study:', error);
      toast({
        title: 'Error',
        description: `Failed to ${isEditing ? 'update' : 'create'} case study`,
        variant: 'destructive',
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{isEditing ? 'Edit' : 'Create'} Case Study</h1>
          <p className="text-muted-foreground mt-1">
            {isEditing 
              ? 'Update the details of this case study'
              : 'Add a new case study to showcase your success'
            }
          </p>
        </div>
        
        <CaseStudyForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isSubmitting={isEditing ? updateCaseStudy.isPending : createCaseStudy.isPending}
          isEditing={isEditing}
        />
      </div>
    </Layout>
  );
};

export default CaseStudyEditor;
