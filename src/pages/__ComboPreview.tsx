// TEMPORARY preview-only page used to render the draft Contentful machine entry.
// Safe to delete once the entry is published.
import MachineDetailComponent from '@/components/machineDetail/MachineDetail';

const draftMachine = {
  id: 'aZcbUjYZlJ1zVgHFH9e5n',
  slug: 'cold-ambient-smart-cabinet-combo',
  title: 'Cold + Ambient Smart Cabinet Combo',
  type: 'vending' as const,
  temperature: 'multi',
  description:
    'Two AI-vision cabinets, side by side: one refrigerated or frozen for fresh meals, proteins, and dairy, one ambient for snacks and pantry staples. Customers tap once, open, take what they want, and walk — the cabinets settle the basket automatically. Where a single split-climate box forces you to trade cold capacity against dry capacity, the combo gives you both at full depth, backed by Applestone’s perishable-food operating experience.',
  images: [
    { id: 'combo', url: '/__combo-preview.png', alt: 'Cold + Ambient Smart Cabinet Combo' },
  ],
  features: [
    'Dedicated refrigerated or frozen cabinet — no shared-airflow compromise',
    'Full-depth ambient cabinet for snacks, pantry, and non-food',
    'AI computer-vision checkout: tap, open, grab, go',
    'Continuous temperature logging and out-of-range alerts',
    'Real-time inventory and planogram data per cabinet',
    'Built for perishables: date rotation, shrink tracking, HACCP-friendly records',
    'Independent service — one cabinet down never closes the market',
    'Scales from a single pair to a full unattended market footprint',
    'Cashless, contactless, and mobile-wallet payment',
    'Optional branded wrap and on-screen merchandising',
  ],
  specs: {
    dimensions: 'Information Coming Soon',
    weight: 'Information Coming Soon',
    capacity: 'Information Coming Soon',
    powerRequirements: 'Information Coming Soon',
    paymentOptions: 'Information Coming Soon',
    connectivity: 'Information Coming Soon',
    manufacturer: 'Information Coming Soon',
    warranty: 'Information Coming Soon',
    temperature: 'multi',
  },
  deploymentExamples: [],
};

const ComboPreview = () => <MachineDetailComponent machine={draftMachine as never} />;

export default ComboPreview;
