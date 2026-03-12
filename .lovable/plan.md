
## Trade Show Welcome Message - Options Analysis

### Overview
You want visitors who scan a QR code at your trade show booth to see a special welcome message when they arrive at your site.

---

### Recommended Approach: URL Parameter with Dynamic Banner

**The Best Solution: Use a URL parameter (e.g., `?ref=tradeshow`) that triggers a special welcome banner.**

**Why this is the best approach:**
1. **Single QR code** - Link to `https://yoursite.com?ref=tradeshow`
2. **Full site experience** - Visitors see the welcome message AND can explore your entire site
3. **Easy to track** - You can monitor how many visitors came from the trade show
4. **Reusable** - Can be adapted for future events with different parameters
5. **Leverages existing infrastructure** - Similar pattern to your promotional strip system

---

### Implementation Plan

#### Step 1: Create Trade Show Welcome Banner Component

**New File: `src/components/layout/TradeShowBanner.tsx`**

A prominent, visually distinct banner that:
- Checks for `?ref=tradeshow` (or similar) in the URL
- Displays a customizable welcome message (e.g., "Welcome, Trade Show Visitors!")
- Is dismissible (stores in sessionStorage so it doesn't reappear during their visit)
- Has eye-catching styling (different from the promotional strip)
- Positioned at the very top of the page, above the promotional strip

---

#### Step 2: Create Hook to Detect Trade Show Visitors

**New File: `src/hooks/useTradeShowVisitor.ts`**

```text
- Checks URL for trade show parameter (?ref=tradeshow)
- Stores flag in sessionStorage to persist across page navigation
- Returns { isTradeShowVisitor, message, dismiss }
```

---

#### Step 3: Integrate into Layout

**File: `src/components/layout/Layout.tsx`**

Add the TradeShowBanner component above the PromotionalStrip:

```text
<TradeShowBanner />    <-- NEW
<PromotionalStrip />
<PromotionalPopover />
<Header />
...
```

---

### QR Code URL Format

Your QR code would link to:
```
https://vending-super-solutions.lovable.app?ref=tradeshow
```

Or for a specific trade show:
```
https://vending-super-solutions.lovable.app?ref=nama2025
```

---

### Banner Design Concept

```
┌────────────────────────────────────────────────────────────────────┐
│  🎉  Welcome, Trade Show Visitors! Glad you stopped by our booth! │  ✕
└────────────────────────────────────────────────────────────────────┘
```

- Bold, welcoming colors (could use brand accent color)
- Dismissible with X button
- Message can be customized in the component or made configurable via Contentful

---

### Alternative Approaches (Not Recommended)

| Approach | Pros | Cons |
|----------|------|------|
| Dedicated landing page | Simple to implement | Visitors miss the full site; need to maintain separate page |
| Modify home page permanently | No development needed | All visitors see the message, not just trade show |

---

### Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/hooks/useTradeShowVisitor.ts` | Create | Hook to detect and manage trade show visitor state |
| `src/components/layout/TradeShowBanner.tsx` | Create | Welcome banner component |
| `src/components/layout/Layout.tsx` | Modify | Add banner to layout |

---

### Optional Enhancements

1. **Configurable via Contentful** - Make the message editable in your CMS
2. **Multiple trade shows** - Support different messages for different events (e.g., `?ref=nama` vs `?ref=ces`)
3. **Analytics tracking** - Log trade show visitors for reporting
4. **Expiration** - Auto-hide the banner after X days from the event
