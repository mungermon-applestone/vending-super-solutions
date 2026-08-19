// Contentful implementation of the generic article publisher.

export interface ContentfulConfig {
  spaceId: string;
  environmentId: string;
  managementToken: string;
  contentTypeId: string;
  titleField: string;
  bodyField: string;
  sectionField?: string | null;
  headingField?: string | null;
  locale: string;
}

export interface Step {
  imageUrl: string;
  caption: string;
  order: number;
}

function baseUrl(cfg: ContentfulConfig) {
  return `https://api.contentful.com/spaces/${cfg.spaceId}/environments/${cfg.environmentId}`;
}

function cmaHeaders(cfg: ContentfulConfig) {
  return {
    Authorization: `Bearer ${cfg.managementToken}`,
    'Content-Type': 'application/vnd.contentful.management.v1+json',
  };
}

async function fail(res: Response, what: string): Promise<never> {
  const body = await res.text();
  throw new Error(`${what} failed [${res.status}]: ${body}`);
}

export async function testConnection(cfg: ContentfulConfig) {
  const res = await fetch(`${baseUrl(cfg)}/content_types/${cfg.contentTypeId}`, {
    headers: { Authorization: `Bearer ${cfg.managementToken}` },
  });
  if (!res.ok) {
    const body = await res.text();
    return { ok: false, message: `Contentful returned ${res.status}: ${body}` };
  }
  const ct = await res.json();
  const fieldIds: string[] = (ct.fields ?? []).map((f: { id: string }) => f.id);
  const missing = [cfg.titleField, cfg.bodyField, cfg.sectionField, cfg.headingField]
    .filter((f): f is string => Boolean(f))
    .filter((f) => !fieldIds.includes(f));
  if (missing.length) {
    return { ok: false, message: `Content type "${cfg.contentTypeId}" is missing field(s): ${missing.join(', ')}` };
  }
  return { ok: true, message: `Connected to ${cfg.spaceId}/${cfg.environmentId} (${cfg.contentTypeId})` };
}

async function createAsset(cfg: ContentfulConfig, imageUrl: string, title: string): Promise<string> {
  const headers = cmaHeaders(cfg);
  const createRes = await fetch(`${baseUrl(cfg)}/assets`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      fields: {
        title: { [cfg.locale]: title },
        file: {
          [cfg.locale]: {
            contentType: 'image/png',
            fileName: `${title.replace(/\s+/g, '-').toLowerCase()}.png`,
            upload: imageUrl,
          },
        },
      },
    }),
  });
  if (!createRes.ok) await fail(createRes, 'Asset creation');

  const asset = await createRes.json();
  const assetId = asset.sys.id;
  let version = asset.sys.version;

  const processRes = await fetch(`${baseUrl(cfg)}/assets/${assetId}/files/${cfg.locale}/process`, {
    method: 'PUT',
    headers: { ...headers, 'X-Contentful-Version': String(version) },
  });
  if (!processRes.ok) await fail(processRes, 'Asset processing');

  let processed = false;
  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 1500));
    const check = await fetch(`${baseUrl(cfg)}/assets/${assetId}`, { headers });
    const data = await check.json();
    if (data.fields?.file?.[cfg.locale]?.url) {
      version = data.sys.version;
      processed = true;
      break;
    }
  }
  if (!processed) throw new Error('Asset processing timed out');

  const pubRes = await fetch(`${baseUrl(cfg)}/assets/${assetId}/published`, {
    method: 'PUT',
    headers: { ...headers, 'X-Contentful-Version': String(version) },
  });
  if (!pubRes.ok) await fail(pubRes, 'Asset publish');

  return assetId;
}

function buildRichText(assetIds: string[], captions: string[]) {
  const content: unknown[] = [];
  assetIds.forEach((assetId, i) => {
    content.push({
      nodeType: 'embedded-asset-block',
      data: { target: { sys: { id: assetId, type: 'Link', linkType: 'Asset' } } },
      content: [],
    });
    const text = captions[i]?.trim() || `Step ${i + 1}: Describe what the user should do here.`;
    const marks = captions[i]?.trim() ? [] : [{ type: 'italic' }];
    content.push({
      nodeType: 'paragraph',
      data: {},
      content: [{ nodeType: 'text', value: text, marks, data: {} }],
    });
  });
  return { nodeType: 'document', data: {}, content };
}

export async function createArticle(
  cfg: ContentfulConfig,
  input: { title: string; section?: string; heading?: string; steps: Step[]; publishImmediately: boolean },
): Promise<{ entryId: string; published: boolean }> {
  const sorted = [...input.steps].sort((a, b) => a.order - b.order);

  const assetIds: string[] = [];
  for (let i = 0; i < sorted.length; i++) {
    assetIds.push(await createAsset(cfg, sorted[i].imageUrl, `${input.title} - Step ${i + 1}`));
  }

  const body = buildRichText(assetIds, sorted.map((s) => s.caption ?? ''));

  const fields: Record<string, unknown> = {
    [cfg.titleField]: { [cfg.locale]: input.title },
    [cfg.bodyField]: { [cfg.locale]: body },
  };
  if (cfg.sectionField && input.section) fields[cfg.sectionField] = { [cfg.locale]: input.section };
  if (cfg.headingField && input.heading) fields[cfg.headingField] = { [cfg.locale]: input.heading };

  const entryRes = await fetch(`${baseUrl(cfg)}/entries`, {
    method: 'POST',
    headers: { ...cmaHeaders(cfg), 'X-Contentful-Content-Type': cfg.contentTypeId },
    body: JSON.stringify({ fields }),
  });
  if (!entryRes.ok) await fail(entryRes, 'Entry creation');

  const entry = await entryRes.json();
  let published = false;

  if (input.publishImmediately) {
    const pubRes = await fetch(`${baseUrl(cfg)}/entries/${entry.sys.id}/published`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${cfg.managementToken}`,
        'X-Contentful-Version': String(entry.sys.version),
      },
    });
    published = pubRes.ok;
  }

  return { entryId: entry.sys.id, published };
}
