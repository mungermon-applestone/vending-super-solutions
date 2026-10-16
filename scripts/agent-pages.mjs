// Build-time step (Vite plugin): makes the published site readable by AI agents without JavaScript.
// - writes dist/sitemap.xml (+ public/sitemap.xml) from published Contentful entries
// - writes dist/llms-full.txt (full Markdown snapshot of the site-content feed)
// - writes dist/<route>/index.html copies of the app shell with that page's real text, title,
//   description, canonical and a link to its Markdown version. React replaces the text on load.
// Any network failure skips the step and leaves the normal build intact.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'

const SITE = 'https://applestonesolutions.com'
const FEED = 'https://rwvlvooojegpebognnzn.supabase.co/functions/v1/site-content'
const SPACE = 'al01e4yh2wq4'
const ENV = 'master'
const TOKEN = 'Z5nFDjjfz2n_GN2JLDBVVH6rr96986sa2TaFCL5zkcI' // public read-only delivery token

// Content type -> web path, sitemap priority
const DYNAMIC = {
  productType: [(s) => `/products/${s}`, '0.8'],
  machine: [(s) => `/machines/${s}`, '0.8'],
  businessGoal: [(s) => `/business-goals/${s}`, '0.6'],
  blogPost: [(s) => `/blog/${s}`, '0.6'],
}
// Static route -> [title, feed type (or null), list type for link lists, priority]
const STATIC = {
  '/': ['Applestone Solutions — Smart Vending Machines, AI Coolers & Software', 'homePageContent', null, '1.0'],
  '/products': ['Products and Use Cases | Applestone Solutions', 'productsPageContent', 'productType', '0.9'],
  '/machines': ['Smart Vending Machines | Applestone Solutions', null, 'machine', '0.9'],
  '/technology': ['Technology and Software | Applestone Solutions', 'technologySection', null, '0.8'],
  '/business-goals': ['Business Goals | Applestone Solutions', null, 'businessGoal', '0.8'],
  '/blog': ['Blog | Applestone Solutions', null, 'blogPost', '0.7'],
  '/about': ['About Us | Applestone Solutions', 'privacyPolicy', null, '0.6'],
  '/contact': ['Contact Us | Applestone Solutions', null, null, '0.7'],
  '/privacy': ['Privacy Policy | Applestone Solutions', null, null, '0.3'],
  '/terms': ['Terms of Service | Applestone Solutions', null, null, '0.3'],
}

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

async function getText(url) {
  const r = await fetch(url)
  if (!r.ok) throw new Error(`${url}: ${r.status}`)
  return r.text()
}

async function entries(ct) {
  const out = []
  for (let skip = 0; ; skip += 200) {
    const r = await fetch(`https://cdn.contentful.com/spaces/${SPACE}/environments/${ENV}/entries?content_type=${ct}&limit=200&skip=${skip}`, { headers: { Authorization: `Bearer ${TOKEN}` } })
    if (r.status === 400) return out
    if (!r.ok) throw new Error(`${ct}: ${r.status}`)
    const j = await r.json()
    out.push(...j.items)
    if (skip + 200 >= j.total) return out
  }
}

// Minimal Markdown -> HTML for the feed's output (headings, lists, images, links, paragraphs).
function inline(s) {
  return esc(s)
    .replace(/!\[([^\]]*)\]\((https?:[^)\s]+)\)/g, '<img src="$2" alt="$1" loading="lazy" style="max-width:100%;height:auto">')
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+|\/[^)\s]*)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
}
function mdToHtml(md) {
  const out = []
  let list = null
  const close = () => { if (list) { out.push(`</${list}>`); list = null } }
  for (const raw of md.replace(/```[\s\S]*?```/g, '').split('\n')) {
    const line = raw.trimEnd()
    let m
    if (!line.trim()) { close(); continue }
    if ((m = line.match(/^(#{1,6})\s+(.*)/))) { close(); const n = Math.min(6, m[1].length + 1); out.push(`<h${n}>${inline(m[2])}</h${n}>`); continue }
    if (line === '---') { close(); out.push('<hr>'); continue }
    if ((m = line.match(/^\s*(?:[-*]|\d+\.)\s+(.*)/))) {
      const t = /^\s*\d+\./.test(line) ? 'ol' : 'ul'
      if (list !== t) { close(); out.push(`<${t}>`); list = t }
      out.push(`<li>${inline(m[1])}</li>`); continue
    }
    if (line.startsWith('URL: ')) continue
    close(); out.push(`<p>${inline(line.replace(/^>\s?/, ''))}</p>`)
  }
  close()
  return out.join('\n')
}

const firstSentence = (md) => {
  const p = md.split('\n').find((l) => l.trim().length > 40 && !/^(#|URL:|!\[|-|\d+\.|---|```)/.test(l.trim())) ?? ''
  const t = p.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/\*\*/g, '').trim()
  return t.length > 160 ? t.slice(0, 157).replace(/\s+\S*$/, '') + '…' : t
}

function nav() {
  return `<nav><a href="/">Home</a> · <a href="/machines">Machines</a> · <a href="/products">Products</a> · <a href="/technology">Technology</a> · <a href="/business-goals">Business goals</a> · <a href="/blog">Blog</a> · <a href="/about">About</a> · <a href="/contact">Contact</a></nav>`
}

function renderPage(shell, { path, title, description, body, markdownUrl }) {
  const url = `${SITE}${path}`
  let html = shell
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*"/, `$1${esc(description)}"`)
    .replace(/(<meta property="og:title" content=")[^"]*"/, `$1${esc(title)}"`)
    .replace(/(<meta property="og:description" content=")[^"]*"/, `$1${esc(description)}"`)
    .replace(/(<meta property="og:url" content=")[^"]*"/, `$1${url}"`)
    .replace(/(<link rel="canonical" href=")[^"]*"/, `$1${url}"`)
  if (markdownUrl) html = html.replace('</head>', `  <link rel="alternate" type="text/markdown" title="This page as Markdown" href="${markdownUrl}" />\n  </head>`)
  const main = `<main style="max-width:760px;margin:2rem auto;padding:0 1rem;font-family:system-ui,sans-serif;line-height:1.5">
      ${nav()}
      ${body}
      <p><small>Plain-text version for AI agents: <a href="${markdownUrl ?? '/llms.txt'}">${markdownUrl ? 'this page as Markdown' : '/llms.txt'}</a> · <a href="/llms.txt">all content</a></small></p>
    </main>`
  const root = /<div id="root">(?:<\/div>|[\s\S]*?<\/main><\/div>)/
  if (!root.test(html)) throw new Error('app shell root not found')
  return html.replace(root, `<div id="root">${main}</div>`)
}

function write(file, content) {
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, content)
}

export async function generateAgentFiles(outDir) {
  const shellPath = resolve(outDir, 'index.html')
  if (!existsSync(shellPath)) return
  const shell = readFileSync(shellPath, 'utf8')
  const lists = {}
  for (const ct of Object.keys(DYNAMIC)) lists[ct] = (await entries(ct)).filter((e) => e.fields?.slug)

  // Sitemap
  const urls = Object.entries(STATIC).map(([p, v]) => ({ p, pr: v[3] }))
  for (const [ct, [toPath, pr]] of Object.entries(DYNAMIC)) for (const e of lists[ct]) urls.push({ p: toPath(e.fields.slug), pr, lm: e.sys.updatedAt?.slice(0, 10) })
  const sitemap = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((u) => `  <url>\n    <loc>${SITE}${u.p}</loc>${u.lm ? `\n    <lastmod>${u.lm}</lastmod>` : ''}\n    <priority>${u.pr}</priority>\n  </url>`),
    '</urlset>', ''].join('\n')
  write(resolve(outDir, 'sitemap.xml'), sitemap)
  write(resolve('public/sitemap.xml'), sitemap)

  // Full-text snapshot on our own domain
  write(resolve(outDir, 'llms-full.txt'), await getText(`${FEED}?all=1`))

  const titleOf = (e) => e.fields?.title ?? e.fields?.name ?? 'Untitled'
  let count = 0

  // Static pages
  for (const [path, [title, feedType, listType]] of Object.entries(STATIC)) {
    let md = ''
    if (feedType) { try { md = await getText(`${FEED}?type=${feedType}`) } catch { md = '' } }
    let body = md ? mdToHtml(md) : `<h1>${esc(title.split(' |')[0])}</h1>`
    if (listType) {
      const [toPath] = DYNAMIC[listType]
      body += `<ul>${lists[listType].map((e) => `<li><a href="${toPath(e.fields.slug)}">${esc(titleOf(e))}</a></li>`).join('')}</ul>`
    }
    if (path === '/contact') body += '<p>Request a quote or ask a question: email <a href="mailto:info@applestonesolutions.com">info@applestonesolutions.com</a> or use the contact form on this page.</p>'
    const description = firstSentence(md) || 'Smart vending machines, AI coolers, temperature-controlled lockers and the cloud software that runs them, for operators, retailers and vending OEMs.'
    const markdownUrl = feedType ? `${FEED}?type=${feedType}` : listType ? `${FEED}?type=${listType}` : undefined
    const html = renderPage(shell, { path, title, description, body, markdownUrl })
    write(path === '/' ? shellPath : resolve(outDir, `.${path}/index.html`), html)
    count++
  }

  // Detail pages
  for (const [ct, [toPath]] of Object.entries(DYNAMIC)) {
    for (const e of lists[ct]) {
      const markdownUrl = `${FEED}?type=${ct}&slug=${encodeURIComponent(e.fields.slug)}`
      let md
      try { md = await getText(markdownUrl) } catch { continue }
      md = md.replace(/^# .*\n+/, '') // drop the section label; the entry heading becomes the page heading
      const path = toPath(e.fields.slug)
      const title = `${titleOf(e)} | Applestone Solutions`
      write(resolve(outDir, `.${path}/index.html`), renderPage(shell, { path, title, description: firstSentence(md.replace(/^## .*\n+/, '')) || titleOf(e), body: mdToHtml(md), markdownUrl }))
      count++
    }
  }
  console.log(`[agent-pages] sitemap ${urls.length} URLs, llms-full.txt, ${count} readable pages`)
}

export function agentPagesPlugin() {
  let outDir = 'dist'
  return {
    name: 'agent-pages',
    apply: 'build',
    configResolved(c) { outDir = resolve(c.root, c.build.outDir) },
    async closeBundle() {
      try { await generateAgentFiles(outDir) } catch (err) { console.warn('[agent-pages] Skipped:', err.message) }
    },
  }
}
