// Public, read-only Markdown view of published Contentful content for AI agents.
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

const SPACE = Deno.env.get('CONTENTFUL_SPACE_ID') ?? 'al01e4yh2wq4'
const ENV = Deno.env.get('CONTENTFUL_ENVIRONMENT_ID') ?? 'master'
// Delivery token is read-only and already public in the website bundle.
const TOKEN = Deno.env.get('CONTENTFUL_DELIVERY_TOKEN') ?? 'Z5nFDjjfz2n_GN2JLDBVVH6rr96986sa2TaFCL5zkcI'
const SITE = 'https://applestonesolutions.com'

const TYPES: Record<string, { label: string; path?: (slug: string) => string }> = {
  homePageContent: { label: 'Home page', path: () => '/' },
  productsPageContent: { label: 'Products page', path: () => '/products' },
  productType: { label: 'Product categories', path: (s) => `/products/${s}` },
  machine: { label: 'Machines', path: (s) => `/machines/${s}` },
  technologySection: { label: 'Technology page sections', path: () => '/technology' },
  technology: { label: 'Technologies', path: (s) => `/technology/${s}` },
  businessGoal: { label: 'Business goals', path: (s) => `/business-goals/${s}` },
  blogPost: { label: 'Blog posts', path: (s) => `/blog/${s}` },
  caseStudy: { label: 'Case studies', path: (s) => `/case-studies/${s}` },
  helpDeskArticle: { label: 'Help desk articles' },
  privacyPolicy: { label: 'About, privacy and terms' },
  testimonial: { label: 'Testimonials' },
}

const SKIP_FIELDS = new Set(['slug', 'key', 'pageKey', 'icon', 'displayOrder', 'order', 'showInFooter'])

type Includes = { entries: Map<string, any>; assets: Map<string, any> }

async function fetchType(ct: string) {
  const items: any[] = []
  const inc: Includes = { entries: new Map(), assets: new Map() }
  for (let skip = 0; ; skip += 200) {
    const url = `https://cdn.contentful.com/spaces/${SPACE}/environments/${ENV}/entries?content_type=${ct}&include=2&limit=200&skip=${skip}`
    const r = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } })
    if (!r.ok) break
    const j = await r.json()
    items.push(...j.items)
    for (const e of j.includes?.Entry ?? []) inc.entries.set(e.sys.id, e)
    for (const a of j.includes?.Asset ?? []) inc.assets.set(a.sys.id, a)
    for (const e of j.items) inc.entries.set(e.sys.id, e)
    if (skip + 200 >= j.total) break
  }
  return { items, inc }
}

const titleOf = (e: any) => e?.fields?.title ?? e?.fields?.name ?? e?.fields?.headline ?? e?.fields?.internalName ?? 'Untitled'
const assetMd = (a: any) => a?.fields?.file?.url ? `![${a.fields.description || a.fields.title || 'image'}](https:${a.fields.file.url})` : ''

function rich(node: any, inc: Includes): string {
  if (!node) return ''
  const kids = () => (node.content ?? []).map((n: any) => rich(n, inc)).join('')
  switch (node.nodeType) {
    case 'document': return kids()
    case 'paragraph': return `${kids()}\n\n`
    case 'heading-1': case 'heading-2': case 'heading-3': case 'heading-4': case 'heading-5': case 'heading-6':
      return `${'#'.repeat(Math.min(6, Number(node.nodeType.slice(-1)) + 2))} ${kids()}\n\n`
    case 'unordered-list': return (node.content ?? []).map((n: any) => `- ${rich(n, inc).trim()}\n`).join('') + '\n'
    case 'ordered-list': return (node.content ?? []).map((n: any, i: number) => `${i + 1}. ${rich(n, inc).trim()}\n`).join('') + '\n'
    case 'list-item': return kids().replace(/\n\n/g, ' ')
    case 'blockquote': return `> ${kids().trim()}\n\n`
    case 'hr': return '---\n\n'
    case 'hyperlink': return `[${kids()}](${node.data?.uri})`
    case 'embedded-asset-block': return `${assetMd(inc.assets.get(node.data?.target?.sys?.id))}\n\n`
    case 'embedded-entry-block': case 'embedded-entry-inline': case 'entry-hyperlink': {
      const e = inc.entries.get(node.data?.target?.sys?.id)
      return e ? `[${titleOf(e)}]` + (node.nodeType === 'embedded-entry-block' ? '\n\n' : '') : kids()
    }
    case 'text': return node.value ?? ''
    default: return kids()
  }
}

function value(v: any, inc: Includes, depth: number): string {
  if (v == null || v === '') return ''
  if (typeof v === 'string') return v
  if (typeof v === 'number' || typeof v === 'boolean') return String(v)
  if (v.nodeType === 'document') return rich(v, inc).trim()
  if (Array.isArray(v)) {
    const parts = v.map((x) => value(x, inc, depth)).filter(Boolean)
    return parts.map((p) => `- ${p.replace(/\n/g, '\n  ')}`).join('\n')
  }
  if (v.sys?.linkType === 'Asset') return assetMd(inc.assets.get(v.sys.id))
  if (v.sys?.linkType === 'Entry') {
    const e = inc.entries.get(v.sys.id)
    if (!e) return ''
    if (depth >= 1) return titleOf(e)
    const f = e.fields ?? {}
    const desc = value(f.description ?? f.text ?? '', inc, depth + 1)
    return `**${titleOf(e)}**${desc ? ': ' + desc.replace(/\n+/g, ' ') : ''}`
  }
  if (typeof v === 'object') return '```json\n' + JSON.stringify(v, null, 1) + '\n```'
  return ''
}

const label = (k: string) => k.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase())

function entryMd(e: any, ct: string, inc: Includes): string {
  const f = e.fields ?? {}
  const path = TYPES[ct]?.path?.(f.slug ?? '')
  let out = `## ${titleOf(e)}\n\n`
  if (path) out += `URL: ${SITE}${path}\n\n`
  for (const [k, v] of Object.entries(f)) {
    if (SKIP_FIELDS.has(k) || k === 'title' || k === 'name') continue
    const s = value(v, inc, 0)
    if (s) out += `### ${label(k)}\n\n${s}\n\n`
  }
  return out
}

function md(body: string, status = 200) {
  return new Response(body, {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'text/markdown; charset=utf-8', 'Cache-Control': 'public, max-age=600' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'GET') return md('Method not allowed', 405)
  const u = new URL(req.url)
  const self = `${u.origin}${u.pathname}`
  const type = u.searchParams.get('type')
  const slug = u.searchParams.get('slug')
  const all = u.searchParams.get('all')

  if (type && !TYPES[type]) return md(`Unknown type. Valid: ${Object.keys(TYPES).join(', ')}`, 400)
  if (slug && !/^[a-z0-9-_]{1,150}$/i.test(slug)) return md('Invalid slug', 400)

  try {
    if (type) {
      const { items, inc } = await fetchType(type)
      const list = slug ? items.filter((e) => e.fields?.slug === slug || e.sys.id === slug) : items
      if (!list.length) return md('Not found', 404)
      return md(`# ${TYPES[type].label}\n\n` + list.map((e) => entryMd(e, type, inc)).join('\n---\n\n'))
    }

    const results = await Promise.all(Object.keys(TYPES).map(async (ct) => [ct, await fetchType(ct)] as const))
    let out = `# Applestone Solutions — site content for AI agents\n\nApplestone Solutions provides smart vending machines, AI coolers, lockers and the software platform behind them, working with operators, retailers and vending OEMs. Website: ${SITE}\n\nThis document is generated live from the website's published content.\n\n`
    if (all) {
      for (const [ct, { items, inc }] of results) {
        if (!items.length) continue
        out += `# ${TYPES[ct].label}\n\n` + items.map((e) => entryMd(e, ct, inc)).join('\n---\n\n') + '\n'
      }
      return md(out)
    }
    out += `Full dump of everything: ${self}?all=1\n\n`
    for (const [ct, { items }] of results) {
      if (!items.length) continue
      out += `## ${TYPES[ct].label}\n\nAll: ${self}?type=${ct}\n\n`
      for (const e of items) {
        const id = e.fields?.slug ?? e.sys.id
        const p = TYPES[ct].path?.(e.fields?.slug ?? '')
        out += `- ${titleOf(e)} — ${self}?type=${ct}&slug=${encodeURIComponent(id)}${p ? ` (web page: ${SITE}${p})` : ''}\n`
      }
      out += '\n'
    }
    return md(out)
  } catch (err) {
    console.error(err)
    return md('Failed to load content', 500)
  }
})
