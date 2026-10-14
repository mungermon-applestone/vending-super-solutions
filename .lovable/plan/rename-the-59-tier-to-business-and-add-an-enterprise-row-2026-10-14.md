# Rename the $59 tier to "Business" and add an enterprise row

## What changes

1. **Tier name.** The $59/month tier is renamed **Enterprise → Business**. The name is stored in one place (`src/data/pricingProposal.ts`) and every place it appears — the tier card heading, the "Discuss Business" button, the comparison-table column header, and the proposal dialog title — reads from that single value, so the rename carries through all of them. Nothing else changes about that tier: still "From $59 / month", per machine, unlimited back-office seats, and still the top tier that includes Pro and Starter features.

2. **Enterprise row below the comparison table.** A full-width band is added directly under the table, visually reading as one more row, clearly more prominent than the plain note that follows it. It states that enterprise deployments and integrations are handled separately from the tiers, and links to the site's existing contact page.

```text
+--------------------------------------------------------------+
| Compare the tiers                                            |
| ... table rows ...                                           |
| Transaction pricing      3.9% + $0.25 per transaction        |
+--------------------------------------------------------------+
|  |  Enterprise deployments & integrations                    |
|  |  Custom fleets, hardware integrations, API access,        |
|  |  private deployment. Priced per program — talk to us.     |
|  |                                   [ Talk to us ]          |
+--------------------------------------------------------------+
| Proposed pricing only. These tiers are not currently         |
| available to purchase.                                       |
+--------------------------------------------------------------+
```

## Proposed copy for the new row

**Headline:** Enterprise deployments & integrations

**Sentence:** Large fleets, custom hardware, API and back-office integrations, and private deployment are handled outside these tiers and priced per program.

**Control:** "Talk to us" — links to the existing contact page.

Say the word if you'd rather this row read differently, or if you want the Business tier's own description lines ("Large operators and brand programs", "Your brand. Your workflows. Your network.") adjusted to match the new name — those are unchanged for now.

## Technical details

- `src/data/pricingProposal.ts`: `pricingPlans[2].name` changed from `'Enterprise'` to `'Business'`.
- `src/pages/PricingPreviewPage.tsx`: a band is added after the table's closing `</div>` (inside the "Compare the tiers" section), before the "Proposed pricing only" note. It uses the site's existing card/border tokens, a `Building2` icon from lucide-react, and a `Link to="/contact"` (react-router) so no new route is needed. The existing table markup, `ComparisonGroup` rows, dialog, and comparison groups are untouched.
- The whole page stays discussion-only and development-only: it remains registered behind `import.meta.env.DEV` in `src/routes.tsx` and keeps its `noindex,nofollow` tag, so nothing ships in production and nothing is published.

## Verification

- Typecheck (`bunx tsgo --noEmit -p tsconfig.app.json`) and build.
- Open `/pricing-preview` in the Lovable preview address bar and confirm: the third tier card, its button, the table column header, and the dialog all read "Business"; the enterprise band sits directly below the table and its link opens the contact page.
