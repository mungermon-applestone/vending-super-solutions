#!/usr/bin/env node
/**
 * One-off publisher: uploads the "Cold + Ambient Smart Cabinet Combo" image to the
 * Contentful media library and creates + publishes the matching `machine` entry.
 *
 * Usage:
 *   CONTENTFUL_MANAGEMENT_TOKEN=cfpat-xxx node scripts/publish-cold-ambient-combo.mjs <path-to-png>
 */
import fs from 'node:fs';
import path from 'node:path';

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
  console.error('Usage: node scripts/publish-cold-ambient-combo.mjs <path-to-png>');
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

// Existing single-cabinet asset already in the media library
const EXISTING_FRIDGE_ASSET_ID = '1LNMTtD43VYDlQ4Af6HW5k';

const ASSET_TITLE = 'Cold + Ambient Smart Cabinet Combo';
const ASSET_DESCRIPTION =
  'Two AI-vision smart cabinets side by side: a chilled or frozen cabinet for fresh food and an ambient cabinet for snacks and pantry items.';
const FILE_NAME = 'cold-ambient-cabinet-combo.png';

const COMING_SOON = 'Information Coming Soon';

const FIELDS = {
  title: 'Cold + Ambient Smart Cabinet Combo',
  slug: 'cold-ambient-smart-cabinet-combo',
  type: 'vending',
  temperature: 'multi',
  description:
    'Two AI-vision cabinets, side by side: one refrigerated or frozen for fresh meals, proteins, and dairy, one ambient for snacks and pantry staples. Customers tap once, open, take what they want, and walk — the cabinets settle the basket automatically. Where a single split-climate box forces you to trade cold capacity against dry capacity, the combo gives you both at full depth, backed by Applestone\u2019s perishable-food operating experience.',
  features: [
    'Dedicated refrigerated or frozen cabinet — no shared-airflow compromise',
    'Full-depth ambient cabinet for snacks, pantry, and non-food',
    'AI computer-vision checkout: tap, open, grab, go',
    'Continuous temperature logging and out-of-range alerts',
    'Real-time inventory and planogram data per cabinet',
    'Built for perishables: date rotation, shrink tracking, HACCP-friendly records',
    'Independent service — one cabinet down never closes the market',
    'Scales from a single pair to a full unattended market footprint',
    'Cashless, contactless, and mobile-wallet payment',
    'Optional branded wrap and on-screen merchandising',
  ],
  dimensions: COMING_SOON,
  weight: COMING_SOON,
  capacity: COMING_SOON,
  powerRequirements: COMING_SOON,
  paymentOptions: COMING_SOON,
  connectivity: COMING_SOON,
  manufacturer: COMING_SOON,
  warranty: COMING_SOON,
  visible: true,
  displayOrder: 10,
  showOnHomepage: false,
};

async function main() {
  console.log('Uploading image…');
  const uploadRes = await fetch(`https://upload.contentful.com/spaces/${SPACE_ID}/uploads`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${CMA_TOKEN}`, 'Content-Type': 'application/octet-stream' },
    body: fs.readFileSync(IMAGE_PATH),
  });
  if (!uploadRes.ok) throw new Error(`Upload failed: ${await uploadRes.text()}`);
  const upload = await uploadRes.json();

  console.log('Creating asset…');
  const asset = await cma(`${BASE}/assets`, {
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

  await cma(`${BASE}/assets/${assetId}/published`, {
    method: 'PUT',
    headers: { 'X-Contentful-Version': String(processed.sys.version) },
  });
  console.log('  asset published:', assetId);

  console.log('Creating machine entry…');
  const link = (id) => ({ sys: { type: 'Link', linkType: 'Asset', id } });
  const entry = await cma(`${BASE}/entries`, {
    method: 'POST',
    headers: { 'X-Contentful-Content-Type': 'machine' },
    body: JSON.stringify({
      fields: Object.fromEntries([
        ...Object.entries(FIELDS).map(([k, v]) => [k, { 'en-US': v }]),
        ['images', { 'en-US': [link(assetId), link(EXISTING_FRIDGE_ASSET_ID)] }],
      ]),
    }),
  });

  await cma(`${BASE}/entries/${entry.sys.id}/published`, {
    method: 'PUT',
    headers: { 'X-Contentful-Version': String(entry.sys.version) },
  });
  console.log('  entry published:', entry.sys.id);
  console.log(`\nDone. View at /machines/${FIELDS.slug}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
