import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useState } from 'react';

export function ContentfulExportButton() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      console.log('[ContentfulExportButton] Starting export...');

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('You must be logged in to export content');
        return;
      }

      console.log('[ContentfulExportButton] Calling edge function...');
      
      const { data, error } = await supabase.functions.invoke('export-contentful-xml', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('[ContentfulExportButton] Error:', error);
        toast.error('Failed to export content: ' + error.message);
        return;
      }

      // The edge function returns XML as text
      console.log('[ContentfulExportButton] Export successful, downloading file...');
      
      // Create blob and download
      const blob = new Blob([data], { type: 'application/xml' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contentful-export-${new Date().toISOString().split('T')[0]}.xml`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Content exported successfully');
      
    } catch (error) {
      console.error('[ContentfulExportButton] Unexpected error:', error);
      toast.error('Failed to export content');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting}
      variant="outline"
      className="gap-2"
    >
      <Download className="h-4 w-4" />
      {isExporting ? 'Exporting...' : 'Export All Content (XML)'}
    </Button>
  );
}
