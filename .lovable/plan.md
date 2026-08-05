# Customer Metrics section on /technology

Add a new "Customer Metrics" section to the Technology page featuring a generic customer-traffic bar chart by time of day, plus a one-sentence blurb about anonymized customer insights.

## What the user sees

A section placed after the existing technology sections (before the testimonials carousel) with:
- Heading: "Customer Metrics"
- One-sentence blurb, e.g. "Anonymized, on-device customer counts reveal when your machines are busiest — so you can stock, price, and staff around real demand."
- A bar chart titled "Customer Traffic by Hour" with illustrative sample data (6am through 10pm), showing a morning bump, a strong midday peak, and an evening rise.
- A small caption noting the data is illustrative and fully anonymized (no personally identifiable information collected).

Styling uses existing semantic design tokens so it matches the rest of the page in both themes.

## Technical notes

- New component `src/components/technology/CustomerMetricsSection.tsx`, using the existing `recharts`-based `src/components/ui/chart.tsx` wrapper and `Card` primitives.
- Hardcoded sample dataset inside the component (no CMS/Contentful field, no backend). Bars colored with `hsl(var(--primary))` via the chart config.
- Wrapped in `TranslatableText` for the heading/blurb, consistent with the rest of `TechnologyPage.tsx`.
- Rendered in `src/pages/TechnologyPage.tsx` between `<TechnologySections />` and `<ContentfulTestimonialsCarousel />`.
- Responsive: chart in a `ResponsiveContainer` with a fixed height, x-axis labels condensed on small screens.
