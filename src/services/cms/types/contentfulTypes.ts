
/**
 * Types for Contentful content management
 */

export interface ContentTypeField {
  id: string;
  name: string;
  type: string;
  localized?: boolean;
  required?: boolean;
  validations?: any[];
  disabled?: boolean;
  omitted?: boolean;
  linkType?: string;
  items?: {
    type: string;
    linkType?: string;
    validations?: any[];
  };
}

export interface ContentTypeProps {
  id: string;
  name: string;
  description?: string;
  displayField?: string;
  fields: ContentTypeField[];
}
