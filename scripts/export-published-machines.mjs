#!/usr/bin/env node
/**
 * Export all published "machine" entries from Contentful.
 *
 * Uses the Content Delivery API (CDA), which only returns published entries.
 * Reads credentials from .env (VITE_CONTENTFUL_SPACE_ID,
 * VITE_CONTENTFUL_ENVIRONMENT_ID, VITE_CONTENTFUL_DELIVERY_TOKEN).
 *
 * Usage:
 *   node scripts/export-published-machines.mjs
 *   CONTENTFUL_ENVIRONMENT_ID=staging node scripts/export-published-machines.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// --- Load .env (simple parser; no dep) ---
function loadEnv() {
  const p = resolve(ROOT, '.env');
  if (!existsSync(p)) return;
  for (const raw of readFileSync(p, 'utf8').split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
}
loadEnv();

const SPACE = process.env.CONTENTFUL_SPACE_ID || process.env.VITE_CONTENTFUL_SPACE_ID;
const ENV = process.env.CONTENTFUL_ENVIRONMENT_ID || process.env.VITE_CONTENTFUL_ENVIRONMENT_ID || 'master';
const TOKEN = process.env.CONTENTFUL_DELIVERY_TOKEN || process.env.VITE_CONTENTFUL_DELIVERY_TOKEN;
const CONTENT_TYPE = 'machine';

if (!SPACE || !TOKEN) {
  console.error('Missing VITE_CONTENTFUL_SPACE_ID or VITE_CONTENTFUL_DELIVERY_TOKEN in .env');
  process.exit(1);
}

const BASE = `https://cdn.contentful.com/spaces/${SPACE}/environments/${ENV}/entries`;

async function fetchPage(skip) {
  const url = `${BASE}?content_type=${CONTENT_TYPE}&limit=100&skip=${skip}&include=2`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
  if (!res.ok) {
    throw new Error(`Contentful ${res.status} ${res.statusText}: ${await res.text()}`);
  }
  return res.json();
}

// Build lookup maps for included Assets/Entries and resolve Link fields (2 levels).
function buildResolver(includes) {
  const assets = new Map((includes?.Asset || []).map((a) => [a.sys.id, a]));
  const entries = new Map((includes?.Entry || []).map((e) => [e.sys.id, e]));
  const seen = new WeakSet();

  function resolveValue(v) {
    if (v == null) return v;
    if (Array.isArray(v)) return v.map(resolveValue);
    if (typeof v === 'object') {
      if (v.sys?.type === 'Link') {
        const target = v.sys.linkType === 'Asset' ? assets.get(v.sys.id) : entries.get(v.sys.id);
        return target ? resolveEntry(target) : v;
      }
      if (seen.has(v)) return v;
      seen.add(v);
      const out = {};
      for (const [k, val] of Object.entries(v)) out[k] = resolveValue(val);
      return out;
    }
    return v;
  }

  function resolveEntry(entry) {
    return {
      sys: {
        id: entry.sys.id,
        type: entry.sys.type,
        contentType: entry.sys.contentType?.sys?.id,
        createdAt: entry.sys.createdAt,
        updatedAt: entry.sys.updatedAt,
        publishedAt: entry.sys.publishedAt,
        locale: entry.sys.locale,
      },
      fields: resolveValue(entry.fields),
    };
  }

  return resolveEntry;
}

function toCsv(rows) {
  const cols = ['id', 'title', 'slug', 'type', 'temperature', 'visible', 'displayOrder', 'showOnHomepage', 'updatedAt', 'publishedAt'];
  const esc = (v) => {
    if (v == null) return '';
    const s = String(v).replace(/"/g, '""');
    return /[",\n]/.test(s) ? `"${s}"` : s;
  };
  const lines = [cols.join(',')];
  for (const r of rows) lines.push(cols.map((c) => esc(r[c])).join(','));
  return lines.join('\n');
}

(async () => {
  console.log(`Exporting published "${CONTENT_TYPE}" entries from space=${SPACE} env=${ENV}`);
  let skip = 0;
  let total = Infinity;
  const items = [];
  while (skip < total) {
    const page = await fetchPage(skip);
    total = page.total;
    const resolve = buildResolver(page.includes);
    for (const entry of page.items) items.push(resolve(entry));
    skip += page.items.length;
    console.log(`  fetched ${items.length}/${total}`);
    if (page.items.length === 0) break;
  }

  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const outDir = resolve(ROOT, 'exports');
  mkdirSync(outDir, { recursive: true });

  const jsonPath = resolve(outDir, `machines-published-${ts}.json`);
  writeFileSync(jsonPath, JSON.stringify({
    exportedAt: new Date().toISOString(),
    space: SPACE,
    environment: ENV,
    contentType: CONTENT_TYPE,
    count: items.length,
    items,
  }, null, 2));

  const csvRows = items.map((e) => ({
    id: e.sys.id,
    title: e.fields?.title,
    slug: e.fields?.slug,
    type: e.fields?.type,
    temperature: e.fields?.temperature,
    visible: e.fields?.visible,
    displayOrder: e.fields?.displayOrder,
    showOnHomepage: e.fields?.showOnHomepage,
    updatedAt: e.sys.updatedAt,
    publishedAt: e.sys.publishedAt,
  }));
  const csvPath = resolve(outDir, `machines-published-${ts}.csv`);
  writeFileSync(csvPath, toCsv(csvRows));

  console.log(`\n✓ Exported ${items.length} published machine entries`);
  console.log(`  ${jsonPath}`);
  console.log(`  ${csvPath}`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
