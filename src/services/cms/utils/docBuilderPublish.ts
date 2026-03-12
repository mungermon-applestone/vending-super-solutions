
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { CapturedStep } from '@/hooks/useScreenCapture';

interface PublishOptions {
  articleTitle: string;
  sectionCategory: string;
  headingCategory: string;
  steps: CapturedStep[];
  publishImmediately: boolean;
}

/**
 * Upload a blob to Supabase Storage and return the public URL
 */
async function uploadToStorage(blob: Blob, sessionId: string, stepOrder: number): Promise<string> {
  const filePath = `${sessionId}/step-${String(stepOrder).padStart(3, '0')}.png`;
  const { error } = await supabase.storage
    .from('doc-builder-screenshots')
    .upload(filePath, blob, { contentType: 'image/png', upsert: true });

  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  const { data } = supabase.storage
    .from('doc-builder-screenshots')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * Publish captured steps as a helpDeskArticle to Contentful via edge function
 */
export async function publishDocToContentful(options: PublishOptions): Promise<{ success: boolean; entryId?: string; error?: string }> {
  const { articleTitle, sectionCategory, headingCategory, steps, publishImmediately } = options;

  try {
    const sessionId = uuidv4();
    const sortedSteps = [...steps].sort((a, b) => a.order - b.order);

    // 1. Upload screenshots to Supabase Storage
    console.log(`[docBuilderPublish] Uploading ${sortedSteps.length} screenshots to storage…`);
    const stepsPayload: { publicUrl: string; description: string; order: number }[] = [];

    for (let i = 0; i < sortedSteps.length; i++) {
      console.log(`[docBuilderPublish] Uploading step ${i + 1}/${sortedSteps.length}…`);
      try {
        const url = await uploadToStorage(sortedSteps[i].blob, sessionId, i);
        stepsPayload.push({
          publicUrl: url,
          description: sortedSteps[i].description || '',
          order: sortedSteps[i].order,
        });
      } catch (uploadErr) {
        console.error(`[docBuilderPublish] Step ${i + 1} upload failed:`, uploadErr);
        return { success: false, error: `Screenshot upload failed at step ${i + 1}: ${uploadErr instanceof Error ? uploadErr.message : 'Unknown error'}` };
      }
    }

    // 2. Call edge function to create Contentful entry
    console.log('[docBuilderPublish] Invoking publish-doc-to-contentful edge function…');
    const { data, error } = await supabase.functions.invoke('publish-doc-to-contentful', {
      body: {
        articleTitle,
        sectionCategory,
        headingCategory,
        publishImmediately,
        steps: stepsPayload,
      },
    });

    if (error) {
      console.error('[docBuilderPublish] Edge function error:', error);
      return { success: false, error: error.message || 'Edge function call failed' };
    }

    if (!data?.success) {
      return { success: false, error: data?.error || 'Unknown error from edge function' };
    }

    console.log(`[docBuilderPublish] Success! Entry ID: ${data.entryId}`);
    return { success: true, entryId: data.entryId };
  } catch (error) {
    console.error('[docBuilderPublish] Error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
