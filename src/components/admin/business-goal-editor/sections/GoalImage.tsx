
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MediaSelector from '@/components/admin/media/MediaSelector';

const GoalImage = ({ form }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Image</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            {form.control && (
              <div className="space-y-1">
                <label className="text-sm font-medium">Goal Image</label>
                <MediaSelector
                  value={form.watch?.("image.url") || ""}
                  onChange={(url) => form.setValue?.("image.url", url)}
                  buttonLabel="Select Goal Image"
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
                value={form.watch?.("image.alt") || ""}
                onChange={(e) => form.setValue?.("image.alt", e.target.value)}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalImage;
