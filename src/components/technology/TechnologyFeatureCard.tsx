
import React from 'react';
import { CMSTechnologyFeature } from '@/types/cms';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import * as Icons from 'lucide-react';

interface TechnologyFeatureCardProps {
  feature: CMSTechnologyFeature;
}

const TechnologyFeatureCard: React.FC<TechnologyFeatureCardProps> = ({ feature }) => {
  // Dynamically get the icon component
  const IconComponent = feature.icon ? 
    (Icons as any)[feature.icon] || Icons.CheckCircle : 
    Icons.CheckCircle;
  
  // Sort items by display order if they exist
  const sortedItems = feature.items && [...feature.items].sort(
    (a, b) => a.display_order - b.display_order
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start space-x-4">
          <div className="rounded-full bg-primary/10 p-2">
            <IconComponent className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">{feature.title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {feature.description && (
          <p className="text-muted-foreground mb-4">{feature.description}</p>
        )}
        
        {sortedItems && sortedItems.length > 0 && (
          <ul className="space-y-2 mt-4">
            {sortedItems.map((item) => (
              <li key={item.id} className="flex items-center gap-2 text-sm">
                <Icons.Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default TechnologyFeatureCard;
