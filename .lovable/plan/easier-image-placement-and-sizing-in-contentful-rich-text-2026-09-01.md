# Easier image placement and sizing in Contentful rich text

## The current situation

Blog post bodies (and About, Knowledge Base, Terms, Privacy) all render through one shared function: `getRichTextRenderOptions` in `src/utils/contentful/richTextRenderer.tsx`. Every embedded image is rendered the same way — centered, full content width, inside a bordered box. Nothing in Contentful can change that today.

Contentful's rich text editor already lets an editor **move** an image (drag the block up/down, or cut/paste it between paragraphs). What it does not offer natively is **resizing**, **left/right text wrap**, or captions. There is no true drag-handle WYSIWYG resize in Contentful's stock rich text editor, and adding one means building a custom Contentful field app — a large amount of work outside this codebase, so it is not recommended.

The good news: everything below is achieved by editing that single renderer file. No page or component refactor.

## Option A — Layout hints on the asset (smallest change)

Editors set a size/alignment token in the image asset's **Description** field in the Contentful media library, e.g.:

```text
Storefront cabinet | width:50 align:right
```

The renderer reads the description, strips the tokens, and uses the rest as the caption/alt text. Supported tokens: `width:25|33|50|66|75|100`, `align:left|center|right`, `wrap` (text flows around it).

- Pros: one file changed, works immediately for every existing image and every rich text field on the site, no content model changes, nothing to republish.
- Cons: the setting lives on the asset, so the same image reused in two posts gets the same size in both. No live preview while editing — the editor saves and checks the page.

## Option B — An "Image Block" embedded entry (most control)

Add a small Contentful content type `imageBlock` with fields: Image (asset), Width (dropdown), Alignment (dropdown), Caption (text), Link URL (optional). Editors embed an *entry* rather than a bare asset, and get real dropdowns in the editor sidebar.

- Pros: per-placement control, proper labelled UI in Contentful, room to grow (captions, credits, click-through links, side-by-side pairs later).
- Cons: new content type plus an editor habit change; the renderer must resolve linked entries, and the blog fetch needs `include=2` so the nested asset comes back. Existing bare-asset images keep working through the current path.

## Option C — Better defaults with no editor effort

Independent of A and B: make the default embedded image behave better — cap the height so tall images don't dominate the page, remove the grey box border, render the asset description as a caption underneath, and let the editor click to open the full-size image. This alone removes most of the complaints without anyone learning a new workflow.

## Recommendation

Do **C + A** first: better defaults, plus optional tokens for the cases that need a smaller or side-floated image. That is one file, no content model migration, and no republishing. If the team finds itself wanting per-post control and captions often, add **B** afterwards — A and B can coexist.

Real WYSIWYG (drag-resize handles inside Contentful) would need a custom Contentful app; worth revisiting only if image layout becomes a daily task.

## Technical notes

- All changes land in `src/utils/contentful/richTextRenderer.tsx`, inside the `BLOCKS.EMBEDDED_ASSET` handler and (for B) a new `BLOCKS.EMBEDDED_ENTRY` handler.
- Width tokens map to fixed Tailwind classes (`w-1/4`, `w-1/2`, `w-2/3`, `w-full`) so Tailwind can see them at build time; on mobile everything falls back to full width.
- Float/wrap uses `float-left`/`float-right` with margin and a clearfix on the containing prose block.
- Contentful image URLs get `?w=<px>&fm=webp&q=80` appended so a half-width image also downloads at half size.
- The existing NAMA badge special case in `renderRichText` stays untouched.
- Option B requires the blog fetch (`useContentfulBlogPostBySlug`) to include linked entries and pass `includes.Entry` into the render options alongside `includes.Asset`.
