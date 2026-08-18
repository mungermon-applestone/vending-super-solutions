import React from 'react';
import MachineDetail from '@/components/machineDetail/MachineDetail';
import { CMSMachine } from '@/types/cms';

const draftMachine = {
  "id": "aZcbUjYZlJ1zVgHFH9e5n",
  "title": "Cold + Ambient Smart Cabinet Combo",
  "slug": "cold-ambient-smart-cabinet-combo",
  "type": "vending",
  "description": "Two AI-vision cabinets, side by side: one refrigerated or frozen for fresh meals, proteins, and dairy, one ambient for snacks and pantry staples. Customers tap once, open, take what they want, and walk \u2014 the cabinets settle the basket automatically. Where a single split-climate box forces you to trade cold capacity against dry capacity, the combo gives you both at full depth, backed by Applestone\u2019s perishable-food operating experience.",
  "temperature": "multi",
  "features": [
    "Dedicated refrigerated or frozen cabinet \u2014 no shared-airflow compromise",
    "Full-depth ambient cabinet for snacks, pantry, and non-food",
    "AI computer-vision checkout: tap, open, grab, go",
    "Continuous temperature logging and out-of-range alerts",
    "Real-time inventory and planogram data per cabinet",
    "Built for perishables: date rotation, shrink tracking, HACCP-friendly records",
    "Independent service \u2014 one cabinet down never closes the market",
    "Scales from a single pair to a full unattended market footprint",
    "Cashless, contactless, and mobile-wallet payment",
    "Optional branded wrap and on-screen merchandising"
  ],
  "images": [
    {
      "id": "preview",
      "url": "/__combo-preview.png",
      "alt": "Cold + Ambient Smart Cabinet Combo"
    },
    {
      "id": "fridge",
      "url": "https://images.ctfassets.net/al01e4yh2wq4/1LNMTtD43VYDlQ4Af6HW5k/6a43a7ffebf63d91092417c06c7c80f4/generic-smart-fridge.png",
      "alt": "Smart fridge"
    }
  ],
  "specs": {
    "dimensions": "Information Coming Soon",
    "weight": "Information Coming Soon",
    "powerRequirements": "Information Coming Soon",
    "capacity": "Information Coming Soon",
    "paymentOptions": "Information Coming Soon",
    "connectivity": "Information Coming Soon",
    "manufacturer": "Information Coming Soon",
    "warranty": "Information Coming Soon"
  },
  "visible": true,
  "displayOrder": 10,
  "showOnHomepage": false
} as unknown as CMSMachine;

const ComboPreview: React.FC = () => <MachineDetail machine={draftMachine} />;

export default ComboPreview;
