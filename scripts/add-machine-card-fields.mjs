#!/usr/bin/env node
/**
 * Adds the "Customization Options" / "Software Compatibility" card fields to the
 * `machine` content type, seeds every machine entry with the current site copy,
 * and republishes entries that were already published (drafts stay drafts).
 *
 * Usage:
 *   node scripts/add-machine-card-fields.mjs
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

const NEW_FIELDS = [
  { id: 'customizationTitle', name: 'Customization Options Title', type: 'Symbol' },
  { id: 'customizationText', name: 'Customization Options Text', type: 'Text' },
  { id: 'softwareCompatibilityTitle', name: 'Software Compatibility Title', type: 'Symbol' },
  { id: 'softwareCompatibilityText', name: 'Software Compatibility Text', type: 'Text' },
].map((f) => ({ ...f, required: false, localized: false }));

const DEFAULTS = {
  customizationTitle: 'Customization Options',
  customizationText:
    'This machine can be customized with your branding, planogram, and digital signage.',
  softwareCompatibilityTitle: 'Software Compatibility',
  softwareCompatibilityText:
    'Fully compatible with our vending management software, providing real-time inventory tracking, sales analytics, and remote management.',
};

async function updateContentType() {
  const ct = await cma(`${BASE}/content_types/machine`);
  const existing = new Set(ct.fields.map((f) => f.id));
  const missing = NEW_FIELDS.filter((f) => !existing.has(f.id));

  if (missing.length === 0) {
    console.log('Content type already has all four fields.');
    return;
  }

  console.log('Adding fields:', missing.map((f) => f.id).join(', '));
  const updated = await cma(`${BASE}/content_types/machine`, {
    method: 'PUT',
    headers: { 'X-Contentful-Version': String(ct.sys.version) },
    body: JSON.stringify({
      name: ct.name,
      description: ct.description,
      displayField: ct.displayField,
      fields: [...ct.fields, ...missing],
    }),
  });

  await cma(`${BASE}/content_types/machine/published`, {
    method: 'PUT',
    headers: { 'X-Contentful-Version': String(updated.sys.version) },
  });
  console.log('Content type published.');
  await sleep(3000);
}

async function seedEntries() {
  let skip = 0;
  const all = [];
  while (true) {
    const page = await cma(`${BASE}/entries?content_type=machine&limit=100&skip=${skip}`);
    all.push(...page.items);
    skip += page.items.length;
    if (skip >= page.total || page.items.length === 0) break;
  }
  console.log(`Found ${all.length} machine entries.`);

  for (const entry of all) {
    const title = entry.fields?.title?.['en-US'] || entry.sys.id;
    const wasPublished =
      !!entry.sys.publishedVersion && entry.sys.version === entry.sys.publishedVersion + 1;

    const fields = { ...entry.fields };
    let changed = false;
    for (const [key, value] of Object.entries(DEFAULTS)) {
      if (!fields[key]?.['en-US']) {
        fields[key] = { 'en-US': value };
        changed = true;
      }
    }

    if (!changed) {
      console.log(`- ${title}: already has card copy, skipped`);
      continue;
    }

    const saved = await cma(`${BASE}/entries/${entry.sys.id}`, {
      method: 'PUT',
      headers: { 'X-Contentful-Version': String(entry.sys.version) },
      body: JSON.stringify({ fields }),
    });

    if (wasPublished) {
      await cma(`${BASE}/entries/${entry.sys.id}/published`, {
        method: 'PUT',
        headers: { 'X-Contentful-Version': String(saved.sys.version) },
      });
      console.log(`- ${title}: updated + republished`);
    } else {
      console.log(`- ${title}: updated (left as draft)`);
    }
  }
}

async function main() {
  await updateContentType();
  await seedEntries();
  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
