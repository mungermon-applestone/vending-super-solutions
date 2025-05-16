
import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, MoveUp, MoveDown, Plus, ListChecks } from 'lucide-react';

interface FeatureItemsEditorProps {
  sectionIndex: number;
  featureIndex: number;
  form: any;
}

const FeatureItemsEditor: React.FC<FeatureItemsEditorProps> = ({
  sectionIndex,
  featureIndex,
  form,
}) => {
  const { control } = form;
  const { fields: itemFields, append: appendItem, remove: removeItem, move: moveItem } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.features.${featureIndex}.items`,
  });

  const addItem = () => {
    appendItem({
      text: '',
      display_order: itemFields.length,
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <FormLabel className="text-sm font-medium">Feature Items</FormLabel>
        <Button onClick={addItem} type="button" size="sm" variant="outline">
          <Plus className="h-3 w-3 mr-1" /> Add Item
        </Button>
      </div>
      
      {itemFields.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-4 text-center">
            <ListChecks className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-xs text-muted-foreground">
              Add bullet points that highlight aspects of this feature
            </p>
            <Button onClick={addItem} type="button" size="sm" className="mt-3">
              <Plus className="h-3 w-3 mr-1" /> Add First Item
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {itemFields.map((item, itemIndex) => (
            <div key={item.id} className="flex items-center gap-2 group">
              <FormField
                control={control}
                name={`sections.${sectionIndex}.features.${featureIndex}.items.${itemIndex}.text`}
                render={({ field }) => (
                  <FormItem className="flex-1 mb-0">
                    <FormControl>
                      <Input placeholder="Feature item text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => moveItem(itemIndex, Math.max(0, itemIndex - 1))}
                  disabled={itemIndex === 0}
                  className="h-7 w-7 p-0"
                >
                  <MoveUp className="h-3 w-3" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => moveItem(itemIndex, Math.min(itemFields.length - 1, itemIndex + 1))}
                  disabled={itemIndex === itemFields.length - 1}
                  className="h-7 w-7 p-0"
                >
                  <MoveDown className="h-3 w-3" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(itemIndex)}
                  className="h-7 w-7 p-0 text-destructive hover:text-destructive/90"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeatureItemsEditor;
