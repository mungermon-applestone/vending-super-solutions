import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createArticle, type ContentfulConfig, type Step } from './contentful.ts';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return json({ success: false, error: 'Unauthorized' }, 401);

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: userData, error: userErr } = await admin.auth.getUser(
      authHeader.replace('Bearer ', ''),
    );
    if (userErr || !userData?.user) return json({ success: false, error: 'Unauthorized' }, 401);
    const userId = userData.user.id;

    const body = await req.json();
    const { connectionId, title, section, heading, publishImmediately, steps } = body ?? {};

    if (!connectionId || typeof title !== 'string' || !title.trim() || !Array.isArray(steps) || !steps.length) {
      return json({ success: false, error: 'connectionId, title and at least one step are required' }, 400);
    }

    // Connection must belong to the caller.
    const { data: conn, error: connErr } = await admin
      .from('cms_connections')
      .select('*')
      .eq('id', connectionId)
      .eq('user_id', userId)
      .maybeSingle();
    if (connErr) return json({ success: false, error: connErr.message }, 500);
    if (!conn) return json({ success: false, error: 'CMS connection not found' }, 404);

    const { data: secret } = await admin
      .from('cms_connection_secrets')
      .select('management_token')
      .eq('connection_id', connectionId)
      .maybeSingle();
    if (!secret?.management_token) {
      return json({ success: false, error: 'No management token stored for this connection' }, 400);
    }

    // Sign each screenshot so the CMS can fetch it from the private bucket.
    const signedSteps: Step[] = [];
    for (const s of steps) {
      const path = String(s.storagePath ?? '');
      if (!path.startsWith(`${userId}/`)) {
        return json({ success: false, error: 'Invalid screenshot path' }, 400);
      }
      const { data: signed, error: signErr } = await admin.storage
        .from('screenshots')
        .createSignedUrl(path, 60 * 30);
      if (signErr || !signed?.signedUrl) {
        return json({ success: false, error: `Could not sign ${path}: ${signErr?.message}` }, 500);
      }
      signedSteps.push({ imageUrl: signed.signedUrl, caption: String(s.caption ?? ''), order: Number(s.order ?? 0) });
    }

    if (conn.provider !== 'contentful') {
      return json({ success: false, error: `Unsupported provider: ${conn.provider}` }, 400);
    }

    const cfg: ContentfulConfig = {
      spaceId: conn.space_id,
      environmentId: conn.environment_id,
      managementToken: secret.management_token,
      contentTypeId: conn.content_type_id,
      titleField: conn.title_field,
      bodyField: conn.body_field,
      sectionField: conn.section_field,
      headingField: conn.heading_field,
      locale: conn.locale,
    };

    const result = await createArticle(cfg, {
      title,
      section,
      heading,
      steps: signedSteps,
      publishImmediately: Boolean(publishImmediately),
    });

    await admin.from('published_articles').insert({
      user_id: userId,
      connection_id: connectionId,
      title,
      entry_id: result.entryId,
      step_count: signedSteps.length,
      published: result.published,
    });

    return json({ success: true, entryId: result.entryId, published: result.published });
  } catch (error) {
    console.error('[publish-article]', error);
    return json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, 500);
  }
});
