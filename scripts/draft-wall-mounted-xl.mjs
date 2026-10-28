#!/usr/bin/env node
/**
 * One-off publisher: uploads the "Cold + Ambient Smart Cabinet Combo" image to the
 * Contentful media library and creates + publishes the matching `machine` entry.
 *
 * Usage:
 *   CONTENTFUL_MANAGEMENT_TOKEN=cfpat-xxx node scripts/draft-wall-mounted-xl.mjs <path-to-jpg>
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
  console.error('Usage: node scripts/draft-wall-mounted-xl.mjs <path-to-jpg>');
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
const COMING_SOON = 'Information Coming Soon';
const FIELDS = {
  title: 'Touchscreen Wall-Mounted XL - 20 Coils',
  slug: 'touchscreen-wall-mounted-xl-20-coils',
  type: 'vending',
  temperature: 'ambient',
  description:
    'A wall-mounted smart vending machine with a large digital touchscreen display, card and NFC payments, and cash and coin payments, in a compact footprint with custom branding and finishes.',
  features: ['Large digital display', 'Touchscreen interface', 'Card and NFC payments', 'Cash and coin payments', 'Compact footprint', 'Custom branding and finishes'],
  dimensions: 'H 1,150 x W 650 x D 305 mm',
  weight: COMING_SOON,
  capacity: '20 coils (Option 2 XL)',
  powerRequirements: COMING_SOON,
  paymentOptions: 'Card, NFC, cash and coin',
  connectivity: COMING_SOON,
  manufacturer: COMING_SOON,
  warranty: COMING_SOON,
  visible: true,
  showOnHomepage: false,
};

async function main() {
  const up = await fetch(`https://upload.contentful.com/spaces/${SPACE_ID}/uploads`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${CMA_TOKEN}`, 'Content-Type': 'application/octet-stream' },
    body: fs.readFileSync(IMAGE_PATH),
  });
  if (!up.ok) throw new Error(await up.text());
  const upload = await up.json();
  const asset = await cma(`${BASE}/assets`, { method: 'POST', body: JSON.stringify({ fields: {
    title: { 'en-US': FIELDS.title },
    description: { 'en-US': 'Wall-mounted touchscreen smart vending machine, XL 20-coil model.' },
    file: { 'en-US': { contentType: 'image/jpeg', fileName: 'touchscreen-wall-mounted-xl.jpg',
      uploadFrom: { sys: { type: 'Link', linkType: 'Upload', id: upload.sys.id } } } },
  } }) });
  await cma(`${BASE}/assets/${asset.sys.id}/files/en-US/process`, { method: 'PUT', headers: { 'X-Contentful-Version': String(asset.sys.version) } }).catch(() => {});
  for (let i = 0; i < 20; i++) { await sleep(1500); const c = await cma(`${BASE}/assets/${asset.sys.id}`); if (c.fields?.file?.['en-US']?.url) break; }
  console.log('draft asset:', asset.sys.id);
  const entry = await cma(`${BASE}/entries`, { method: 'POST', headers: { 'X-Contentful-Content-Type': 'machine' },
    body: JSON.stringify({ fields: Object.fromEntries([
      ...Object.entries(FIELDS).map(([k, v]) => [k, { 'en-US': v }]),
      ['images', { 'en-US': [{ sys: { type: 'Link', linkType: 'Asset', id: asset.sys.id } }] }],
    ]) }) });
  const back = await cma(`${BASE}/entries/${entry.sys.id}`);
  console.log('draft entry:', back.sys.id, 'published:', !!back.sys.publishedVersion, back.fields.title['en-US']);
}
main().catch((e) => { console.error(e.message); process.exit(1); });
