
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchCaseStudies, 
  fetchCaseStudyBySlug,
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy 
} from '@/services/cms/contentTypes/caseStudies';
import { useToast } from './use-toast';

// Hook for fetching all case studies
export const useCaseStudies = () => {
  return useQuery({
    queryKey: ['case-studies'],
    queryFn: fetchCaseStudies,
  });
};

// Hook for fetching a single case study by slug
export const useCaseStudy = (slug: string | undefined) => {
  return useQuery({
    queryKey: ['case-study', slug],
    queryFn: () => fetchCaseStudyBySlug(slug || ''),
    enabled: !!slug,
  });
};

// Hook for creating a new case study
export const useCreateCaseStudy = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: createCaseStudy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['case-studies'] });
      toast({
        title: "Success",
        description: "Case study created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create case study: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });
};

// Hook for updating an existing case study
export const useUpdateCaseStudy = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateCaseStudy(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['case-studies'] });
      queryClient.invalidateQueries({ queryKey: ['case-study', variables.data.slug] });
      toast({
        title: "Success",
        description: "Case study updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update case study: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });
};

// Hook for deleting a case study
export const useDeleteCaseStudy = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: deleteCaseStudy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['case-studies'] });
      toast({
        title: "Success",
        description: "Case study deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete case study: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });
};
