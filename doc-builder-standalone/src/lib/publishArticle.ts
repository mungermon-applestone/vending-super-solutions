import { supabase } from '@/integrations/supabase/client';
import type { CapturedStep } from '@/hooks/useScreenCapture';

interface PublishOptions {
  connectionId: string;
  articleTitle: string;
  section?: string;
  heading?: string;
  steps: CapturedStep[];
  publishImmediately: boolean;
}

const BUCKET = 'screenshots';

async function uploadStep(blob: Blob, userId: string, sessionId: string, order: number) {
  const path = `${userId}/${sessionId}/step-${String(order).padStart(3, '0')}.png`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { contentType: 'image/png', upsert: true });
  if (error) throw new Error(`Screenshot upload failed: ${error.message}`);
  return path;
}

export async function publishArticle(options: PublishOptions): Promise<
  { success: true; entryId: string } | { success: false; error: string }
> {
  const { connectionId, articleTitle, section, heading, steps, publishImmediately } = options;

  try {
    const { data: auth } = await supabase.auth.getUser();
    const userId = auth.user?.id;
    if (!userId) return { success: false, error: 'You must be signed in to publish.' };

    const sessionId = crypto.randomUUID();
    const sorted = [...steps].sort((a, b) => a.order - b.order);

    const stepsPayload: { storagePath: string; caption: string; order: number }[] = [];
    for (let i = 0; i < sorted.length; i++) {
      const storagePath = await uploadStep(sorted[i].blob, userId, sessionId, i);
      stepsPayload.push({ storagePath, caption: sorted[i].description || '', order: i });
    }

    const { data, error } = await supabase.functions.invoke('publish-article', {
      body: {
        connectionId,
        title: articleTitle,
        section,
        heading,
        publishImmediately,
        steps: stepsPayload,
      },
    });

    if (error) {
      const details =
        'context' in error && error.context ? await (error.context as Response).text() : error.message;
      return { success: false, error: details };
    }
    if (!data?.success) return { success: false, error: data?.error ?? 'Unknown publish error' };

    return { success: true, entryId: data.entryId };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
