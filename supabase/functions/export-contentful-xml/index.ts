import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContentfulAsset {
  sys: { id: string };
  fields: {
    title?: string;
    file?: {
      url?: string;
      fileName?: string;
      contentType?: string;
    };
  };
}

interface ContentfulEntry {
  sys: {
    id: string;
    contentType: { sys: { id: string } };
    createdAt: string;
    updatedAt: string;
  };
  fields: Record<string, any>;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[export-contentful-xml] Starting export process');

    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('[export-contentful-xml] Missing authorization header');
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      console.error('[export-contentful-xml] Invalid token:', userError);
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is admin
    const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin', { uid: user.id });

    if (adminError || !isAdmin) {
      console.error('[export-contentful-xml] User is not admin');
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[export-contentful-xml] Admin authenticated successfully');

    // Get Contentful configuration
    const spaceId = Deno.env.get('VITE_CONTENTFUL_SPACE_ID');
    const deliveryToken = Deno.env.get('VITE_CONTENTFUL_DELIVERY_TOKEN');
    const environmentId = Deno.env.get('VITE_CONTENTFUL_ENVIRONMENT_ID') || 'master';

    if (!spaceId || !deliveryToken) {
      console.error('[export-contentful-xml] Missing Contentful configuration');
      return new Response(
        JSON.stringify({ error: 'Contentful configuration not found' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[export-contentful-xml] Fetching content types from Contentful');

    // Fetch all content types
    const contentTypesUrl = `https://cdn.contentful.com/spaces/${spaceId}/environments/${environmentId}/content_types`;
    const contentTypesResponse = await fetch(contentTypesUrl, {
      headers: {
        'Authorization': `Bearer ${deliveryToken}`,
      },
    });

    if (!contentTypesResponse.ok) {
      throw new Error(`Failed to fetch content types: ${contentTypesResponse.statusText}`);
    }

    const contentTypesData = await contentTypesResponse.json();
    const contentTypes = contentTypesData.items;

    console.log(`[export-contentful-xml] Found ${contentTypes.length} content types`);

    // Fetch all entries for all content types
    const entriesUrl = `https://cdn.contentful.com/spaces/${spaceId}/environments/${environmentId}/entries?limit=1000`;
    const entriesResponse = await fetch(entriesUrl, {
      headers: {
        'Authorization': `Bearer ${deliveryToken}`,
      },
    });

    if (!entriesResponse.ok) {
      throw new Error(`Failed to fetch entries: ${entriesResponse.statusText}`);
    }

    const entriesData = await entriesResponse.json();
    const entries: ContentfulEntry[] = entriesData.items;
    const includes = entriesData.includes || {};
    const assets: ContentfulAsset[] = includes.Asset || [];

    console.log(`[export-contentful-xml] Found ${entries.length} total entries`);

    // Build asset lookup map
    const assetMap = new Map();
    assets.forEach(asset => {
      assetMap.set(asset.sys.id, asset);
    });

    // Group entries by content type
    const entriesByType = new Map();
    entries.forEach(entry => {
      const typeId = entry.sys.contentType.sys.id;
      if (!entriesByType.has(typeId)) {
        entriesByType.set(typeId, []);
      }
      entriesByType.get(typeId).push(entry);
    });

    // Generate XML
    const exportDate = new Date().toISOString();
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<contentfulExport exportDate="${exportDate}" spaceId="${spaceId}" environment="${environmentId}">\n`;

    // Process each content type
    for (const contentType of contentTypes) {
      const typeId = contentType.sys.id;
      const typeName = contentType.name;
      const typeEntries = entriesByType.get(typeId) || [];

      xml += `  <contentType id="${escapeXml(typeId)}" name="${escapeXml(typeName)}">\n`;

      for (const entry of typeEntries) {
        xml += `    <entry id="${escapeXml(entry.sys.id)}" createdAt="${entry.sys.createdAt}" updatedAt="${entry.sys.updatedAt}">\n`;

        // Process each field
        for (const [fieldName, fieldValue] of Object.entries(entry.fields)) {
          xml += processField(fieldName, fieldValue, assetMap, 3);
        }

        xml += `    </entry>\n`;
      }

      xml += `  </contentType>\n`;
    }

    xml += `</contentfulExport>`;

    console.log('[export-contentful-xml] XML generation complete');

    // Return XML with download headers
    const filename = `contentful-export-${new Date().toISOString().split('T')[0]}.xml`;
    
    return new Response(xml, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error) {
    console.error('[export-contentful-xml] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function escapeXml(unsafe: string): string {
  if (typeof unsafe !== 'string') {
    return String(unsafe);
  }
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function processField(fieldName: string, fieldValue: any, assetMap: Map<string, ContentfulAsset>, indent: number): string {
  const indentStr = '  '.repeat(indent);
  let xml = '';

  if (fieldValue === null || fieldValue === undefined) {
    xml += `${indentStr}<field name="${escapeXml(fieldName)}" type="null"/>\n`;
  } else if (typeof fieldValue === 'string' || typeof fieldValue === 'number' || typeof fieldValue === 'boolean') {
    xml += `${indentStr}<field name="${escapeXml(fieldName)}" type="${typeof fieldValue}">${escapeXml(String(fieldValue))}</field>\n`;
  } else if (Array.isArray(fieldValue)) {
    xml += `${indentStr}<field name="${escapeXml(fieldName)}" type="array">\n`;
    fieldValue.forEach((item, index) => {
      if (item && typeof item === 'object' && item.sys) {
        // Linked entry or asset
        if (item.sys.linkType === 'Asset') {
          const asset = assetMap.get(item.sys.id);
          if (asset) {
            xml += `${indentStr}  <asset id="${escapeXml(item.sys.id)}">\n`;
            xml += `${indentStr}    <title>${escapeXml(asset.fields.title || '')}</title>\n`;
            xml += `${indentStr}    <url>${escapeXml(asset.fields.file?.url || '')}</url>\n`;
            xml += `${indentStr}    <fileName>${escapeXml(asset.fields.file?.fileName || '')}</fileName>\n`;
            xml += `${indentStr}    <contentType>${escapeXml(asset.fields.file?.contentType || '')}</contentType>\n`;
            xml += `${indentStr}  </asset>\n`;
          } else {
            xml += `${indentStr}  <assetReference id="${escapeXml(item.sys.id)}"/>\n`;
          }
        } else if (item.sys.linkType === 'Entry') {
          xml += `${indentStr}  <entryReference id="${escapeXml(item.sys.id)}" contentType="${escapeXml(item.sys.contentType?.sys?.id || 'unknown')}"/>\n`;
        }
      } else {
        xml += `${indentStr}  <item index="${index}">${escapeXml(String(item))}</item>\n`;
      }
    });
    xml += `${indentStr}</field>\n`;
  } else if (typeof fieldValue === 'object') {
    // Check if it's a linked entry/asset
    if (fieldValue.sys && fieldValue.sys.type === 'Link') {
      if (fieldValue.sys.linkType === 'Asset') {
        const asset = assetMap.get(fieldValue.sys.id);
        if (asset) {
          xml += `${indentStr}<field name="${escapeXml(fieldName)}" type="asset">\n`;
          xml += `${indentStr}  <asset id="${escapeXml(fieldValue.sys.id)}">\n`;
          xml += `${indentStr}    <title>${escapeXml(asset.fields.title || '')}</title>\n`;
          xml += `${indentStr}    <url>${escapeXml(asset.fields.file?.url || '')}</url>\n`;
          xml += `${indentStr}    <fileName>${escapeXml(asset.fields.file?.fileName || '')}</fileName>\n`;
          xml += `${indentStr}    <contentType>${escapeXml(asset.fields.file?.contentType || '')}</contentType>\n`;
          xml += `${indentStr}  </asset>\n`;
          xml += `${indentStr}</field>\n`;
        } else {
          xml += `${indentStr}<field name="${escapeXml(fieldName)}" type="assetReference" id="${escapeXml(fieldValue.sys.id)}"/>\n`;
        }
      } else if (fieldValue.sys.linkType === 'Entry') {
        xml += `${indentStr}<field name="${escapeXml(fieldName)}" type="entryReference" id="${escapeXml(fieldValue.sys.id)}"/>\n`;
      }
    } else if (fieldValue.nodeType === 'document') {
      // Rich text field
      xml += `${indentStr}<field name="${escapeXml(fieldName)}" type="richText">\n`;
      xml += `${indentStr}  <document>${escapeXml(JSON.stringify(fieldValue, null, 2))}</document>\n`;
      xml += `${indentStr}</field>\n`;
    } else {
      // Generic object
      xml += `${indentStr}<field name="${escapeXml(fieldName)}" type="object">\n`;
      xml += `${indentStr}  <json>${escapeXml(JSON.stringify(fieldValue))}</json>\n`;
      xml += `${indentStr}</field>\n`;
    }
  }

  return xml;
}
