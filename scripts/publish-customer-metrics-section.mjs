#!/usr/bin/env node
/**
 * One-off publisher: uploads the Customer Traffic chart image to the Contentful
 * media library and creates + publishes a `technologySection` entry that uses it.
 *
 * Usage:
 *   CONTENTFUL_MANAGEMENT_TOKEN=cfpat-xxx node scripts/publish-customer-metrics-section.mjs <path-to-png>
 *
 * Space / environment are read from .env (VITE_CONTENTFUL_SPACE_ID, VITE_CONTENTFUL_ENVIRONMENT_ID).
 */
import fs from 'node:fs';
import path from 'node:path';

// ── config ──
function readEnvFile() {
  const env = {};
  const file = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(file)) return env;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
  return env;
}

const fileEnv = readEnvFile();
const SPACE_ID = process.env.CONTENTFUL_SPACE_ID || fileEnv.VITE_CONTENTFUL_SPACE_ID;
const ENVIRONMENT_ID =
  process.env.CONTENTFUL_ENVIRONMENT_ID || fileEnv.VITE_CONTENTFUL_ENVIRONMENT_ID || 'master';
const CMA_TOKEN =
  process.env.CONTENTFUL_MANAGEMENT_TOKEN || fileEnv.VITE_CONTENTFUL_MANAGEMENT_TOKEN;

if (!SPACE_ID || !CMA_TOKEN) {
  console.error('Missing CONTENTFUL space id or management token.');
  process.exit(1);
}

const IMAGE_PATH = process.argv[2];
if (!IMAGE_PATH || !fs.existsSync(IMAGE_PATH)) {
  console.error('Usage: node scripts/publish-customer-metrics-section.mjs <path-to-png>');
  process.exit(1);
}

const BASE = `https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT_ID}`;
const headers = {
  Authorization: `Bearer ${CMA_TOKEN}`,
  'Content-Type': 'application/vnd.contentful.management.v1+json',
};

async function cma(url, options = {}) {
  const res = await fetch(url, { ...options, headers: { ...headers, ...(options.headers || {}) } });
  if (!res.ok) throw new Error(`[${res.status}] ${url}\n${await res.text()}`);
  return res.json();
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── content ──
const ASSET_TITLE = 'Customer Traffic by Hour';
const ASSET_DESCRIPTION =
  'Bar chart showing anonymized customer traffic levels by hour of the day at an Applestone machine.';
const FILE_NAME = 'customer-traffic-by-hour.png';

const ENTRY_FIELDS = {
  title: 'Customer Metrics',
  summary:
    'Anonymized, on-device customer counts reveal when your machines are busiest — so you can stock, price, and staff around real demand.',
  bulletPoints: [
    'Hour-by-hour traffic patterns highlight true peak and off-peak demand',
    'Restock and route planning driven by measured foot traffic, not guesswork',
    'Counts are aggregate and anonymous — no personally identifiable information is collected or stored',
  ],
  displayOrder: 8,
};

async function main() {
  // 1. Upload the binary
  console.log('Uploading image…');
  const uploadRes = await fetch(`https://upload.contentful.com/spaces/${SPACE_ID}/uploads`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CMA_TOKEN}`,
      'Content-Type': 'application/octet-stream',
    },
    body: fs.readFileSync(IMAGE_PATH),
  });
  if (!uploadRes.ok) throw new Error(`Upload failed: ${await uploadRes.text()}`);
  const upload = await uploadRes.json();
  console.log('  upload id:', upload.sys.id);

  // 2. Create the asset from the upload
  console.log('Creating asset…');
  let asset = await cma(`${BASE}/assets`, {
    method: 'POST',
    body: JSON.stringify({
      fields: {
        title: { 'en-US': ASSET_TITLE },
        description: { 'en-US': ASSET_DESCRIPTION },
        file: {
          'en-US': {
            contentType: 'image/png',
            fileName: FILE_NAME,
            uploadFrom: { sys: { type: 'Link', linkType: 'Upload', id: upload.sys.id } },
          },
        },
      },
    }),
  });
  const assetId = asset.sys.id;

  // 3. Process
  console.log('Processing asset…');
  const processRes = await fetch(`${BASE}/assets/${assetId}/files/en-US/process`, {
    method: 'PUT',
    headers: { ...headers, 'X-Contentful-Version': String(asset.sys.version) },
  });
  if (!processRes.ok) throw new Error(`Processing failed: ${await processRes.text()}`);

  let processed = null;
  for (let i = 0; i < 20; i++) {
    await sleep(1500);
    const check = await cma(`${BASE}/assets/${assetId}`);
    if (check.fields?.file?.['en-US']?.url) {
      processed = check;
      break;
    }
  }
  if (!processed) throw new Error('Asset never finished processing.');
  console.log('  asset url:', processed.fields.file['en-US'].url);

  // 4. Publish the asset
  await cma(`${BASE}/assets/${assetId}/published`, {
    method: 'PUT',
    headers: { 'X-Contentful-Version': String(processed.sys.version) },
  });
  console.log('  asset published:', assetId);

  // 5. Create the technologySection entry
  console.log('Creating technologySection entry…');
  const entry = await cma(`${BASE}/entries`, {
    method: 'POST',
    headers: { 'X-Contentful-Content-Type': 'technologySection' },
    body: JSON.stringify({
      fields: {
        title: { 'en-US': ENTRY_FIELDS.title },
        summary: { 'en-US': ENTRY_FIELDS.summary },
        bulletPoints: { 'en-US': ENTRY_FIELDS.bulletPoints },
        sectionImage: { 'en-US': { sys: { type: 'Link', linkType: 'Asset', id: assetId } } },
        displayOrder: { 'en-US': ENTRY_FIELDS.displayOrder },
      },
    }),
  });

  // 6. Publish the entry
  await cma(`${BASE}/entries/${entry.sys.id}/published`, {
    method: 'PUT',
    headers: { 'X-Contentful-Version': String(entry.sys.version) },
  });
  console.log('  entry published:', entry.sys.id);
  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
