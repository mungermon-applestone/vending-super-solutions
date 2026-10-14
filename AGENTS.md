# Project architecture

- Keep discussion-only pricing data local to its preview feature and gate both lazy imports and route registration with `import.meta.env.DEV`; prospective offers must never ship in production.
- Register website pages under the router's shared Layout without wrapping page content in Layout again; this prevents duplicate headers and footers.