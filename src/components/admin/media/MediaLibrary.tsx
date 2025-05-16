
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Upload, Search, RefreshCw } from 'lucide-react';
import { useMediaFiles } from '@/hooks/useMediaData';
import MediaGrid from './MediaGrid';
import MediaUploadDialog from './MediaUploadDialog';
import { MediaFiltersParams } from '@/types/media';

interface MediaLibraryProps {
  selectable?: boolean;
  onSelectMedia?: (mediaId: string, url: string) => void;
  selectedMediaIds?: string[];
}

const MediaLibrary: React.FC<MediaLibraryProps> = ({
  selectable = false,
  onSelectMedia,
  selectedMediaIds = []
}) => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [filters, setFilters] = useState<MediaFiltersParams>({});
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch media with current filters
  const { data: mediaFiles = [], isLoading, refetch } = useMediaFiles(filters);
  
  const handleFilterChange = (type: string | undefined) => {
    setFilters(prev => ({
      ...prev,
      file_type: type === 'all' ? undefined : type
    }));
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({
      ...prev,
      search: searchQuery || undefined
    }));
  };
  
  const handleSelectMedia = (media: any) => {
    if (onSelectMedia) {
      const publicUrl = `https://eyxlqcavscrthjkonght.supabase.co/storage/v1/object/public/cms_media/${media.storage_path}`;
      onSelectMedia(media.id, publicUrl);
    }
  };
  
  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2 justify-between">
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsUploadOpen(true)}
            className="whitespace-nowrap"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          
          <Button 
            variant="outline"
            size="icon"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-1 max-w-md gap-2">
          <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"/>
              <Input
                type="search"
                placeholder="Search media..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
          
          <Select onValueChange={handleFilterChange} defaultValue="all">
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="image/">Images</SelectItem>
              <SelectItem value="video/">Videos</SelectItem>
              <SelectItem value="application/">Documents</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Media Grid */}
      <MediaGrid 
        media={mediaFiles} 
        isLoading={isLoading}
        selectable={selectable}
        selectedMedia={selectedMediaIds}
        onSelectMedia={handleSelectMedia}
      />
      
      {/* Upload Dialog */}
      <MediaUploadDialog 
        isOpen={isUploadOpen} 
        onOpenChange={setIsUploadOpen} 
      />
    </div>
  );
};

export default MediaLibrary;
