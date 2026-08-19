import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { testConnection, type ContentfulConfig } from '../publish-article/contentful.ts';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return json({ ok: false, message: 'Unauthorized' }, 401);

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    const { data: userData, error: userErr } = await admin.auth.getUser(
      authHeader.replace('Bearer ', ''),
    );
    if (userErr || !userData?.user) return json({ ok: false, message: 'Unauthorized' }, 401);
    const userId = userData.user.id;

    const body = await req.json();
    const {
      connectionId,
      provider = 'contentful',
      spaceId,
      environmentId = 'master',
      contentTypeId,
      titleField,
      bodyField,
      sectionField,
      headingField,
      locale = 'en-US',
      managementToken,
      persist,
      name,
    } = body ?? {};

    if (provider !== 'contentful') return json({ ok: false, message: `Unsupported provider: ${provider}` }, 400);
    if (!spaceId || !contentTypeId || !titleField || !bodyField) {
      return json({ ok: false, message: 'spaceId, contentTypeId, titleField and bodyField are required' }, 400);
    }

    // Reuse the stored token when the user is re-testing an existing connection.
    let token: string | undefined = managementToken;
    if (!token && connectionId) {
      const { data: existing } = await admin
        .from('cms_connections')
        .select('id')
        .eq('id', connectionId)
        .eq('user_id', userId)
        .maybeSingle();
      if (!existing) return json({ ok: false, message: 'CMS connection not found' }, 404);
      const { data: secret } = await admin
        .from('cms_connection_secrets')
        .select('management_token')
        .eq('connection_id', connectionId)
        .maybeSingle();
      token = secret?.management_token;
    }
    if (!token) return json({ ok: false, message: 'A management token is required' }, 400);

    const cfg: ContentfulConfig = {
      spaceId,
      environmentId,
      managementToken: token,
      contentTypeId,
      titleField,
      bodyField,
      sectionField,
      headingField,
      locale,
    };

    const result = await testConnection(cfg);
    if (!result.ok || !persist) return json(result, result.ok ? 200 : 400);

    // Save config for the caller, keeping the token in the server-only table.
    const row = {
      user_id: userId,
      provider,
      name: name || `${spaceId}/${environmentId}`,
      space_id: spaceId,
      environment_id: environmentId,
      content_type_id: contentTypeId,
      title_field: titleField,
      body_field: bodyField,
      section_field: sectionField || null,
      heading_field: headingField || null,
      locale,
    };

    let savedId = connectionId as string | undefined;
    if (savedId) {
      const { error } = await admin.from('cms_connections').update(row).eq('id', savedId).eq('user_id', userId);
      if (error) return json({ ok: false, message: error.message }, 500);
    } else {
      const { data, error } = await admin.from('cms_connections').insert(row).select('id').single();
      if (error) return json({ ok: false, message: error.message }, 500);
      savedId = data.id;
    }

    const { error: secretErr } = await admin
      .from('cms_connection_secrets')
      .upsert({ connection_id: savedId, management_token: token, updated_at: new Date().toISOString() });
    if (secretErr) return json({ ok: false, message: secretErr.message }, 500);

    return json({ ...result, connectionId: savedId });
  } catch (error) {
    console.error('[test-cms-connection]', error);
    return json({ ok: false, message: error instanceof Error ? error.message : 'Unknown error' }, 500);
  }
});
