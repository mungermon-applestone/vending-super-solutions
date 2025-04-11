
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MediaSelector from '@/components/admin/media/MediaSelector';
import { UseFormReturn } from 'react-hook-form';

interface TechnologyImageProps {
  form: UseFormReturn<any>;
}

const TechnologyImage: React.FC<TechnologyImageProps> = ({ form }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Technology Image</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            {form.control && (
              <div className="space-y-1">
                <label className="text-sm font-medium">Technology Image</label>
                <MediaSelector
                  value={form.watch?.("image_url") || ""}
                  onChange={(url) => form.setValue?.("image_url", url)}
                  buttonLabel="Select Technology Image"
                />
              </div>
            )}
          </div>
          
          {form.control && (
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Alt Text
              </label>
              <input
                type="text"
                className="w-full border rounded-md px-3 py-2"
                placeholder="Description for accessibility"
                value={form.watch?.("image_alt") || ""}
                onChange={(e) => form.setValue?.("image_alt", e.target.value)}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnologyImage;
