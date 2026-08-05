#!/usr/bin/env node
/**
 * Replaces the image on the "Customer Metrics" technologySection entry with a
 * 4:3 version so the site's aspect-[4/3] object-cover frame does not crop it.
 *
 * Usage: node scripts/replace-customer-metrics-image.mjs <path-to-png>
 */
import fs from 'node:fs';

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID || 'al01e4yh2wq4';
const ENVIRONMENT_ID = process.env.CONTENTFUL_ENVIRONMENT_ID || 'master';
const CMA_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const ENTRY_ID = process.env.ENTRY_ID || '1hpAIQMwW5azuN8JQWxrVu';

const IMAGE_PATH = process.argv[2];
if (!CMA_TOKEN || !IMAGE_PATH || !fs.existsSync(IMAGE_PATH)) {
  console.error('Usage: CONTENTFUL_MANAGEMENT_TOKEN=... node scripts/replace-customer-metrics-image.mjs <path-to-png>');
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

async function main() {
  console.log('Uploading padded image…');
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
        title: { 'en-US': 'Customer Traffic by Hour' },
        description: {
          'en-US':
            'Bar chart showing anonymized customer traffic levels by hour of the day at an Applestone machine.',
        },
        file: {
          'en-US': {
            contentType: 'image/png',
            fileName: 'customer-traffic-by-hour-4x3.png',
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
  console.log('  asset url:', processed.fields.file['en-US'].url);

  await cma(`${BASE}/assets/${assetId}/published`, {
    method: 'PUT',
    headers: { 'X-Contentful-Version': String(processed.sys.version) },
  });

  console.log('Repointing entry…');
  const entry = await cma(`${BASE}/entries/${ENTRY_ID}`);
  const oldAssetId = entry.fields?.sectionImage?.['en-US']?.sys?.id;
  entry.fields.sectionImage = { 'en-US': { sys: { type: 'Link', linkType: 'Asset', id: assetId } } };
  const updated = await cma(`${BASE}/entries/${ENTRY_ID}`, {
    method: 'PUT',
    headers: { 'X-Contentful-Version': String(entry.sys.version) },
    body: JSON.stringify({ fields: entry.fields }),
  });
  await cma(`${BASE}/entries/${ENTRY_ID}/published`, {
    method: 'PUT',
    headers: { 'X-Contentful-Version': String(updated.sys.version) },
  });
  console.log('  entry republished. previous asset:', oldAssetId);

  if (oldAssetId && oldAssetId !== assetId) {
    console.log('Unpublishing + deleting old asset…');
    await fetch(`${BASE}/assets/${oldAssetId}/published`, { method: 'DELETE', headers });
    await fetch(`${BASE}/assets/${oldAssetId}`, { method: 'DELETE', headers });
  }
  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
