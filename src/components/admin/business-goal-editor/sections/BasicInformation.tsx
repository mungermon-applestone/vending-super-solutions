
import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BusinessGoalFormData } from '@/types/forms';
import { 
  TrendingUp, ShoppingBag, Activity, BarChart, Truck, Users, Target, PieChart, ArrowUpCircle, 
  Clock, DollarSign, Settings, Star
} from 'lucide-react';

interface BasicInformationProps {
  form: UseFormReturn<BusinessGoalFormData>;
}

const iconOptions = [
  { value: 'trending-up', label: 'Growth', icon: <TrendingUp className="h-4 w-4" /> },
  { value: 'shopping-bag', label: 'Shopping', icon: <ShoppingBag className="h-4 w-4" /> },
  { value: 'activity', label: 'Activity', icon: <Activity className="h-4 w-4" /> },
  { value: 'bar-chart', label: 'Analytics', icon: <BarChart className="h-4 w-4" /> },
  { value: 'truck', label: 'Delivery', icon: <Truck className="h-4 w-4" /> },
  { value: 'users', label: 'People', icon: <Users className="h-4 w-4" /> },
  { value: 'target', label: 'Target', icon: <Target className="h-4 w-4" /> },
  { value: 'pie-chart', label: 'Statistics', icon: <PieChart className="h-4 w-4" /> },
  { value: 'arrow-up-circle', label: 'Improvement', icon: <ArrowUpCircle className="h-4 w-4" /> },
  { value: 'clock', label: 'Time', icon: <Clock className="h-4 w-4" /> },
  { value: 'dollar-sign', label: 'Cost', icon: <DollarSign className="h-4 w-4" /> },
  { value: 'settings', label: 'Operations', icon: <Settings className="h-4 w-4" /> },
  { value: 'star', label: 'Quality', icon: <Star className="h-4 w-4" /> }
];

const BasicInformation: React.FC<BasicInformationProps> = ({ form }) => {
  // Create slug from title
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'title' && value.title) {
        const currentSlug = form.getValues('slug');
        if (!currentSlug) {
          const newSlug = value.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');
          form.setValue('slug', newSlug, { shouldValidate: true });
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          rules={{ required: 'Title is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Expand Footprint" {...field} />
              </FormControl>
              <FormDescription>
                The name of the business goal
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          rules={{ required: 'Slug is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="e.g., expand-footprint" {...field} />
              </FormControl>
              <FormDescription>
                The URL-friendly identifier (auto-generated from title)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {iconOptions.map(icon => (
                    <SelectItem key={icon.value} value={icon.value}>
                      <div className="flex items-center gap-2">
                        {icon.icon}
                        <span>{icon.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Icon representing this business goal
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          rules={{ required: 'Description is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the business goal..." 
                  className="min-h-32" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                A detailed description of this business goal
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default BasicInformation;
