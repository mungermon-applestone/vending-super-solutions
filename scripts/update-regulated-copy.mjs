#!/usr/bin/env node
/**
 * Scrub remaining vape / OTC / nicotine / cannabis mentions from published copy.
 * Each entry is updated then republished. Idempotent: reruns are no-ops.
 *
 * Usage: CONTENTFUL_MANAGEMENT_TOKEN=... node scripts/update-regulated-copy.mjs
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
const TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN || env.VITE_CONTENTFUL_MANAGEMENT_TOKEN;

if (!SPACE || !TOKEN) {
  console.error('Missing space id or management token.');
  process.exit(1);
}

const BASE = `https://api.contentful.com/spaces/${SPACE}/environments/${ENVIRONMENT}`;

async function api(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/vnd.contentful.management.v1+json',
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    throw new Error(`${options.method || 'GET'} ${path} -> ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

/** Replace exact strings anywhere in a nested value. */
function replaceDeep(value, pairs) {
  if (typeof value === 'string') {
    let next = value;
    for (const [from, to] of pairs) next = next.split(from).join(to);
    return next;
  }
  if (Array.isArray(value)) return value.map((v) => replaceDeep(v, pairs));
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = replaceDeep(v, pairs);
    return out;
  }
  return value;
}

const TASKS = [
  {
    id: '6LtA5vr8JVX8yo8uCmqLZ0',
    label: 'homePageContent: feature 1 description',
    fields: ['feature1Description'],
    pairs: [
      [
        'From grocery and fresh food to vape products and collectibles, you can sell a diverse array of products.',
        'From grocery and fresh food to cosmetics and collectibles, you can sell a diverse array of products.',
      ],
    ],
  },
  {
    id: '5YfQbcsaDZ1NUPbujXXOdn',
    label: 'productsPageContent: hero + purpose statement',
    fields: ['heroDescription', 'purposeStatementDescription'],
    pairs: [
      [
        'Our current clients are selling everyting from fresh meat to vape products to recycled golf balls.',
        'Our current clients are selling everything from fresh meat to cosmetics to recycled golf balls.',
      ],
      [
        'Sell virtually any product: perishable foods, cosmetics, toys, even items that require ID verification like OTC medicines and CBD.',
        'Sell virtually any product: perishable foods, cosmetics, toys, and high-value items that need secure, tracked dispensing.',
      ],
    ],
  },
  {
    id: '751TUGlWyMDSjpJ26gJLry',
    label: 'technologySection: Hardware Agnostic bullets',
    fields: ['bulletPoints'],
    pairs: [
      ['Vape Machines', 'Refrigerated Machines'],
      ['OTC Machines', 'Locker Systems'],
    ],
  },
  {
    id: '3tQIRzIcysQGBXnDXGoFYn',
    label: 'machine: Applestone High-Capacity Slim Machine',
    fields: ['description'],
    pairs: [
      [
        'pocket-sized packages like nicotine pouches or decks of collectible cards',
        'pocket-sized packages like small-format retail goods or decks of collectible cards',
      ],
    ],
  },
  {
    id: '2fNFJGgDstz7I86PZ3X6lu',
    label: 'blogPost: Note to Vending OEMs',
    fields: ['content'],
    pairs: [
      [
        'When a prospect needs age verification for cannabis vending, temperature monitoring for fresh food, or RFID integration for tool cribs,',
        'When a prospect needs temperature monitoring for fresh food or RFID integration for tool cribs,',
      ],
    ],
  },
];

let changedCount = 0;

for (const task of TASKS) {
  const entry = await api(`/entries/${task.id}`);
  let changed = false;

  for (const field of task.fields) {
    const value = entry.fields[field];
    if (value === undefined) continue;
    const next = replaceDeep(value, task.pairs);
    if (JSON.stringify(next) !== JSON.stringify(value)) {
      entry.fields[field] = next;
      changed = true;
    }
  }

  if (!changed) {
    console.log(`= ${task.label} — already up to date`);
    continue;
  }

  const updated = await api(`/entries/${task.id}`, {
    method: 'PUT',
    headers: { 'X-Contentful-Version': String(entry.sys.version) },
    body: JSON.stringify({ fields: entry.fields }),
  });
  await api(`/entries/${task.id}/published`, {
    method: 'PUT',
    headers: { 'X-Contentful-Version': String(updated.sys.version) },
  });
  changedCount += 1;
  console.log(`✓ ${task.label} — updated and republished`);
}

console.log(`\nDone. ${changedCount} entr${changedCount === 1 ? 'y' : 'ies'} changed.`);
