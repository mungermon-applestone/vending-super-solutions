# AI-readable version of the website

## Goal
Give AI agents a plain-text version of everything on the site (pages, machines, products, technology, blog, help desk, about/policies) that they can read without running JavaScript.

## What we'll build
1. **A live "site content" feed** that pulls the published content straight from Contentful and returns it as simple Markdown text — headings, paragraphs, bullet lists, image descriptions, and links. Always up to date; nothing to re-publish when you edit Contentful.
   - One overview document listing every page with a one-line summary and link.
   - One document per page (e.g. a single machine, a single blog post), reachable by type and slug.
   - A "everything in one file" version for agents that want it all at once.
2. **`/llms.txt` on the website** — the emerging standard file AI agents look for. It explains what Applestone Solutions does and points to the feed links above.
3. **Pointers for crawlers**: mention the feed in `robots.txt` and add a hidden `<link rel="alternate" type="text/markdown">` in the page header so agents landing on the home page find it.

Draft/unpublished entries (e.g. the regulated product pages) are excluded automatically, since only published content is read.

## How you'd use it
Tell the AI agent: "Start at https://applestonesolutions.com/llms.txt" — it will follow the links to the readable content.

## Technical details
- New edge function `site-content` (public, read-only, Delivery API token from secrets, GET only, 10-minute cache headers). Routes: `?format=index`, `?type=machine&slug=...`, `?all=1`. Content types: homePageContent, productsPageContent, productType, machine, technologySection, blogPost, helpDeskArticle, privacyPolicy, businessGoal.
- Reuse the rich-text-to-Markdown converter from `ExportHelpDeskArticles.tsx`, moved into the function.
- Static `public/llms.txt` with company summary + function URLs; update `public/robots.txt` and `index.html`.
- Verify with `curl` that each endpoint returns readable Markdown and excludes unpublished entries.
