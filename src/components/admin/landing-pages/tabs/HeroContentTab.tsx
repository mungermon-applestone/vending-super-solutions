
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import MediaSelector from '@/components/admin/media/MediaSelector';
import BackgroundPreview from '@/components/admin/landing-pages/BackgroundPreview';
import * as z from 'zod';

interface HeroContentTabProps {
  form: UseFormReturn<z.infer<any>>;
  backgroundOptions: Array<{value: string, label: string}>;
}

const HeroContentTab: React.FC<HeroContentTabProps> = ({ form, backgroundOptions }) => {
  // Get the current is_video value
  const isVideo = form.watch('hero.is_video');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Content</CardTitle>
        <CardDescription>
          Configure the hero section content.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="hero.title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hero Title</FormLabel>
              <FormControl>
                <Input placeholder="Main heading for the hero section" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="hero.subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hero Subtitle</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Supporting text for the hero section" 
                  className="min-h-24"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="hero.background_class"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Background Style</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {backgroundOptions.map((option) => (
                  <BackgroundPreview
                    key={option.value}
                    value={option.value}
                    label={option.label}
                    isSelected={field.value === option.value}
                    onClick={() => field.onChange(option.value)}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="hero.is_video"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Use Video</FormLabel>
                <FormDescription>
                  Display a video instead of an image in the hero section
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        {isVideo ? (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="hero.video_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video URL</FormLabel>
                  <FormDescription>
                    Enter a URL for external videos (YouTube, Vimeo, etc.) or select a video file below
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="URL to the video (YouTube, Vimeo or direct link)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="hero.video_file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video File</FormLabel>
                  <FormDescription>
                    Upload or select a video file from your media library
                  </FormDescription>
                  <FormControl>
                    <MediaSelector
                      value={field.value?.url || ""}
                      onChange={(url, contentType, fileName) => {
                        form.setValue("hero.video_file", {
                          url,
                          contentType: contentType || "video/mp4",
                          fileName: fileName || "video"
                        });
                      }}
                      buttonLabel="Select Video File"
                      mediaType="video/*"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="hero.video_thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Thumbnail</FormLabel>
                  <FormDescription>
                    This image will be shown before the video is played
                  </FormDescription>
                  <FormControl>
                    <MediaSelector
                      value={field.value}
                      onChange={(url) => {
                        form.setValue("hero.video_thumbnail", url);
                      }}
                      buttonLabel="Select Thumbnail Image"
                      mediaType="image/*"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="hero.image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hero Image</FormLabel>
                  <FormControl>
                    <MediaSelector
                      value={field.value}
                      onChange={(url) => {
                        form.setValue("hero.image_url", url);
                      }}
                      buttonLabel="Select Hero Image"
                      mediaType="image/*"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="hero.image_alt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image Alt Text</FormLabel>
                  <FormControl>
                    <Input placeholder="Alt text for accessibility" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HeroContentTab;
