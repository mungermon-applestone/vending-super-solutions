import html2canvas from 'html2canvas';
import PptxGenJS from 'pptxgenjs';
import { saveAs } from 'file-saver';
import { HeroSlide } from '@/hooks/cms/useHeroSlides';

interface ExportOptions {
  fileName?: string;
  quality?: number;
  slideSize?: {
    width: number;
    height: number;
  };
}

export async function exportHeroSlidesToPPT(
  slides: HeroSlide[],
  options: ExportOptions = {}
) {
  const {
    fileName = 'hero-slides.pptx',
    quality = 0.9,
    slideSize = { width: 10, height: 5.625 } // 16:9 aspect ratio in inches
  } = options;

  try {
    console.log('[heroSlidesToPPT] Starting export of', slides.length, 'slides');
    
    // Create new PowerPoint presentation
    const pptx = new PptxGenJS();
    
    // Set slide size (16:9 aspect ratio)
    pptx.defineLayout({
      name: 'LAYOUT_16x9',
      width: slideSize.width,
      height: slideSize.height
    });
    pptx.layout = 'LAYOUT_16x9';

    // Process each slide
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      console.log(`[heroSlidesToPPT] Processing slide ${i + 1}: ${slide.title}`);
      
      // Add new slide
      const pptSlide = pptx.addSlide();
      
      // Add background color/gradient
      pptSlide.background = { color: 'F8FAFC' }; // Light gray background
      
      // Add title
      pptSlide.addText(slide.title, {
        x: 0.5,
        y: 0.5,
        w: 4.5,
        h: 1.2,
        fontSize: 32,
        fontFace: 'Arial',
        bold: true,
        color: '1E3A8A', // vending-blue-dark equivalent
        align: 'left',
        valign: 'top'
      });
      
      // Add subtitle/description
      if (slide.subtitle) {
        pptSlide.addText(slide.subtitle, {
          x: 0.5,
          y: 2,
          w: 4.5,
          h: 2.5,
          fontSize: 16,
          fontFace: 'Arial',
          color: '374151', // gray-700 equivalent
          align: 'left',
          valign: 'top'
        });
      }
      
      // Add image if available
      if (slide.image?.url) {
        try {
          // Convert image URL to data URL for embedding
          const imageData = await fetchImageAsDataURL(slide.image.url);
          
          pptSlide.addImage({
            data: imageData,
            x: 5.5,
            y: 0.5,
            w: 4,
            h: 4.5,
            sizing: { type: 'contain', w: 4, h: 4.5 }
          });
        } catch (error) {
          console.warn(`[heroSlidesToPPT] Failed to add image for slide ${i + 1}:`, error);
        }
      }
      
      // Add primary button text if available
      if (slide.primaryButtonText && slide.primaryButtonUrl) {
        pptSlide.addText(`Call to Action: ${slide.primaryButtonText}`, {
          x: 0.5,
          y: 4.5,
          w: 3,
          h: 0.5,
          fontSize: 14,
          fontFace: 'Arial',
          bold: true,
          color: '1E3A8A',
          align: 'left'
        });
      }
      
      // Add slide number
      pptSlide.addText(`Slide ${i + 1} of ${slides.length}`, {
        x: 8.5,
        y: 5,
        w: 1.5,
        h: 0.3,
        fontSize: 10,
        fontFace: 'Arial',
        color: '6B7280',
        align: 'right'
      });
    }
    
    // Generate and save the PowerPoint file
    console.log('[heroSlidesToPPT] Generating PowerPoint file...');
    const pptxBlob = await pptx.write({ outputType: 'blob' });
    
    // Use file-saver to download the file
    saveAs(pptxBlob as Blob, fileName);
    
    console.log('[heroSlidesToPPT] Export completed successfully');
    return true;
    
  } catch (error) {
    console.error('[heroSlidesToPPT] Export failed:', error);
    throw new Error(`Failed to export slides to PowerPoint: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function fetchImageAsDataURL(imageUrl: string): Promise<string> {
  try {
    // Handle Contentful URLs that might be missing protocol
    const url = imageUrl.startsWith('//') ? `https:${imageUrl}` : imageUrl;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    
    // Convert blob to data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('[fetchImageAsDataURL] Error:', error);
    throw error;
  }
}