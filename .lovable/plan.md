# Fix the oversized NAMA logo on the About page

Right now the NAMA logo lives in the About entry's rich text, and the generic rich-text image renderer displays every embedded image full-width in a bordered grey box — that's why it looks huge with the sentence stranded underneath. This isn't something you can fix from Contentful; it's a rendering rule in the site code.

## What will change

Render the NAMA membership content as a compact badge that matches the footer, while keeping the text editable in Contentful.

1. The rich-text renderer recognizes the NAMA logo asset (matched by asset ID) and renders it as a small logo (about 48px tall) instead of the full-width bordered image block.
2. The paragraph immediately following it — the membership sentence, still edited in Contentful — sits beside the logo on desktop and below it on mobile, vertically centered, in the same muted grey style as the footer.
3. Everything else in the About rich text keeps rendering exactly as it does today; other embedded images stay full-width.
4. The footer badge is untouched.

Net effect: the About page badge looks like the footer one, and you keep editing the sentence in Contentful.

## Alternative, if you'd rather not have this in Contentful at all

I can instead remove the logo + sentence from the About entry and go back to the shared `NamaMembership` component on the About page — simpler layout control, but the text is no longer editable in Contentful. Say the word and I'll switch.

## Technical notes

- `src/utils/contentful/richTextRenderer.tsx`: in the `BLOCKS.EMBEDDED_ASSET` handler, special-case the NAMA asset ID and return the compact badge markup; a small wrapper collapses the logo and the sentence into one centered flex row.
- Uses existing grey/muted utility classes already used by `NamaMembership.tsx`; no new tokens.
- No Contentful changes needed and no changes to the About page component.
