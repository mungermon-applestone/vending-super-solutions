import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { contentfulHelpDeskArticleAdapter, type ContentfulHelpDeskArticle } from '@/services/cms/adapters/helpDeskArticles/contentfulHelpDeskArticleAdapter';

// ── Rich Text → Markdown ──
function richTextToMarkdown(node: any, depth = 0): string {
  if (!node) return '';
  if (Array.isArray(node)) return node.map(n => richTextToMarkdown(n, depth)).join('');

  const children = () => (node.content ? richTextToMarkdown(node.content, depth) : '');

  switch (node.nodeType) {
    case 'document':
      return children();
    case 'paragraph':
      return `${children()}\n\n`;
    case 'heading-1': return `# ${children()}\n\n`;
    case 'heading-2': return `## ${children()}\n\n`;
    case 'heading-3': return `### ${children()}\n\n`;
    case 'heading-4': return `#### ${children()}\n\n`;
    case 'heading-5': return `##### ${children()}\n\n`;
    case 'heading-6': return `###### ${children()}\n\n`;
    case 'unordered-list':
      return (node.content || []).map((li: any) => `- ${richTextToMarkdown(li.content, depth + 1).trim()}\n`).join('') + '\n';
    case 'ordered-list':
      return (node.content || []).map((li: any, i: number) => `${i + 1}. ${richTextToMarkdown(li.content, depth + 1).trim()}\n`).join('') + '\n';
    case 'list-item':
      return children();
    case 'blockquote':
      return `> ${children().trim()}\n\n`;
    case 'hr':
      return `---\n\n`;
    case 'hyperlink':
      return `[${children()}](${node.data?.uri ?? ''})`;
    case 'embedded-asset-block': {
      const asset = node.data?.target;
      const url = asset?.fields?.file?.url;
      const title = asset?.fields?.title ?? 'image';
      return url ? `![${title}](https:${url})\n\n` : '';
    }
    case 'embedded-entry-block':
    case 'embedded-entry-inline':
      return `[embedded entry: ${node.data?.target?.sys?.id ?? 'unknown'}]`;
    case 'text': {
      let text: string = node.value ?? '';
      for (const mark of node.marks ?? []) {
        if (mark.type === 'bold') text = `**${text}**`;
        else if (mark.type === 'italic') text = `*${text}*`;
        else if (mark.type === 'code') text = `\`${text}\``;
        else if (mark.type === 'underline') text = `<u>${text}</u>`;
      }
      return text;
    }
    default:
      return children();
  }
}

function articlesToMarkdown(articles: ContentfulHelpDeskArticle[]): string {
  const header = `# Help Desk Articles Export\n\nExported: ${new Date().toISOString()}\nTotal articles: ${articles.length}\n\n---\n\n`;
  const body = articles.map(a => {
    const f = a.fields;
    return [
      `## ${f.articleTitle || '(untitled)'}`,
      ``,
      `- **ID:** ${a.sys.id}`,
      `- **Section:** ${f.sectionCategory || '(none)'}`,
      `- **Heading:** ${f.headingCategory || '(none)'}`,
      `- **Order:** ${f.orderWithinSection ?? '(none)'}`,
      `- **Updated:** ${a.sys.updatedAt}`,
      ``,
      richTextToMarkdown(f.articleContent).trim() || '_(no content)_',
      ``,
      `---`,
      ``,
    ].join('\n');
  }).join('\n');
  return header + body;
}

function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function LoginGate() {
  const { signIn, signInWithGoogle, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await signIn(email, password); } catch { /* toast handled */ }
  };

  return (
    <div className="container mx-auto py-16 px-4 max-w-md">
      <h1 className="text-2xl font-bold text-foreground mb-2">Export Help Desk Articles</h1>
      <p className="text-muted-foreground mb-6">Sign in with your admin account to continue.</p>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => signInWithGoogle()}
        disabled={isLoading}
      >
        Continue with Google
      </Button>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">or</span>
        </div>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Signing in…' : 'Sign In'}
        </Button>
      </form>
    </div>
  );
}


export default function ExportHelpDeskArticles() {
  const { session } = useAuth();
  const [loading, setLoading] = useState<'md' | 'json' | null>(null);
  const [count, setCount] = useState<number | null>(null);

  if (!session) return <LoginGate />;

  const fetchArticles = async () => {
    const articles = await contentfulHelpDeskArticleAdapter.getAll();
    setCount(articles.length);
    return articles;
  };

  const handleMarkdown = async () => {
    setLoading('md');
    try {
      const articles = await fetchArticles();
      const md = articlesToMarkdown(articles);
      const stamp = new Date().toISOString().slice(0, 10);
      download(`help-desk-articles-${stamp}.md`, md, 'text/markdown');
      toast.success(`Exported ${articles.length} articles as Markdown`);
    } catch (err) {
      console.error(err);
      toast.error('Export failed. Check console for details.');
    } finally {
      setLoading(null);
    }
  };

  const handleJson = async () => {
    setLoading('json');
    try {
      const articles = await fetchArticles();
      const payload = {
        exportedAt: new Date().toISOString(),
        count: articles.length,
        articles,
      };
      const stamp = new Date().toISOString().slice(0, 10);
      download(`help-desk-articles-${stamp}.json`, JSON.stringify(payload, null, 2), 'application/json');
      toast.success(`Exported ${articles.length} articles as JSON`);
    } catch (err) {
      console.error(err);
      toast.error('Export failed. Check console for details.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold text-foreground mb-2">Export Help Desk Articles</h1>
      <p className="text-muted-foreground mb-8">
        Download every published Help Desk Article from Contentful for offline review or AI-assisted gap analysis.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Markdown</CardTitle>
            <CardDescription>
              Human/AI-readable. Best for pasting into Claude, ChatGPT, or Gemini.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleMarkdown} disabled={loading !== null} className="w-full">
              {loading === 'md' ? 'Exporting…' : 'Download .md'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>JSON</CardTitle>
            <CardDescription>
              Full structured dump (all fields, IDs, timestamps). Best for scripting.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleJson} disabled={loading !== null} variant="secondary" className="w-full">
              {loading === 'json' ? 'Exporting…' : 'Download .json'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {count !== null && (
        <p className="text-sm text-muted-foreground mt-6">Last export: {count} articles.</p>
      )}

      <Card className="mt-10">
        <CardHeader>
          <CardTitle>Suggested AI workflow</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>1. Download the Markdown file above.</p>
          <p>2. In Claude or ChatGPT, attach the file plus a description (or screenshots) of your current app.</p>
          <p>3. Prompt: <em>"Compare the documented features to the actual feature list. Produce a table of: (1) documented but removed/changed, (2) undocumented features needing new articles, (3) articles needing updates."</em></p>
        </CardContent>
      </Card>
    </div>
  );
}
