
import { ContentTypeProps } from '@/services/cms/types/contentfulTypes';

export interface ContentTypeTemplate {
  id: string;
  name: string;
  description: string;
  contentType: ContentTypeProps;
}

export interface ContentTypeCreatorResult {
  success?: boolean;
  message?: string;
  contentTypeId?: string;
}
