import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Check, CreditCard, Minus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { comparisonGroups, pricingPlans, transactionFee } from '@/data/pricingProposal';
import { cn } from '@/lib/utils';

export default function PricingPreviewPage() {
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const selected = selectedTier === null ? undefined : pricingPlans[selectedTier];

  return (
    <>
      <Helmet>
        <title>Proposed Software Pricing | Applestone Solutions</title>
        <meta name="description" content="Discussion-only proposal for Applestone Solutions software pricing tiers." />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <section className="border-b border-border bg-card">
        <div className="container-wide pb-12 pt-12 md:pt-16">
          <div className="mb-7 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-secondary" aria-hidden="true" />
            Proposed pricing · For discussion only
          </div>
          <h1 className="mb-5 text-4xl md:text-5xl">Software pricing</h1>
          <p className="mb-7 max-w-2xl text-lg text-muted-foreground">
            From your first machines to a growing network. Choose the tools that fit your operation.
          </p>
          <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:gap-6">
            <span className="font-medium">Per machine, per month</span>
            <span className="flex items-center gap-2 text-muted-foreground">
              <CreditCard className="h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
              {transactionFee} per transaction across all tiers
            </span>
          </div>
        </div>
      </section>

      <section className="container-wide py-12" aria-label="Proposed pricing tiers">
        <div className="grid gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <article key={plan.name} className={cn('flex min-w-0 flex-col rounded-lg border bg-card', index === 1 ? 'border-primary ring-1 ring-primary' : 'border-border')}>
              <div className={cn('border-b px-7 pb-7 pt-6', index === 1 ? 'border-primary/20 bg-primary/5' : 'border-border')}>
                <h2 className={cn('mb-4 text-2xl', index === 1 && 'text-primary')}>{plan.name}</h2>
                <div className="mb-2 flex min-h-14 items-baseline gap-2">
                  {index === 2 && <span className="text-sm text-muted-foreground">From</span>}
                  <span className="text-5xl font-semibold">${plan.price}</span>
                  <span className="text-sm text-muted-foreground">/ month</span>
                </div>
                <p className="mb-5 text-sm text-muted-foreground">Per machine{index === 2 ? ' · Custom quote' : ''}</p>
                <p className="mb-0 min-h-12 font-medium">{plan.audience}</p>
              </div>
              <div className="flex flex-1 flex-col p-7">
                <p className="mb-6 min-h-12 text-sm text-muted-foreground">{plan.introduction}</p>
                <p className="mb-4 text-sm font-semibold">{plan.includes}</p>
                <ul className="mb-7 space-y-4">
                  {plan.features.map(feature => (
                    <li key={feature} className="flex gap-3 text-sm leading-6">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto">
                  <p className="mb-6 flex items-center gap-3 border-t border-border pt-5 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <span><strong>{plan.seats}</strong> back-office seats</span>
                  </p>
                  <Button className="w-full" size="lg" variant={index === 1 ? 'default' : 'outline'} onClick={() => setSelectedTier(index)}>
                    Discuss {plan.name}<ArrowRight aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-5 rounded-lg border border-primary/30 bg-primary/5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex gap-4">
            <Building2 className="h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <h3 className="mb-1 text-lg font-semibold">Enterprise deployments &amp; integrations</h3>
              <p className="mb-0 max-w-2xl text-sm leading-6 text-muted-foreground">
                Large fleets, custom hardware, API and back-office integrations, and private deployment are handled outside these tiers and priced per program.
              </p>
            </div>
          </div>
          <Button asChild className="shrink-0" variant="outline">
            <Link to="/contact">Talk to us<ArrowRight aria-hidden="true" /></Link>
          </Button>
        </div>
      </section>

      <section className="border-t border-border bg-card py-12 md:py-16">
        <div className="container-wide">
          <h2 className="mb-3 text-3xl">Compare the tiers</h2>
          <p className="mb-8 text-muted-foreground">Each higher tier includes the features of the tier before it.</p>
          <div className="overflow-x-auto">
            <table className="w-full table-fixed border-collapse text-left text-xs sm:text-sm">
              <caption className="sr-only">Proposed software plan features and allowances</caption>
              <colgroup><col className="w-[43%] sm:w-[46%]" /><col /><col /><col /></colgroup>
              <thead>
                <tr className="border-b-2 border-border">
                  <th scope="col" className="py-4 pr-2 font-medium text-muted-foreground">Included features</th>
                  {pricingPlans.map((plan, index) => <th key={plan.name} scope="col" className={cn('break-words px-1 py-4 text-center font-semibold sm:px-3', index === 1 && 'text-primary')}>{plan.name}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <th scope="row" className="py-4 pr-3 font-normal">Monthly price per machine</th>
                  {pricingPlans.map((plan, index) => <td key={plan.name} className="px-1 py-4 text-center font-medium sm:px-3">{index === 2 ? 'From ' : ''}${plan.price}{index === 2 && <span className="mt-1 block text-xs font-normal text-muted-foreground">Quoted</span>}</td>)}
                </tr>
                <tr className="border-b border-border">
                  <th scope="row" className="py-4 pr-3 font-normal">Back-office seats</th>
                  {pricingPlans.map(plan => <td key={plan.name} className="px-1 py-4 text-center sm:px-3">{plan.seats}</td>)}
                </tr>
                {comparisonGroups.map(group => (
                  <ComparisonGroup key={group.label} group={group} />
                ))}
                <tr className="border-b border-border">
                  <th scope="row" className="py-4 pr-3 font-normal">Transaction pricing</th>
                  <td colSpan={3} className="px-2 py-4 text-center font-medium">{transactionFee} per transaction</td>
                </tr>
              </tbody>
            </table>
        </div>
      </section>

      <Dialog open={selected !== undefined} onOpenChange={open => { if (!open) setSelectedTier(null); }}>
        {selected && (
          <DialogContent className="max-h-[85vh] w-[calc(100%-2rem)] overflow-y-auto rounded-lg bg-card">
            <DialogHeader>
              <DialogTitle className="pr-5 text-2xl tracking-normal">{selected.name} proposal</DialogTitle>
              <DialogDescription>Proposed pricing · For discussion only. This is not an order or an inquiry.</DialogDescription>
            </DialogHeader>
            <p className="mb-0 text-3xl font-semibold">{selectedTier === 2 ? 'From ' : ''}${selected.price}<span className="ml-2 text-sm font-normal text-muted-foreground">per machine, per month</span></p>
            <p className="mb-0 text-sm text-muted-foreground">{transactionFee} per transaction{selectedTier === 2 ? ' · Custom quote' : ''}</p>
            <p className="mb-0 text-sm"><strong>{selected.seats}</strong> back-office seats · {selected.audience}</p>
            <ul className="space-y-2 border-t border-border pt-4">
              {pricingPlans.slice(0, (selectedTier ?? 0) + 1).flatMap(plan => plan.features).map(feature => <li key={feature} className="flex gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" aria-hidden="true" /><span>{feature}</span></li>)}
            </ul>
            <Button variant="outline" onClick={() => setSelectedTier(null)}>Close discussion</Button>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}

function ComparisonGroup({ group }: { group: typeof comparisonGroups[number] }) {
  return (
    <>
      <tr className="bg-muted/50"><th colSpan={4} scope="colgroup" className="py-3 pr-3 text-xs font-semibold text-muted-foreground">{group.label}</th></tr>
      {group.features.map(feature => (
        <tr key={feature} className="border-b border-border">
          <th scope="row" className="py-4 pr-3 font-normal leading-5">{feature}</th>
          {pricingPlans.map((plan, index) => (
            <td key={plan.name} className="px-1 py-4 text-center sm:px-3">
              {index >= group.minimumTier ? <><Check className="mx-auto h-4 w-4 text-secondary" aria-hidden="true" /><span className="sr-only">Included</span></> : <><Minus className="mx-auto h-4 w-4 text-muted-foreground/60" aria-hidden="true" /><span className="sr-only">Not included</span></>}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}