// Runs before `vite build` (prebuild); writes public/sitemap.xml from published Contentful entries.
// If Contentful can't be reached, the existing sitemap is left untouched.
import { writeFileSync } from 'fs'
import { resolve } from 'path'

const BASE_URL = 'https://applestonesolutions.com'
const SPACE = 'al01e4yh2wq4'
const ENV = 'master'
const TOKEN = 'Z5nFDjjfz2n_GN2JLDBVVH6rr96986sa2TaFCL5zkcI' // public read-only delivery token

const STATIC = [
  ['/', '1.0'], ['/products', '0.9'], ['/machines', '0.9'], ['/technology', '0.8'],
  ['/business-goals', '0.8'], ['/blog', '0.7'], ['/about', '0.6'], ['/contact', '0.7'],
  ['/privacy', '0.3'], ['/terms', '0.3'],
]
const DYNAMIC = [
  ['productType', (s) => `/products/${s}`, '0.8'],
  ['machine', (s) => `/machines/${s}`, '0.8'],
  ['technology', (s) => `/technology/${s}`, '0.6'],
  ['businessGoal', (s) => `/business-goals/${s}`, '0.6'],
  ['blogPost', (s) => `/blog/${s}`, '0.6'],
]

async function fetchAll(ct) {
  const out = []
  for (let skip = 0; ; skip += 200) {
    const r = await fetch(`https://cdn.contentful.com/spaces/${SPACE}/environments/${ENV}/entries?content_type=${ct}&select=fields.slug,sys.updatedAt&limit=200&skip=${skip}`, { headers: { Authorization: `Bearer ${TOKEN}` } })
    if (r.status === 400) return out // content type not in this space
    if (!r.ok) throw new Error(`${ct}: ${r.status}`)
    const j = await r.json()
    out.push(...j.items)
    if (skip + 200 >= j.total) return out
  }
}

try {
  const entries = STATIC.map(([path, priority]) => ({ path, priority }))
  for (const [ct, toPath, priority] of DYNAMIC) {
    for (const e of await fetchAll(ct)) {
      if (!e.fields?.slug) continue
      entries.push({ path: toPath(e.fields.slug), priority, lastmod: e.sys.updatedAt?.slice(0, 10) })
    }
  }
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map((e) => `  <url>\n    <loc>${BASE_URL}${e.path}</loc>${e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ''}\n    <priority>${e.priority}</priority>\n  </url>`),
    '</urlset>', '',
  ].join('\n')
  writeFileSync(resolve('public/sitemap.xml'), xml)
  console.log(`sitemap.xml written (${entries.length} entries)`)
} catch (err) {
  console.warn('[sitemap] Skipped, keeping existing file:', err.message)
}
