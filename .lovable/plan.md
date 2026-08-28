# Remove the gray letterboxing behind hero images

Hero images render with `object-contain` inside a fixed-ratio box, so any leftover space shows the container background. Right now that space is light gray (#f3f4f6), which reads as a two-tone band next to product photos that have white backgrounds.

## What changes

1. **Image container background** — the shared `.image-container` rule paints every image box gray. Switch that to transparent so the box inherits the surrounding white card, keeping the drop shadow and rounded corners untouched. The gray is still used briefly while an image loads; that loading tint moves to a subtle skeleton on the wrapper only, not a permanent background.
2. **Contentful padding color** — hero images are requested with `fit=pad`, which lets Contentful add its own padding band. Add an explicit white padding color (`bg=rgb:ffffff`) so the delivered file matches the card.

Result: one continuous white field behind hero images, shadow and card framing preserved. Other pages using the same image components (machines, technology, products) get the same cleanup.

## Technical details

- `src/index.css` — `.image-container` background-color `#f3f4f6` becomes `transparent`.
- `src/components/common/Image.tsx` and `src/components/common/OptimizedImage.tsx` — append `&bg=rgb:ffffff` to the Contentful `fit=pad` URL; keep the `bg-gray-100` loading class behavior only until load completes (already conditional).
- No changes to hero layout, aspect ratio, shadow, or Contentful content.
