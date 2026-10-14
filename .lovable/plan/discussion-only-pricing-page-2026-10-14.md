# Discussion-only pricing page

## Goal
Create a working pricing-page preview that feels native to Applestone Solutions, using the supplied tiers as a proposal—not an announced offer.

## Design
- Use the existing site's typography, blue/teal accents, header, and footer.
- Open with **Software pricing**, brief supporting copy, and a discreet but unmistakable **Proposed pricing · For discussion only** notice.
- Show three aligned pricing cards with prominent prices, concise audience descriptions, feature lists, and back-office seat allowances. Give Pro a restrained visual emphasis, without an unsupported “most popular” claim.
- Display **Per machine, per month** and **3.9% + $0.25 per transaction across all tiers** prominently, not buried in fine print.
- Follow the cards with a clear comparison table; stack the cards and adapt the comparison for narrow screens.

## Proposed tiers
| | Starter | Pro | Enterprise |
|---|---|---|---|
| Monthly price per machine | $9 | $29 | From $59; quoted |
| Built for | New operators, up to 5 machines | Growing fleets with a small team | Large operators and brand programs |
| Back-office seats | 2 | 10 | Unlimited |

**Starter:** Loader App with door access; temperature alerts; inventory; sales and tax reports.

**Pro:** Everything in Starter, plus coupons, discounts and bundles; Sold/Expired and turnover; restock lists; buy online, pick up in store (BOPIS).

**Enterprise:** Everything in Pro, plus branded screens and ad banners; custom roles and statuses; kitting plan edits; partner management.

Use the supplied dollar notation without inventing tax treatment, annual discounts, contract terms, free trials, or additional limits. Higher-tier seat allowances replace—not add to—the lower-tier allowances.

## Discussion interactions
- Use **Discuss Starter**, **Discuss Pro**, and **Discuss Enterprise** controls that open a small proposal-summary dialog, rather than starting signup, payment, or sending inquiries.
- Repeat the discussion-only status in the dialog; include a close control.
- Do not build checkout, billing, or subscriptions.

## Keep it off the public site
- Make it available at `/pricing-preview` in the development preview only; exclude the page from production routing and loading.
- Add no links in the site's navigation or footer, and no entries in the sitemap, AI content feed, or Contentful.
- Set page-specific title and `noindex, nofollow` metadata as an extra precaution. This is not an access-control mechanism; the production exclusion is the safeguard.
- Do not publish the site or change any live Contentful content.

## Technical details
- Register a development-only lazy-loaded page in the existing React router under the shared Layout, which already supplies the header and footer.
- Keep the proposed plan data local and separate from live business content; use existing semantic color tokens and shared controls.
- Use the existing Helmet setup for page metadata; leave global head settings unchanged.

## Verification
- Open the preview directly, verify all prices, transaction fees, seat limits, and cumulative features against the screenshot.
- Exercise each discussion dialog and verify that no purchase or message is sent.
- Check wide and narrow layouts for readability and overflowing text, and inspect preview diagnostics.
- Verify the production guard and that no public discovery links were added.

## Result
A working, clearly labeled proposal for discussion, with no changes to published pricing or live purchasing behavior.