
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUploadMedia } from '@/hooks/useMediaData';

interface MediaUploadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const MediaUploadDialog: React.FC<MediaUploadDialogProps> = ({ 
  isOpen, 
  onOpenChange 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [altText, setAltText] = useState('');
  const [description, setDescription] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const { toast } = useToast();
  const uploadMediaMutation = useUploadMedia();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processSelectedFile(file);
    }
  };
  
  const processSelectedFile = (file: File) => {
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Maximum file size is 5MB',
        variant: 'destructive',
      });
      return;
    }
    
    setSelectedFile(file);
    setTitle(file.name);
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };
  
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      await uploadMediaMutation.mutateAsync({
        file: selectedFile,
        title,
        alt_text: altText,
        description
      });
      
      toast({
        title: 'Media uploaded successfully',
        description: `${selectedFile.name} has been uploaded to your media library.`,
      });
      
      // Reset form and close dialog
      handleReset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error uploading media:', error);
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your file. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const handleReset = () => {
    setSelectedFile(null);
    setTitle('');
    setAltText('');
    setDescription('');
    setPreview(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Media</DialogTitle>
        </DialogHeader>
        
        {/* File Selection Area */}
        {!selectedFile ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              dragActive ? 'border-primary bg-muted/20' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center space-y-2">
              <Upload className="h-10 w-10 text-gray-400" />
              <p className="text-sm text-gray-600">
                Drag and drop your file here, or{' '}
                <label className="text-primary hover:text-primary/80 cursor-pointer">
                  browse
                  <Input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                  />
                </label>
              </p>
              <p className="text-xs text-gray-400">
                Max file size: 5MB
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* File Preview */}
            <div className="relative border rounded-md p-2">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full"
                onClick={handleReset}
              >
                <X className="h-4 w-4" />
              </Button>

              {preview ? (
                <div className="flex justify-center">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-40 max-w-full object-contain"
                  />
                </div>
              ) : (
                <div className="flex items-center space-x-2 p-2">
                  <div className="bg-gray-100 p-2 rounded">
                    <Upload className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="text-sm truncate max-w-[250px]">
                    {selectedFile.name}
                  </div>
                </div>
              )}
            </div>

            {/* File Metadata */}
            <div className="space-y-3">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="alt-text">Alt Text</Label>
                <Input
                  id="alt-text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Describe the image for accessibility"
                />
              </div>
              
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>
        )}
        
        <DialogFooter className="sm:justify-between">
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </DialogClose>
          
          <Button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || uploadMediaMutation.isPending}
          >
            {uploadMediaMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MediaUploadDialog;
