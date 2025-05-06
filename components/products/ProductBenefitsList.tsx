
import React from 'react';
import { Check } from 'lucide-react';

interface ProductBenefitsListProps {
  benefits: string[];
}

export default function ProductBenefitsList({ benefits }: ProductBenefitsListProps) {
  if (!benefits || benefits.length === 0) {
    return null;
  }

  return (
    <ul className="space-y-3">
      {benefits.map((benefit, index) => (
        <li key={index} className="flex items-start">
          <Check className="h-5 w-5 text-vending-teal mr-3 flex-shrink-0 mt-1" />
          <span className="text-[hsl(215_16%_47%)]">{benefit}</span>
        </li>
      ))}
    </ul>
  );
}
