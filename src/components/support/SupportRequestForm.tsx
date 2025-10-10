/**
 * PRESERVED AS FALLBACK OPTION
 * 
 * This component is currently not in use but has been preserved
 * as a fallback option in case we need to revert from the Jira
 * Service Desk widget integration.
 * 
 * To re-enable: Replace JiraWidget with SupportRequestForm in
 * src/pages/CustomerSupportTicket.tsx
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Check, Upload, X, FileText } from 'lucide-react';
import { trackEvent } from '@/utils/analytics';
import { supabase } from "@/integrations/supabase/client";
import { Spinner } from '@/components/ui/spinner';
import { fileToBase64, formatFileSize, getAllowedTypesDisplay, type FileUploadResult } from '@/utils/fileUpload';

export interface SupportRequestFormProps {
  /** Form title */
  formTitle?: string;
  /** Additional context about where the form is being submitted from */
  context?: {
    articleTitle?: string;
    articleSlug?: string;
    pageUrl?: string;
    customerPortal?: boolean;
  };
  /** Callback function when form is submitted successfully */
  onSuccess?: () => void;
  /** Additional CSS classes */
  className?: string;
}

interface AttachedFile {
  fileName: string;
  fileSize: number;
  fileType: string;
  base64Data: string;
}

/**
 * SupportRequestForm Component
 * 
 * A specialized form for submitting support requests with file attachments,
 * designed for use in Knowledge Base articles and other support contexts.
 */
const SupportRequestForm: React.FC<SupportRequestFormProps> = ({
  formTitle = "Submit a Support Request",
  context,
  onSuccess,
  className = ""
}) => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      const result: FileUploadResult = await fileToBase64(file);
      
      if (result.success && result.data) {
        setAttachedFile(result.data);
        toast({
          title: "File attached successfully",
          description: `${result.data.fileName} (${formatFileSize(result.data.fileSize)})`,
        });
      } else {
        toast({
          title: "File upload failed",
          description: result.error || "Unable to process the file",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "File upload failed",
        description: "An unexpected error occurred while processing the file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset the input so the same file can be selected again if needed
      event.target.value = '';
    }
  };

  const removeAttachment = () => {
    setAttachedFile(null);
    toast({
      title: "Attachment removed",
      description: "File has been removed from your support request",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !description.trim()) {
      toast({
        title: "Required fields missing",
        description: "Please fill in both subject and description fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Track form submission attempt
      trackEvent('form_submit', {
        form_type: 'Support Request',
        has_attachment: !!attachedFile,
        context: context?.articleSlug || 'unknown'
      });

      const formData = {
        subject: subject.trim(),
        description: description.trim(),
        email: email.trim() || 'Not provided',
        context,
        attachment: attachedFile
      };
      
      // Call the support request Edge Function
      const { data, error } = await supabase.functions.invoke('send-support-request', {
        body: formData
      });
      
      if (error || (data && !data.success)) {
        console.error('Error submitting support request:', error || data.error);
        
        // Log available request types if provided
        if (data?.requestTypes) {
          console.log('Available Jira request types:', data.requestTypes);
        }
        
        // Track submission error
        trackEvent('form_submit_error', {
          form_type: 'Support Request',
          error_type: 'api_error',
          context: context?.articleSlug || 'unknown'
        });
        
        // Check for specific Jira 400 error about request type
        const errorMessage = data?.error || '';
        const isRequestTypeError = errorMessage.includes('request type') || errorMessage.includes('requestTypeNotFound');
        
        toast({
          title: "Submission failed",
          description: isRequestTypeError 
            ? "There was a configuration issue with the support system. Please check the console for available request types."
            : errorMessage || "Unable to submit your support request. Please try again or contact us directly.",
          variant: "destructive",
        });
        return;
      }

      // Track successful submission
      trackEvent('form_submit_success', {
        form_type: 'Support Request',
        has_attachment: !!attachedFile,
        context: context?.articleSlug || 'unknown'
      });

      setSubmitted(true);
      
      // Show success toast
      toast({
        title: "Support request submitted",
        description: "We've received your request and will respond as soon as possible via email.",
      });

      if (onSuccess) {
        onSuccess();
      }

    } catch (error) {
      console.error('Support form submission error:', error);
      
      trackEvent('form_submit_error', {
        form_type: 'Support Request',
        error_type: 'network_error',
        context: context?.articleSlug || 'unknown'
      });
      
      toast({
        title: "Submission failed",
        description: "A network error occurred. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setSubject('');
    setDescription('');
    setEmail('');
    setAttachedFile(null);
  };

  if (submitted) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Support Request Submitted</h3>
            <p className="text-muted-foreground mt-2">
              Thank you for your support request. We've received your message and will respond to your email as soon as possible.
            </p>
            {context?.articleTitle && (
              <p className="text-sm text-muted-foreground mt-2">
                Request submitted from: <span className="font-medium">{context.articleTitle}</span>
              </p>
            )}
          </div>
          <Button onClick={handleReset} variant="outline">
            Submit Another Request
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h3 className="text-lg font-semibold">{formTitle}</h3>
        <p className="text-muted-foreground text-sm mt-1">
          Need help? Submit a support request and we'll get back to you as soon as possible.
        </p>
        {context?.articleTitle && (
          <p className="text-xs text-muted-foreground mt-1">
            Regarding: <span className="font-medium">{context.articleTitle}</span>
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="subject">Subject *</Label>
          <Input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Brief description of your issue"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Request Description *</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please provide detailed information about your issue or question..."
            className="min-h-[100px]"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Your Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com (optional but recommended)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="attachment">Attachment (optional)</Label>
          <div className="space-y-2">
            {!attachedFile ? (
              <div className="flex items-center space-x-2">
                <Input
                  id="attachment"
                  type="file"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="flex-1"
                />
                {isUploading && <Spinner className="h-4 w-4" />}
              </div>
            ) : (
              <div className="flex items-center space-x-2 p-3 bg-muted rounded-md">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{attachedFile.fileName}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(attachedFile.fileSize)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeAttachment}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Supported file types: {getAllowedTypesDisplay()}. Max file size: 10MB.
            </p>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting || isUploading}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Spinner className="h-4 w-4 mr-2" />
              Submitting Request...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Submit Support Request
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default SupportRequestForm;