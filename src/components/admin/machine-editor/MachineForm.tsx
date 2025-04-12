
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Form } from "@/components/ui/form";
import { MachineFormValues, MachineData } from '@/utils/machineMigration/types';

// Import section components
import BasicInformation from './sections/BasicInformation';
import MachineImages from './sections/MachineImages';
import MachineSpecifications from './sections/MachineSpecifications';
import MachineFeatures from './sections/MachineFeatures';

const machineFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  slug: z.string().min(3, { message: "Slug must be at least 3 characters." })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { 
      message: "Slug must contain only lowercase letters, numbers, and hyphens."
    }),
  type: z.string().min(1, { message: "Type is required." }),
  temperature: z.string().min(1, { message: "Temperature is required." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  images: z.array(
    z.object({
      url: z.string().url({ message: "Please enter a valid URL." }),
      alt: z.string().optional(),
      width: z.number().optional(),
      height: z.number().optional(),
    })
  ).optional(),
  specs: z.array(
    z.object({
      key: z.string().min(1, { message: "Spec key is required." }),
      value: z.string().min(1, { message: "Spec value is required." }),
    })
  ).optional(),
  features: z.array(
    z.object({
      text: z.string().min(3, { message: "Feature text must be at least 3 characters." }),
    })
  ).optional(),
});

interface MachineFormProps {
  machine?: MachineData | null;
  isCreating: boolean;
  onSubmit: (data: MachineFormValues) => Promise<void>;
}

const MachineForm = ({ machine, isCreating, onSubmit }: MachineFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<MachineFormValues>({
    resolver: zodResolver(machineFormSchema),
    defaultValues: {
      title: '',
      slug: '',
      type: 'vending',
      temperature: 'ambient',
      description: '',
      images: [{ url: '', alt: '' }],
      specs: [{ key: '', value: '' }],
      features: [{ text: '' }],
    },
  });

  useEffect(() => {
    if (machine && !isCreating) {
      console.log("Loading machine data into form:", machine);
      const images = machine.images?.map(img => ({
        url: img.url,
        alt: img.alt,
        width: img.width || undefined,
        height: img.height || undefined,
      })) || [{ url: '', alt: '' }];
      
      const specs = Object.entries(machine.specs || {}).map(([key, value]) => ({
        key,
        value: typeof value === 'string' ? value : JSON.stringify(value),
      })) || [{ key: '', value: '' }];
      
      const features = machine.features?.map(feature => ({
        text: feature,
      })) || [{ text: '' }];
      
      form.reset({
        title: machine.title,
        slug: machine.slug,
        type: machine.type,
        temperature: machine.temperature,
        description: machine.description,
        images,
        specs,
        features,
      });
    }
  }, [machine, form, isCreating]);

  const handleSubmit = async (data: MachineFormValues) => {
    setIsSubmitting(true);
    
    try {
      console.log("Submitting form data:", data);
      
      // Filter out empty image URLs
      const filteredImages = data.images?.filter(img => img.url && img.url.trim() !== '') || [];
      
      const sanitizedData = {
        ...data,
        images: filteredImages.map(img => ({
          ...img,
          alt: img.alt || data.title || '',
        })),
      };
      
      console.log("Sanitized data for submission:", sanitizedData);
      await onSubmit(sanitizedData);
    } catch (error) {
      console.error('Error saving machine:', error);
      toast({
        title: "Error",
        description: "Failed to save machine. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BasicInformation form={form} />
            <MachineImages form={form} />
          </div>

          <MachineSpecifications form={form} />
          <MachineFeatures form={form} />
          
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/machines')}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isCreating ? "Creating..." : "Updating..."}
                </>
              ) : (
                isCreating ? "Create Machine" : "Update Machine"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default MachineForm;
