import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { useHeroSlides } from '@/hooks/cms/useHeroSlides';
import { exportHeroSlidesToPPT } from '@/services/export/heroSlidesToPPT';
import { toast } from 'sonner';

interface ExportHeroSlidesButtonProps {
  sliderId?: string;
  className?: string;
}

export const ExportHeroSlidesButton: React.FC<ExportHeroSlidesButtonProps> = ({
  sliderId = 'home-slider',
  className = ''
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const { data: slides, isLoading, error } = useHeroSlides(sliderId);

  const handleExport = async () => {
    if (!slides || slides.length === 0) {
      toast.error('No slides available to export');
      return;
    }

    setIsExporting(true);
    
    try {
      console.log('[ExportHeroSlidesButton] Starting export...');
      
      await exportHeroSlidesToPPT(slides, {
        fileName: `hero-slides-${new Date().toISOString().split('T')[0]}.pptx`
      });
      
      toast.success(`Successfully exported ${slides.length} slides to PowerPoint!`);
      
    } catch (error) {
      console.error('[ExportHeroSlidesButton] Export failed:', error);
      toast.error(
        error instanceof Error 
          ? `Export failed: ${error.message}` 
          : 'Failed to export slides. Please try again.'
      );
    } finally {
      setIsExporting(false);
    }
  };

  // Don't show button if slides are loading or there's an error
  if (isLoading || error || !slides || slides.length === 0) {
    return null;
  }

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting}
      variant="outline"
      size="sm"
      className={`flex items-center gap-2 ${className}`}
    >
      {isExporting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {isExporting ? 'Exporting...' : `Export ${slides.length} Slides to PPT`}
    </Button>
  );
};

export default ExportHeroSlidesButton;