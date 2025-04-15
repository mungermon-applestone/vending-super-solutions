
/**
 * Contentful field types
 */
export type ContentfulFieldType = 
  | 'Symbol'        // Short text (< 256 characters)
  | 'Text'          // Long text
  | 'Integer'       // Integer number
  | 'Number'        // Decimal number
  | 'Date'          // Date
  | 'Location'      // Location (latitude and longitude)
  | 'Boolean'       // True/false
  | 'Object'        // JSON object
  | 'RichText'      // Rich text
  | 'Link'          // Link to an entry or asset
  | 'Array'         // Array of values
  | 'Symbol[]'      // Array of short text values
  | 'Link[]';       // Array of links

/**
 * Contentful link types
 */
export type ContentfulLinkType = 'Asset' | 'Entry';

/**
 * Options for validations on Contentful fields
 */
export interface ValidationOptions {
  linkContentType?: string[];
  in?: string[];
  linkMimetypeGroup?: string[];
  message?: string;
  size?: {
    min?: number;
    max?: number;
  };
  regexp?: {
    pattern: string;
    flags?: string;
  };
  unique?: boolean;
  [key: string]: any;
}

/**
 * Interface for defining a Contentful field
 */
export interface FieldProps {
  id: string;
  name: string;
  type: ContentfulFieldType;
  required: boolean; // Changed from optional to required to match Contentful SDK
  localized: boolean; // Changed from optional to required to match Contentful SDK
  disabled?: boolean;
  omitted?: boolean;
  linkType?: ContentfulLinkType;
  items?: {
    type: 'Symbol' | 'Link';
    linkType?: ContentfulLinkType;
    validations?: ValidationOptions[];
  };
  validations?: ValidationOptions[];
}

/**
 * Interface for defining a Contentful content type
 */
export interface ContentTypeProps {
  id: string;
  name: string;
  description?: string;
  displayField: string;
  fields: FieldProps[];
  publish?: boolean;
}

/**
 * Response type for content type operations
 */
export interface ContentfulContentTypeResponse {
  success: boolean;
  message: string;
  contentType?: any;
  error?: any;
}
