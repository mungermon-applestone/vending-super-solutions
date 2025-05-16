
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import * as z from 'zod';

interface PreviewTabProps {
  form: UseFormReturn<z.infer<any>>;
}

const PreviewTab: React.FC<PreviewTabProps> = ({ form }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview</CardTitle>
        <CardDescription>
          Preview how your hero section will look.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`p-6 rounded-lg mb-6 ${form.watch('hero.background_class')}`}>
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">{form.watch('hero.title') || 'Hero Title'}</h2>
              <p>{form.watch('hero.subtitle') || 'Hero subtitle goes here with more details about the page and what users can expect.'}</p>
              <div className="flex flex-wrap gap-3">
                {form.watch('hero.cta_primary_text') && (
                  <div className="bg-vending-blue text-white px-4 py-2 rounded">
                    {form.watch('hero.cta_primary_text')}
                  </div>
                )}
                {form.watch('hero.cta_secondary_text') && (
                  <div className="bg-white border border-gray-300 px-4 py-2 rounded">
                    {form.watch('hero.cta_secondary_text')}
                  </div>
                )}
              </div>
            </div>
            <div>
              {form.watch('hero.image_url') ? (
                <img 
                  src={form.watch('hero.image_url')} 
                  alt={form.watch('hero.image_alt')} 
                  className="w-full h-64 object-cover rounded" 
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/400x300?text=Image+Error";
                  }}
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded">
                  <p className="text-gray-500">Image Preview</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreviewTab;
