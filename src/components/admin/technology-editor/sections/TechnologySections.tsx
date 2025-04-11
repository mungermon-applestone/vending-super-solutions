
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TechnologyFormValues } from '../TechnologyEditorForm';

interface TechnologySectionsProps {
  form: UseFormReturn<TechnologyFormValues>;
}

const TechnologySections: React.FC<TechnologySectionsProps> = ({ form }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Technology Sections</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">
          Add sections to your technology page to showcase features and capabilities.
        </p>
        <div className="space-y-4">
          {/* Section editor will go here in the future */}
          <p className="text-sm italic text-gray-400">
            Section editor coming soon.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnologySections;
