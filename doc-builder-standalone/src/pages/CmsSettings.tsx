import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface ConnectionRow {
  id: string;
  name: string;
  space_id: string;
  environment_id: string;
  content_type_id: string;
  title_field: string;
  body_field: string;
  section_field: string | null;
  heading_field: string | null;
  locale: string;
}

const EMPTY = {
  name: '',
  spaceId: '',
  environmentId: 'master',
  contentTypeId: '',
  titleField: 'title',
  bodyField: 'body',
  sectionField: '',
  headingField: '',
  locale: 'en-US',
  managementToken: '',
};

export default function CmsSettings() {
  const [connections, setConnections] = useState<ConnectionRow[]>([]);
  const [form, setForm] = useState({ ...EMPTY });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data, error } = await supabase
      .from('cms_connections')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) toast.error(error.message);
    else setConnections((data ?? []) as ConnectionRow[]);
  };

  useEffect(() => {
    void load();
  }, []);

  const set = (key: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (persist: boolean) => {
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke('test-cms-connection', {
        body: { ...form, connectionId: editingId, persist },
      });
      if (error) throw new Error(error.message);
      if (!data?.ok) throw new Error(data?.message ?? 'Connection test failed');
      toast.success(persist ? 'Connection saved' : data.message);
      if (persist) {
        setForm({ ...EMPTY });
        setEditingId(null);
        await load();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  const edit = (c: ConnectionRow) => {
    setEditingId(c.id);
    setForm({
      name: c.name,
      spaceId: c.space_id,
      environmentId: c.environment_id,
      contentTypeId: c.content_type_id,
      titleField: c.title_field,
      bodyField: c.body_field,
      sectionField: c.section_field ?? '',
      headingField: c.heading_field ?? '',
      locale: c.locale,
      managementToken: '',
    });
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from('cms_connections').delete().eq('id', id);
    if (error) toast.error(error.message);
    else {
      toast.success('Connection removed');
      await load();
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">CMS Connections</h1>
        <p className="text-muted-foreground mt-1">
          Point Doc Builder at your own CMS space. Tokens are stored server-side and never returned to the browser.
        </p>
      </div>

      {connections.length > 0 && (
        <ul className="space-y-2">
          {connections.map((c) => (
            <li key={c.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
              <div>
                <p className="font-medium text-foreground">{c.name}</p>
                <p className="text-sm text-muted-foreground">
                  {c.space_id} / {c.environment_id} · {c.content_type_id}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => edit(c)}>Edit</Button>
                <Button variant="ghost" size="sm" onClick={() => remove(c.id)}>Remove</Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form
        className="space-y-4 rounded-lg border border-border bg-card p-4"
        onSubmit={(e) => {
          e.preventDefault();
          void submit(true);
        }}
      >
        <h2 className="text-sm font-medium text-foreground">
          {editingId ? 'Edit connection' : 'Add a connection'}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="name" label="Display name" value={form.name} onChange={set('name')} required />
          <Field id="spaceId" label="Space ID" value={form.spaceId} onChange={set('spaceId')} required />
          <Field id="environmentId" label="Environment" value={form.environmentId} onChange={set('environmentId')} required />
          <Field id="locale" label="Locale" value={form.locale} onChange={set('locale')} required />
          <Field id="contentTypeId" label="Content type ID" value={form.contentTypeId} onChange={set('contentTypeId')} required />
          <Field id="titleField" label="Title field" value={form.titleField} onChange={set('titleField')} required />
          <Field id="bodyField" label="Body (rich text) field" value={form.bodyField} onChange={set('bodyField')} required />
          <Field id="sectionField" label="Section field (optional)" value={form.sectionField} onChange={set('sectionField')} />
          <Field id="headingField" label="Heading field (optional)" value={form.headingField} onChange={set('headingField')} />
          <Field
            id="managementToken"
            label={editingId ? 'Management token (leave blank to keep)' : 'Management token'}
            type="password"
            value={form.managementToken}
            onChange={set('managementToken')}
            required={!editingId}
          />
        </div>

        <div className="flex gap-2">
          <Button type="button" variant="outline" disabled={busy} onClick={() => void submit(false)}>
            Test connection
          </Button>
          <Button type="submit" disabled={busy}>
            {editingId ? 'Save changes' : 'Save connection'}
          </Button>
          {editingId && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setEditingId(null);
                setForm({ ...EMPTY });
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

function Field({
  id,
  label,
  ...rest
}: { id: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...rest} />
    </div>
  );
}
