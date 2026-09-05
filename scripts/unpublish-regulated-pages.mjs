#!/usr/bin/env node
/**
 * Unpublish (but never delete or archive) the regulated-product pages:
 * OTC/Pharma, Cannabis, Nicotine Pouches, Vape, and the related nicotine blog posts.
 *
 * Usage: CONTENTFUL_MANAGEMENT_TOKEN=... node scripts/unpublish-regulated-pages.mjs
 */
import fs from 'node:fs';

function loadEnv() {
  const out = {};
  try {
    for (const line of fs.readFileSync('.env', 'utf8').split('\n')) {
      const i = line.indexOf('=');
      if (i === -1 || line.trim().startsWith('#')) continue;
      out[line.slice(0, i).trim()] = line
        .slice(i + 1)
        .trim()
        .replace(/^["']|["']$/g, '');
    }
  } catch {
    /* no .env */
  }
  return out;
}

const env = loadEnv();
const SPACE = process.env.VITE_CONTENTFUL_SPACE_ID || env.VITE_CONTENTFUL_SPACE_ID;
const ENVIRONMENT =
  process.env.VITE_CONTENTFUL_ENVIRONMENT_ID || env.VITE_CONTENTFUL_ENVIRONMENT_ID || 'master';
const TOKEN =
  process.env.CONTENTFUL_MANAGEMENT_TOKEN || env.VITE_CONTENTFUL_MANAGEMENT_TOKEN;

if (!SPACE || !TOKEN) {
  console.error('Missing space id or management token.');
  process.exit(1);
}

const ENTRIES = [
  { id: '6yAnjbhnS6GURjdMYxmLOd', label: 'productType: OTC / Pharma Vending' },
  { id: '7GzLx6QF465sZFW1KlaHb8', label: 'productType: Cannabis Vending' },
  { id: '6Ee2GR0owduHh2L6mt150l', label: 'productType: Nicotine Pouches' },
  { id: '558jTJSXkkSDMexavWCx2L', label: 'productType: Nicotine Pouches and Vape' },
  { id: '5w3Q1F59agbT2qiqAs3rXS', label: 'blogPost: Shenzhen Zhilai collaborates (nicotine)' },
  { id: '7yQwCmUgSM7i0fWlPwJbQV', label: 'blogPost: Zhilai partnership announcement' },
  { id: '4oi4Aw6C8M8JO8X4ijlrvp', label: 'heroContent: New: Nicotine Pouch Solution' },
];

const base = `https://api.contentful.com/spaces/${SPACE}/environments/${ENVIRONMENT}`;
const headers = { Authorization: `Bearer ${TOKEN}` };

async function main() {
  for (const { id, label } of ENTRIES) {
    const res = await fetch(`${base}/entries/${id}`, { headers });
    if (!res.ok) {
      console.error(`  !! ${label} (${id}) fetch failed: ${res.status} ${await res.text()}`);
      continue;
    }
    const entry = await res.json();
    const published = Boolean(entry.sys.publishedVersion);
    if (!published) {
      console.log(`  -- ${label} (${id}) already unpublished`);
      continue;
    }
    const del = await fetch(`${base}/entries/${id}/published`, {
      method: 'DELETE',
      headers: { ...headers, 'X-Contentful-Version': String(entry.sys.version) },
    });
    if (!del.ok) {
      console.error(`  !! ${label} (${id}) unpublish failed: ${del.status} ${await del.text()}`);
      continue;
    }
    console.log(`  OK ${label} (${id}) unpublished (kept as draft)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
