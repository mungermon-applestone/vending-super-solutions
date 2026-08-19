# Make the two info cards editable per machine in Contentful

Today the "Customization Options" and "Software Compatibility" cards are hardcoded in the machine detail page. This moves both headlines and both body texts into the `machine` content type in Contentful, seeds every machine with the current wording, and makes the page render whatever Contentful says.

## What gets added to the Machine content model

Four new optional fields:

- Customization Options Title (short text)
- Customization Options Text (long text)
- Software Compatibility Title (short text)
- Software Compatibility Text (long text)

## Seeding existing machines

Every existing machine entry gets the current copy written into those four fields:

- "Customization Options" / "This machine can be customized with your branding, planogram, and digital signage."
- "Software Compatibility" / "Fully compatible with our vending management software, providing real-time inventory tracking, sales analytics, and remote management."

Entries that are currently published get republished so the live site picks the copy up. The one entry you left in draft (Cold + Ambient Smart Cabinet Combo) gets the fields filled in but stays a draft — you publish it when your copy edits are done.

## Page behavior

Each machine page shows its own Contentful headline and copy. If a field is ever left blank, the card falls back to the current default wording, so no page can end up with an empty card.

## Technical notes

- New script `scripts/add-machine-card-fields.mjs` using the Contentful Management API (same env/token loading pattern as `scripts/publish-cold-ambient-combo.mjs`): adds field IDs `customizationTitle`, `customizationText`, `softwareCompatibilityTitle`, `softwareCompatibilityText` to the `machine` content type, publishes the content type, then loops all `machine` entries, patches the four fields, and republishes only entries whose published version matches (skips drafts).
- Mirror the fields in `src/data/contentful-templates/machine.ts`, `src/types/contentful/machine.ts`, and `CMSMachine` in `src/types/cms.ts`.
- Map them through `src/utils/cms/transformers/machineTransformer.ts` and `mapContentfulMachine` in `src/hooks/useContentfulMachines.ts`.
- Pass them from `src/components/machineDetail/MachineDetail.tsx` into `MachineDetailFeatures.tsx`, which uses them with the existing strings as defaults.
