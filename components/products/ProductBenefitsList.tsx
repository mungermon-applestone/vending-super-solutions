
import { Check } from 'lucide-react';

interface ProductBenefitsListProps {
  benefits: string[];
}

export default function ProductBenefitsList({ benefits }: ProductBenefitsListProps) {
  if (!benefits || benefits.length === 0) return null;
  
  return (
    <ul className="space-y-3">
      {benefits.map((benefit, index) => (
        <li key={index} className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <div className="h-5 w-5 rounded-full bg-teal-500 flex items-center justify-center">
              <Check className="h-3 w-3 text-white" />
            </div>
          </div>
          <span className="ml-3 text-gray-700">{benefit}</span>
        </li>
      ))}
    </ul>
  );
}
