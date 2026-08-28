#!/usr/bin/env node
/**
 * One-off publisher: uploads the NAMA logo to the Contentful media library and
 * appends the NAMA membership block (logo + sentence) to the About page entry
 * (`privacyPolicy` -> `aboutUsMainText` rich text), then republishes it.
 *
 * Usage:
 *   CONTENTFUL_MANAGEMENT_TOKEN=cfpat-xxx node scripts/publish-nama-membership.mjs [path-to-jpg]
 *
 * If no local file is given, the logo is downloaded from the live site.
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
const SPACE_ID =
  process.env.CONTENTFUL_SPACE_ID || process.env.VITE_CONTENTFUL_SPACE_ID || fileEnv.VITE_CONTENTFUL_SPACE_ID;
const ENVIRONMENT_ID =
  process.env.CONTENTFUL_ENVIRONMENT_ID ||
  process.env.VITE_CONTENTFUL_ENVIRONMENT_ID ||
  fileEnv.VITE_CONTENTFUL_ENVIRONMENT_ID ||
  'master';
const CMA_TOKEN =
  process.env.CONTENTFUL_MANAGEMENT_TOKEN ||
  process.env.VITE_CONTENTFUL_MANAGEMENT_TOKEN ||
  fileEnv.VITE_CONTENTFUL_MANAGEMENT_TOKEN;

if (!SPACE_ID || !CMA_TOKEN) {
  console.error('Missing CONTENTFUL space id or management token.');
  process.exit(1);
}

const BASE = `https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT_ID}`;
const headers = {
  Authorization: `Bearer ${CMA_TOKEN}`,
  'Content-Type': 'application/vnd.contentful.management.v1+json',
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function cma(url, options = {}) {
  const res = await fetch(url, { ...options, headers: { ...headers, ...(options.headers || {}) } });
  if (!res.ok) throw new Error(`[${res.status}] ${url}\n${await res.text()}`);
  return res.json();
}

const ASSET_TITLE = 'NAMA Logo';
const ASSET_DESCRIPTION = 'NAMA — National Automatic Merchandising Association';
const FILE_NAME = 'nama-logo.jpg';
const REMOTE_LOGO =
  'https://applestonesolutions.com/__l5e/assets-v1/6481ad92-bc28-4b47-9b22-e8a979f400d1/nama-logo.jpg';
const MEMBERSHIP_TEXT =
  'Applestone Solutions is a proud member of National Automatic Merchandising Association.';

async function loadImageBytes() {
  const local = process.argv[2];
  if (local) {
    if (!fs.existsSync(local)) throw new Error(`File not found: ${local}`);
    return fs.readFileSync(local);
  }
  const res = await fetch(REMOTE_LOGO);
  if (!res.ok) throw new Error(`Could not download logo [${res.status}]`);
  return Buffer.from(await res.arrayBuffer());
}

async function findExistingAsset() {
  const found = await cma(`${BASE}/assets?fields.title=${encodeURIComponent(ASSET_TITLE)}&limit=1`);
  return found.items?.[0] || null;
}

async function uploadAsset(bytes) {
  console.log('Uploading logo…');
  const uploadRes = await fetch(`https://upload.contentful.com/spaces/${SPACE_ID}/uploads`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${CMA_TOKEN}`, 'Content-Type': 'application/octet-stream' },
    body: bytes,
  });
  if (!uploadRes.ok) throw new Error(`Upload failed: ${await uploadRes.text()}`);
  const upload = await uploadRes.json();

  const asset = await cma(`${BASE}/assets`, {
    method: 'POST',
    body: JSON.stringify({
      fields: {
        title: { 'en-US': ASSET_TITLE },
        description: { 'en-US': ASSET_DESCRIPTION },
        file: {
          'en-US': {
            contentType: 'image/jpeg',
            fileName: FILE_NAME,
            uploadFrom: { sys: { type: 'Link', linkType: 'Upload', id: upload.sys.id } },
          },
        },
      },
    }),
  });

  const assetId = asset.sys.id;
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

  await cma(`${BASE}/assets/${assetId}/published`, {
    method: 'PUT',
    headers: { 'X-Contentful-Version': String(processed.sys.version) },
  });
  console.log('  asset published:', assetId, processed.fields.file['en-US'].url);
  return assetId;
}

function membershipNodes(assetId) {
  return [
    {
      nodeType: 'embedded-asset-block',
      data: { target: { sys: { type: 'Link', linkType: 'Asset', id: assetId } } },
      content: [],
    },
    {
      nodeType: 'paragraph',
      data: {},
      content: [{ nodeType: 'text', value: MEMBERSHIP_TEXT, marks: [], data: {} }],
    },
  ];
}

function alreadyPresent(doc) {
  return JSON.stringify(doc || {}).includes('proud member of National Automatic Merchandising');
}

async function main() {
  let assetId;
  const existing = await findExistingAsset();
  if (existing) {
    assetId = existing.sys.id;
    console.log('Reusing existing asset:', assetId);
    if (!existing.sys.publishedVersion) {
      await cma(`${BASE}/assets/${assetId}/published`, {
        method: 'PUT',
        headers: { 'X-Contentful-Version': String(existing.sys.version) },
      });
      console.log('  published existing asset');
    }
  } else {
    assetId = await uploadAsset(await loadImageBytes());
  }

  const entries = await cma(`${BASE}/entries?content_type=privacyPolicy&limit=1`);
  const entry = entries.items?.[0];
  if (!entry) throw new Error('No privacyPolicy (About) entry found.');
  console.log('About entry:', entry.sys.id);

  const doc = entry.fields.aboutUsMainText?.['en-US'];
  if (!doc || doc.nodeType !== 'document') throw new Error('aboutUsMainText is not a rich text document.');

  if (alreadyPresent(doc)) {
    console.log('Membership block already present — skipping content update.');
  } else {
    doc.content = [...doc.content, ...membershipNodes(assetId)];
    const updated = await cma(`${BASE}/entries/${entry.sys.id}`, {
      method: 'PUT',
      headers: { 'X-Contentful-Version': String(entry.sys.version) },
      body: JSON.stringify({ fields: { ...entry.fields, aboutUsMainText: { 'en-US': doc } } }),
    });
    await cma(`${BASE}/entries/${entry.sys.id}/published`, {
      method: 'PUT',
      headers: { 'X-Contentful-Version': String(updated.sys.version) },
    });
    console.log('  About entry updated and published.');
  }

  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
