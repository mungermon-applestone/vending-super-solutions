
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Loader2 } from 'lucide-react';

interface PublishFormProps {
  stepCount: number;
  onPublish: (data: {
    articleTitle: string;
    sectionCategory: string;
    headingCategory: string;
    publishImmediately: boolean;
  }) => Promise<void>;
  isPublishing: boolean;
}

export default function PublishForm({ stepCount, onPublish, isPublishing }: PublishFormProps) {
  const [articleTitle, setArticleTitle] = useState('');
  const [sectionCategory, setSectionCategory] = useState('');
  const [headingCategory, setHeadingCategory] = useState('');
  const [publishImmediately, setPublishImmediately] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleTitle.trim() || stepCount === 0) return;
    await onPublish({ articleTitle, sectionCategory, headingCategory, publishImmediately });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 rounded-lg border border-border bg-card">
      <h3 className="text-sm font-medium text-foreground">Publish to Contentful</h3>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="articleTitle">Article Title *</Label>
          <Input
            id="articleTitle"
            value={articleTitle}
            onChange={(e) => setArticleTitle(e.target.value)}
            placeholder="e.g. How to Refill the Coffee Hopper"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="sectionCategory">Section Category</Label>
          <Input
            id="sectionCategory"
            value={sectionCategory}
            onChange={(e) => setSectionCategory(e.target.value)}
            placeholder="e.g. Maintenance"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="headingCategory">Heading Category</Label>
          <Input
            id="headingCategory"
            value={headingCategory}
            onChange={(e) => setHeadingCategory(e.target.value)}
            placeholder="e.g. Coffee Machines"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={publishImmediately}
            onChange={(e) => setPublishImmediately(e.target.checked)}
            className="rounded"
          />
          Publish immediately (otherwise saves as draft)
        </label>
      </div>

      <Button
        type="submit"
        disabled={!articleTitle.trim() || stepCount === 0 || isPublishing}
        className="gap-2"
      >
        {isPublishing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Publishing…
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            Publish {stepCount} Step{stepCount !== 1 ? 's' : ''} to Contentful
          </>
        )}
      </Button>
    </form>
  );
}
