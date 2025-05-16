
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Save, AlertTriangle } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { BusinessGoalFormData } from '@/types/forms';
import { useBusinessGoal } from '@/hooks/useCMSData';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { showDeprecationToast } from '@/services/cms/utils/deprecationToastUtils';
import { logDeprecationWarning } from '@/services/cms/utils/deprecation';

// Import form sections
import BasicInformation from './sections/BasicInformation';
import GoalImage from './sections/GoalImage';
import GoalBenefits from './sections/GoalBenefits';
import GoalFeatures from './sections/GoalFeatures';

interface BusinessGoalEditorFormProps {
  goalSlug?: string;
  isEditMode?: boolean;
}

const BusinessGoalEditorForm = ({ goalSlug, isEditMode = false }: BusinessGoalEditorFormProps) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const isCreating = !isEditMode;
  
  // Log deprecation warning when component is mounted
  useEffect(() => {
    const warningMsg = logDeprecationWarning(
      "BusinessGoalEditorForm",
      "This Business Goal editor interface is deprecated and will be removed in a future version.",
      "Please use Contentful to manage business goal content."
    );
    
    showDeprecationToast(
      "Deprecated Business Goal Editor", 
      "This interface is deprecated. Please use Contentful for content management."
    );
  }, []);
  
  // Fetch business goal data if editing
  const { data: existingGoal, isLoading: isLoadingGoal } = useBusinessGoal(goalSlug);
  
  console.log('[BusinessGoalEditorForm] Rendering with goal slug:', goalSlug);
  console.log('[BusinessGoalEditorForm] Is edit mode:', isEditMode);
  console.log('[BusinessGoalEditorForm] Is creating new goal:', isCreating);
  
  // Initialize form with default values
  const form = useForm<BusinessGoalFormData>({
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      icon: 'trending-up',
      image: { url: '', alt: '' },
      benefits: [''],
      features: [{ title: '', description: '', icon: 'check', screenshotUrl: '', screenshotAlt: '' }]
    }
  });
  
  // Populate form with existing business goal data when available
  useEffect(() => {
    if (existingGoal && isEditMode) {
      console.log('[BusinessGoalEditorForm] Populating form with goal data:', existingGoal);
      
      // Create a clean object from the existing business goal data
      const goalData: BusinessGoalFormData = {
        title: existingGoal.title || '',
        slug: existingGoal.slug || '',
        description: existingGoal.description || '',
        icon: existingGoal.icon || 'trending-up',
        image: {
          url: existingGoal.image?.url || '',
          alt: existingGoal.image?.alt || ''
        },
        benefits: existingGoal.benefits && existingGoal.benefits.length > 0 
          ? [...existingGoal.benefits] 
          : [''],
        features: existingGoal.features && existingGoal.features.length > 0 
          ? existingGoal.features.map(feature => ({
              title: feature.title || '',
              description: feature.description || '',
              icon: typeof feature.icon === 'string' ? feature.icon : 'check',
              screenshotUrl: feature.screenshot?.url || '',
              screenshotAlt: feature.screenshot?.alt || ''
            })) 
          : [{ title: '', description: '', icon: 'check', screenshotUrl: '', screenshotAlt: '' }]
      };
      
      // Reset the form with clean data
      form.reset(goalData);
      
      console.log('[BusinessGoalEditorForm] Form reset with values:', form.getValues());
    }
  }, [existingGoal, isEditMode, form]);

  // Handle form submission - redirects to Contentful now
  const handleSubmit = form.handleSubmit(async (data) => {
    console.log('[BusinessGoalEditorForm] Form submission redirecting to Contentful');
    setIsLoading(true);
    
    try {
      // Show deprecation toast
      showDeprecationToast(
        "Business Goal Editor Deprecated",
        "Please use Contentful for business goal management. Redirecting to admin page."
      );
      
      // Navigate back to admin page after showing toast
      setTimeout(() => {
        navigate('/admin/business-goals');
      }, 1500);
    } catch (error) {
      console.error('[BusinessGoalEditorForm] Error:', error);
    } finally {
      setIsLoading(false);
    }
  });

  // Display loading state while fetching business goal data
  if (isLoadingGoal && isEditMode) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Loading Business Goal Data...</h1>
        <div className="animate-pulse space-y-8">
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Deprecated Interface</AlertTitle>
        <AlertDescription>
          This Business Goal editor is deprecated and will be removed in a future version.
          Please use Contentful directly for content management.
        </AlertDescription>
      </Alert>
      
      <h1 className="text-3xl font-bold mb-6">
        {isCreating ? 'Create New Business Goal' : `Edit Business Goal: ${form.watch('title') || 'Loading...'}`}
      </h1>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-8">
          <BasicInformation form={form} />
          <GoalImage form={form} />
          <GoalBenefits form={form} />
          <GoalFeatures form={form} />

          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/admin/business-goals')}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="gap-2"
            >
              {isLoading ? 'Redirecting...' : <><Save className="h-4 w-4" /> Continue to Contentful</>}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BusinessGoalEditorForm;
