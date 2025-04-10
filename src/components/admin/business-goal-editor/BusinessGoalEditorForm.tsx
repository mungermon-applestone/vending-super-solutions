
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { BusinessGoalFormData } from '@/types/forms';
import { useBusinessGoal } from '@/hooks/useCMSData';
import { createBusinessGoal, updateBusinessGoal } from '@/services/businessGoal';

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

  // Handle form submission
  const handleSubmit = form.handleSubmit(async (data) => {
    console.log('[BusinessGoalEditorForm] Form submission with data:', data);
    setIsLoading(true);
    
    try {
      if (isCreating) {
        console.log('[BusinessGoalEditorForm] Creating new business goal');
        await createBusinessGoal(data, toast);
        navigate('/admin/business-goals');
      } else if (goalSlug) {
        console.log(`[BusinessGoalEditorForm] Updating business goal: ${goalSlug}`);
        await updateBusinessGoal(data, goalSlug, toast);
        navigate('/admin/business-goals');
      }
    } catch (error) {
      console.error('[BusinessGoalEditorForm] Error saving business goal:', error);
      // Error toast is handled in the service functions
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
              {isLoading ? 'Saving...' : <><Save className="h-4 w-4" /> Save Business Goal</>}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BusinessGoalEditorForm;
