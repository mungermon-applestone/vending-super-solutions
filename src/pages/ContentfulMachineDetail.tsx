
import React, { useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useContentfulMachine } from '@/hooks/cms/useContentfulMachines';
import MachinePageTemplate from '@/components/machines/MachinePageTemplate';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useTestimonialSection } from '@/hooks/cms/useTestimonialSection';

const ContentfulMachineDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: machine, isLoading, error } = useContentfulMachine(slug);
  const { data: testimonialSection } = useTestimonialSection('machines');

  // Scroll to top when the component mounts or slug changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const formattedMachine = useMemo(() => {
    if (!machine) return null;

    // Create empty deployment examples if none exist
    const deploymentExamples = machine.images && machine.images.length > 1 
      ? machine.images.slice(1, 3).map((image, index) => ({
          title: `Example ${index + 1}`,
          description: 'Deployment example',
          image: image
        }))
      : [];

    // Ensure type is strictly "vending" or "locker" as a union type
    const machineType = machine.type === 'locker' ? 'locker' : 'vending' as 'vending' | 'locker';

    // Ensure all images have an id property
    const processedImages = Array.isArray(machine.images) 
      ? machine.images.map((img, index) => ({
          id: img.id || `img-${machine.id}-${index}`, // Use existing id or create one
          url: img.url,
          alt: img.alt || machine.title
        }))
      : [];

    return {
      id: machine.id,
      slug: machine.slug,
      title: machine.title,
      type: machineType,
      temperature: machine.temperature || 'ambient',
      description: machine.description,
      images: processedImages, // Use the processed images with IDs
      specs: machine.specs || {},
      features: machine.features || [],
      deploymentExamples,
      testimonialSection
    };
  }, [machine, testimonialSection]);

  if (isLoading) {
    return (
      <div className="container py-12">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Skeleton className="h-80 w-full" />
          <div>
            <Skeleton className="h-6 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-4/5 mb-6" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error loading machine details</p>
          <p>{error instanceof Error ? error.message : 'Unknown error'}</p>
          <Link to="/contentful/machines" className="mt-4 inline-block">
            <Button variant="outline">Back to Machines</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!machine) {
    return (
      <div className="container py-12">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          <p className="font-bold">Machine not found</p>
          <p>The machine with slug "{slug}" could not be found.</p>
          <Link to="/contentful/machines" className="mt-4 inline-block">
            <Button variant="outline">Back to Machines</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!formattedMachine) {
    return (
      <div className="container py-12">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          <p>Error formatting machine data. Please check the console for details.</p>
          <Link to="/contentful/machines" className="mt-4 inline-block">
            <Button variant="outline">Back to Machines</Button>
          </Link>
        </div>
      </div>
    );
  }

  return <MachinePageTemplate machine={formattedMachine} />;
};

export default ContentfulMachineDetail;
