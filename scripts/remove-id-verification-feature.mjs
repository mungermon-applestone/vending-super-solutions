/**
 * Removes the "ID Verification" feature card from Contentful.
 *
 * - Unlinks feature entry 36wqE5SLXLvMVeLClWxfU1 from every entry that references it
 * - Republishes those entries
 * - Unpublishes and deletes the feature entry itself
 *
 * Usage:
 *   CONTENTFUL_MANAGEMENT_TOKEN=cfpat-xxx node scripts/remove-id-verification-feature.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

function readEnvFile() {
  const env = {};
  const file = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(file)) return env;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const i = line.indexOf('=');
    if (i === -1 || line.trim().startsWith('#')) continue;
    env[line.slice(0, i).trim()] = line
      .slice(i + 1)
      .trim()
      .replace(/^["']|["']$/g, '');
  }
  return env;
}

const fileEnv = readEnvFile();
const SPACE_ID = process.env.CONTENTFUL_SPACE_ID || fileEnv.VITE_CONTENTFUL_SPACE_ID;
const ENVIRONMENT_ID =
  process.env.CONTENTFUL_ENVIRONMENT_ID || fileEnv.VITE_CONTENTFUL_ENVIRONMENT_ID || 'master';
const CMA_TOKEN =
  process.env.CONTENTFUL_MANAGEMENT_TOKEN || fileEnv.VITE_CONTENTFUL_MANAGEMENT_TOKEN;

const FEATURE_ID = process.env.FEATURE_ENTRY_ID || '36wqE5SLXLvMVeLClWxfU1';

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
  if (res.status === 204) return null;
  return res.json();
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function stripLinks(value) {
  if (Array.isArray(value)) {
    const next = value.filter(
      (item) => !(item?.sys?.type === 'Link' && item.sys.linkType === 'Entry' && item.sys.id === FEATURE_ID),
    );
    return { changed: next.length !== value.length, value: next };
  }
  if (value?.sys?.type === 'Link' && value.sys.linkType === 'Entry' && value.sys.id === FEATURE_ID) {
    return { changed: true, value: undefined };
  }
  return { changed: false, value };
}

async function main() {
  const refs = await cma(`${BASE}/entries?links_to_entry=${FEATURE_ID}&limit=100`);
  console.log(`Found ${refs.total} entries referencing ${FEATURE_ID}`);

  for (const entry of refs.items) {
    let changed = false;
    for (const [fieldId, locales] of Object.entries(entry.fields || {})) {
      for (const [locale, value] of Object.entries(locales || {})) {
        const result = stripLinks(value);
        if (!result.changed) continue;
        changed = true;
        if (result.value === undefined) delete entry.fields[fieldId][locale];
        else entry.fields[fieldId][locale] = result.value;
      }
    }
    if (!changed) continue;

    const updated = await cma(`${BASE}/entries/${entry.sys.id}`, {
      method: 'PUT',
      headers: { 'X-Contentful-Version': String(entry.sys.version) },
      body: JSON.stringify({ fields: entry.fields }),
    });
    console.log(`  Updated ${entry.sys.id}`);

    const wasPublished = Boolean(entry.sys.publishedVersion);
    if (wasPublished) {
      await cma(`${BASE}/entries/${updated.sys.id}/published`, {
        method: 'PUT',
        headers: { 'X-Contentful-Version': String(updated.sys.version) },
      });
      console.log(`  Republished ${entry.sys.id}`);
    } else {
      console.log(`  Left ${entry.sys.id} as draft (was not published)`);
    }
    await sleep(300);
  }

  const feature = await cma(`${BASE}/entries/${FEATURE_ID}`);
  if (feature.sys.publishedVersion) {
    await cma(`${BASE}/entries/${FEATURE_ID}/published`, { method: 'DELETE' });
    console.log('Unpublished feature entry');
    await sleep(300);
  }
  await cma(`${BASE}/entries/${FEATURE_ID}`, { method: 'DELETE' });
  console.log('Deleted feature entry');
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
