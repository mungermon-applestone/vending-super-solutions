# Customer Metrics: match alternating section layout

Restyle the Customer Metrics section on /technology so it matches the alternating two-column pattern used by the technology sections above it — chart graphic on the left, copy on the right.

## What changes

- Two-column layout: `flex flex-col md:flex-row`, `gap-12`, `items-center`, each column `md:w-1/2`, inside `container max-w-7xl mx-auto px-4`, with `py-16` and the same `bg-gradient-to-b from-white to-gray-50` band as the sections above.
- Left column: the Customer Traffic bar chart, in a rounded card with the same `rounded-lg shadow-xl` treatment as the section images, sized to roughly the 4:3 proportion of neighboring images.
- Right column: heading "Customer Metrics" (`text-3xl font-bold tracking-tight`, left-aligned), the one-sentence blurb as `text-lg text-muted-foreground`, and the anonymized-data caption below it as smaller muted text.
- Drops the centered heading block and the Card header, so the copy reads exactly like the neighboring sections.

## Technical notes

- Edits only `src/components/technology/CustomerMetricsSection.tsx`; chart data, `ChartContainer` config, and `TranslatableText` wrappers stay as they are.
- No change to `TechnologyPage.tsx` placement (still between the technology sections and the testimonials carousel).
