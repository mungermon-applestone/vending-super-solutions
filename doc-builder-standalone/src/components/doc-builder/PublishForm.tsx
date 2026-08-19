import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Loader2 } from 'lucide-react';

interface ConnectionOption {
  id: string;
  name: string;
  section_field: string | null;
  heading_field: string | null;
}

interface PublishFormProps {
  stepCount: number;
  onPublish: (data: {
    connectionId: string;
    articleTitle: string;
    section: string;
    heading: string;
    publishImmediately: boolean;
  }) => Promise<void>;
  isPublishing: boolean;
}

export default function PublishForm({ stepCount, onPublish, isPublishing }: PublishFormProps) {
  const [connections, setConnections] = useState<ConnectionOption[]>([]);
  const [connectionId, setConnectionId] = useState('');
  const [articleTitle, setArticleTitle] = useState('');
  const [section, setSection] = useState('');
  const [heading, setHeading] = useState('');
  const [publishImmediately, setPublishImmediately] = useState(false);

  useEffect(() => {
    void (async () => {
      const { data } = await supabase
        .from('cms_connections')
        .select('id, name, section_field, heading_field')
        .order('created_at', { ascending: false });
      const rows = (data ?? []) as ConnectionOption[];
      setConnections(rows);
      if (rows.length === 1) setConnectionId(rows[0].id);
    })();
  }, []);

  const selected = connections.find((c) => c.id === connectionId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleTitle.trim() || !connectionId || stepCount === 0) return;
    await onPublish({ connectionId, articleTitle, section, heading, publishImmediately });
  };

  if (connections.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
        No CMS connection yet.{' '}
        <Link to="/settings/cms" className="text-primary underline">
          Add one in settings
        </Link>{' '}
        to publish your captures.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-medium text-foreground">Publish article</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="connection">Destination</Label>
          <Select value={connectionId} onValueChange={setConnectionId}>
            <SelectTrigger id="connection">
              <SelectValue placeholder="Choose a CMS connection" />
            </SelectTrigger>
            <SelectContent>
              {connections.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="articleTitle">Article title *</Label>
          <Input
            id="articleTitle"
            value={articleTitle}
            onChange={(e) => setArticleTitle(e.target.value)}
            placeholder="e.g. How to reset a device"
            required
          />
        </div>

        {selected?.section_field && (
          <div className="space-y-1.5">
            <Label htmlFor="section">Section</Label>
            <Input id="section" value={section} onChange={(e) => setSection(e.target.value)} />
          </div>
        )}

        {selected?.heading_field && (
          <div className="space-y-1.5">
            <Label htmlFor="heading">Heading</Label>
            <Input id="heading" value={heading} onChange={(e) => setHeading(e.target.value)} />
          </div>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          checked={publishImmediately}
          onChange={(e) => setPublishImmediately(e.target.checked)}
          className="h-4 w-4 rounded border-border"
        />
        Publish immediately (otherwise saved as a draft)
      </label>

      <Button type="submit" disabled={isPublishing || stepCount === 0 || !connectionId}>
        {isPublishing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing…
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" /> Publish {stepCount} step{stepCount === 1 ? '' : 's'}
          </>
        )}
      </Button>
    </form>
  );
}
