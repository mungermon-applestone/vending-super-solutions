
/**
 * Contentful management API type definitions
 */

export interface ContentFieldValidation {
  unique?: boolean;
  regexp?: {
    pattern: string;
    flags: string;
  };
  message?: string;
  size?: {
    min?: number;
    max?: number;
  };
  in?: string[];
  linkContentType?: string[];
  linkMimetypeGroup?: string[];
}

export interface ContentFieldItem {
  type: string;
  validations?: ContentFieldValidation[];
  linkType?: string;
}

export interface ContentFieldProps {
  id: string;
  name: string;
  type: string;
  required: boolean;
  localized: boolean;
  validations?: ContentFieldValidation[];
  items?: ContentFieldItem;
  linkType?: string;
}

export interface ContentTypeProps {
  id: string;
  name: string;
  description: string;
  displayField: string;
  fields: ContentFieldProps[];
  publish?: boolean; // Make publish optional
}

export interface ContentTypeTemplate {
  id: string;
  name: string;
  description: string;
  contentType: ContentTypeProps;
}
