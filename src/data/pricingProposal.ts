export const transactionFee = '3.9% + $0.25';

export const pricingPlans = [
  {
    name: 'Starter', price: 9, seats: '2',
    audience: 'New operators, up to 5 machines',
    introduction: 'The essentials for your first machines.',
    includes: 'Core operations',
    features: ['Loader App with door access', 'Temperature alerts', 'Inventory', 'Sales and tax reports'],
  },
  {
    name: 'Pro', price: 29, seats: '10',
    audience: 'Growing fleets with a small team',
    introduction: 'More ways to sell. Smarter ways to restock.',
    includes: 'Everything in Starter, plus',
    features: ['Coupons, discounts and bundles', 'Sold/Expired and turnover', 'Restock lists', 'Buy online, pick up in store (BOPIS)'],
  },
  {
    name: 'Enterprise', price: 59, seats: 'Unlimited',
    audience: 'Large operators and brand programs',
    introduction: 'Your brand. Your workflows. Your network.',
    includes: 'Everything in Pro, plus',
    features: ['Branded screens and ad banners', 'Custom roles and statuses', 'Kitting plan edits', 'Partner management'],
  },
] as const;

export const comparisonGroups = [
  { label: 'Operations', minimumTier: 0, features: pricingPlans[0].features },
  { label: 'Sales & replenishment', minimumTier: 1, features: pricingPlans[1].features },
  { label: 'Brand & organization', minimumTier: 2, features: pricingPlans[2].features },
] as const;