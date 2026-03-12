
import { getContentfulConfig } from '@/config/cms';
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
 * Upload an image to Contentful as an Asset via Management API
 */
async function createContentfulAsset(
  publicUrl: string,
  title: string,
  config: { SPACE_ID: string; MANAGEMENT_TOKEN: string; ENVIRONMENT_ID: string }
): Promise<string> {
  const baseUrl = `https://api.contentful.com/spaces/${config.SPACE_ID}/environments/${config.ENVIRONMENT_ID}`;
  const headers = {
    Authorization: `Bearer ${config.MANAGEMENT_TOKEN}`,
    'Content-Type': 'application/vnd.contentful.management.v1+json',
  };

  // Create asset
  const createRes = await fetch(`${baseUrl}/assets`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      fields: {
        title: { 'en-US': title },
        file: {
          'en-US': {
            contentType: 'image/png',
            fileName: `${title.replace(/\s+/g, '-').toLowerCase()}.png`,
            upload: publicUrl,
          },
        },
      },
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Contentful asset creation failed: ${err}`);
  }

  const asset = await createRes.json();
  const assetId = asset.sys.id;
  let version = asset.sys.version;

  // Process asset
  const processRes = await fetch(`${baseUrl}/assets/${assetId}/files/en-US/process`, {
    method: 'PUT',
    headers: { ...headers, 'X-Contentful-Version': String(version) },
  });

  if (!processRes.ok) {
    const err = await processRes.text();
    throw new Error(`Contentful asset processing failed: ${err}`);
  }

  // Wait for processing to complete
  let processed = false;
  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 1500));
    const checkRes = await fetch(`${baseUrl}/assets/${assetId}`, { headers });
    const checkData = await checkRes.json();
    if (checkData.fields?.file?.['en-US']?.url) {
      version = checkData.sys.version;
      processed = true;
      break;
    }
  }

  if (!processed) throw new Error('Asset processing timed out');

  // Publish asset
  const pubRes = await fetch(`${baseUrl}/assets/${assetId}/published`, {
    method: 'PUT',
    headers: { ...headers, 'X-Contentful-Version': String(version) },
  });

  if (!pubRes.ok) {
    const err = await pubRes.text();
    throw new Error(`Contentful asset publish failed: ${err}`);
  }

  return assetId;
}

/**
 * Build the Rich Text document with embedded asset blocks and placeholder paragraphs
 */
function buildRichTextDocument(assetIds: string[], descriptions: string[]): object {
  const content: any[] = [];

  assetIds.forEach((assetId, index) => {
    content.push({
      nodeType: 'embedded-asset-block',
      data: {
        target: {
          sys: {
            id: assetId,
            type: 'Link',
            linkType: 'Asset',
          },
        },
      },
      content: [],
    });

    const text = descriptions[index]?.trim() || `Step ${index + 1}: Describe what the user should do here.`;
    const marks = descriptions[index]?.trim() ? [] : [{ type: 'italic' }];

    content.push({
      nodeType: 'paragraph',
      data: {},
      content: [
        {
          nodeType: 'text',
          value: text,
          marks,
          data: {},
        },
      ],
    });
  });

  return {
    nodeType: 'document',
    data: {},
    content,
  };
}

/**
 * Publish captured steps as a helpDeskArticle to Contentful
 */
export async function publishDocToContentful(options: PublishOptions): Promise<{ success: boolean; entryId?: string; error?: string }> {
  const { articleTitle, sectionCategory, headingCategory, steps, publishImmediately } = options;

  try {
    const config = await getContentfulConfig();

    if (!config.MANAGEMENT_TOKEN || !config.SPACE_ID) {
      throw new Error('Contentful management token or space ID not configured');
    }

    const sessionId = uuidv4();

    // Sort steps by order
    const sortedSteps = [...steps].sort((a, b) => a.order - b.order);

    // 1. Upload screenshots to Supabase Storage
    console.log(`[docBuilderPublish] Uploading ${sortedSteps.length} screenshots to storage…`);
    const publicUrls: string[] = [];
    for (let i = 0; i < sortedSteps.length; i++) {
      const url = await uploadToStorage(sortedSteps[i].blob, sessionId, i);
      publicUrls.push(url);
    }

    // 2. Create Contentful assets
    console.log('[docBuilderPublish] Creating Contentful assets…');
    const assetIds: string[] = [];
    for (let i = 0; i < publicUrls.length; i++) {
      const assetId = await createContentfulAsset(
        publicUrls[i],
        `${articleTitle} - Step ${i + 1}`,
        { SPACE_ID: config.SPACE_ID, MANAGEMENT_TOKEN: config.MANAGEMENT_TOKEN, ENVIRONMENT_ID: config.ENVIRONMENT_ID }
      );
      assetIds.push(assetId);
    }

    // 3. Build rich text and create entry
    console.log('[docBuilderPublish] Creating helpDeskArticle entry…');
    const descriptions = sortedSteps.map((s) => s.description || '');
    const richText = buildRichTextDocument(assetIds, descriptions);

    const baseUrl = `https://api.contentful.com/spaces/${config.SPACE_ID}/environments/${config.ENVIRONMENT_ID}`;
    const headers = {
      Authorization: `Bearer ${config.MANAGEMENT_TOKEN}`,
      'Content-Type': 'application/vnd.contentful.management.v1+json',
      'X-Contentful-Content-Type': 'helpDeskArticle',
    };

    const entryFields: any = {
      articleTitle: { 'en-US': articleTitle },
      articleContent: { 'en-US': richText },
    };

    if (sectionCategory) {
      entryFields.sectionCategory = { 'en-US': sectionCategory };
    }
    if (headingCategory) {
      entryFields.headingCategory = { 'en-US': headingCategory };
    }

    const entryRes = await fetch(`${baseUrl}/entries`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ fields: entryFields }),
    });

    if (!entryRes.ok) {
      const err = await entryRes.text();
      throw new Error(`Entry creation failed: ${err}`);
    }

    const entry = await entryRes.json();
    const entryId = entry.sys.id;

    // 4. Optionally publish
    if (publishImmediately) {
      console.log('[docBuilderPublish] Publishing entry…');
      const pubRes = await fetch(`${baseUrl}/entries/${entryId}/published`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${config.MANAGEMENT_TOKEN}`,
          'X-Contentful-Version': String(entry.sys.version),
        },
      });
      if (!pubRes.ok) {
        console.warn('[docBuilderPublish] Entry created but publish failed');
      }
    }

    console.log(`[docBuilderPublish] Success! Entry ID: ${entryId}`);
    return { success: true, entryId };
  } catch (error) {
    console.error('[docBuilderPublish] Error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
