# NAMA Membership Badge

Add a subtle NAMA membership mark with the line:

> Applestone Solutions is a proud member of National Automatic Merchandising Association.

## Where it appears

1. **Global footer** — a quiet row above the footer links: the NAMA logo (small, ~40px tall) on the left of the sentence, centered, muted grey text, separated by a hairline divider. Visible on every page but visually secondary to the nav columns.
2. **About page** — the same badge rendered at the end of the About content, giving it a bit more presence (slightly larger logo, light card background).

## Technical notes

- Upload `about-logo4.jpg` via the Lovable Assets CLI to `src/assets/nama-logo.png.asset.json`; reference the CDN URL. No binary committed to the repo.
- New shared component `src/components/common/NamaMembership.tsx` with a `variant` prop (`footer` | `page`) so both placements use one source of truth.
- Footer usage: rendered inside `src/components/layout/FooterLinks.tsx`, above the existing link row.
- About usage: rendered in `src/pages/About.tsx` beneath the rich-text block.
- Copy wrapped in `TranslatableText` (context `footer`) to match existing i18n handling; logo gets descriptive `alt` text ("NAMA — National Automatic Merchandising Association").
- Styling uses existing grey/muted utility patterns already present in the footer; no new tokens.

No CMS changes — the badge is static.
