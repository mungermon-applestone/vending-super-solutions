# Project architecture

- Keep discussion-only pricing data local to its preview feature and gate both lazy imports and route registration with `import.meta.env.DEV`; prospective offers must never ship in production.
- Register website pages under the router's shared Layout without wrapping page content in Layout again; this prevents duplicate headers and footers.- AI-agent files (sitemap.xml, llms-full.txt, per-route readable index.html copies) are generated at build time by the Vite plugin in `scripts/agent-pages.mjs` from published Contentful content; it must never fail the build and must exclude admin/preview/pricing routes — static hosting has no server rendering.
