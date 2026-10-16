# AI agent readiness: evaluation and priorities

## Current readiness (checked live today)

| Area | Status |
|---|---|
| `llms.txt` on applestonesolutions.com | Live, working |
| Live plain-text content feed (all published pages) | Live, working |
| `robots.txt` | Live, but no explicit rules for AI crawlers; 10-second crawl delay slows them |
| Sitemap | Live, but only 16 pages and dated May 2025 — most machines, blog posts and help articles are missing |
| What an agent sees on a normal page | Empty shell: generic title "Applestone Solutions", generic description, no text |
| Structured data (company, products, articles) | Exists, but only added after JavaScript runs — most AI crawlers never see it |
| Feed address | Lives on a supabase.co address, not your domain (your earlier choice) |

Overall: **good foundation (about 5/10)**. Agents that follow `llms.txt` can read everything; agents that just open a page URL (most search-style AI crawlers like ChatGPT search, Perplexity, Claude) see nothing.

## Prioritized tasks

### Priority 1 — high impact, low effort
1. **Clear AI crawler rules in robots.txt**: explicitly welcome GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, PerplexityBot, Google-Extended, Applebot-Extended; remove the 10-second crawl delay for them; add a proper `Sitemap` line plus the `llms.txt` pointer.
2. **Live, complete sitemap**: generate it from Contentful (every published machine, product, blog post, business goal, help article) with real last-modified dates, replacing the stale 16-page file.
3. **Better default page text in the site shell**: a real title, description, and social tags, plus a short readable company summary and links that agents see even without JavaScript.
4. **Company structured data in the shell**: name, logo, contact, NAMA membership, what you sell — visible to every crawler.

### Priority 2 — medium effort, big gain
5. **Pre-rendered pages for crawlers**: produce static readable HTML for key pages (home, machines, products, technology, about, contact, each machine page) at publish time so any agent opening a link gets real content. Needs a rebuild/publish to pick up Contentful changes (or a scheduled refresh).
6. **`llms-full.txt`**: a single full-text file on your own domain (snapshot of the feed), refreshed on publish, so agents don't need to leave applestonesolutions.com.
7. **Per-page Markdown links**: each page points agents to its own Markdown version in the feed.

### Priority 3 — emerging / optional
8. **Agent-friendly actions**: describe how an agent can request a quote or contact you (contact form fields, email) in `llms.txt`; optionally an MCP/agent endpoint later.
9. **Monitoring**: monthly check that `llms.txt`, feed, and sitemap respond, and track AI-crawler visits.
10. **Content hygiene for AI**: fill missing image descriptions and short summaries on machines/blog posts in Contentful.

## What I suggest doing now
Tasks 1–4 together (one pass), then decide on 5–6.

## Technical details
- robots.txt: per-agent `User-agent` blocks with `Allow: /`, keep `/admin/` disallowed.
- Sitemap: add `?format=sitemap` to the `site-content` function and a build-time script writing `public/sitemap.xml` from Contentful (static hosting can't proxy).
- index.html: noscript-free static summary inside `#root` (React replaces it on mount), Organization JSON-LD, og/twitter tags.
- Pre-rendering: build-time script fetching Contentful and emitting per-route `index.html` files in `dist/` with content + JSON-LD; SPA still hydrates normally.
- Respect DNT/analytics rules; no admin or pricing-preview routes in any output.
