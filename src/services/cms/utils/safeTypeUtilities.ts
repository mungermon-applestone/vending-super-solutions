
/**
 * Safely convert any value to a string
 */
export function safeString(value: any): string {
  if (value === null || value === undefined) return '';
  return String(value);
}

/**
 * Safely extract a field from a Contentful entry fields
 */
export function safeField<T>(fields: any, fieldName: string, defaultValue: T): T {
  if (!fields || typeof fields !== 'object') return defaultValue;
  if (!(fieldName in fields) || fields[fieldName] === undefined || fields[fieldName] === null) {
    return defaultValue;
  }
  return fields[fieldName] as T;
}

/**
 * Safely extract an array field from Contentful
 */
export function safeArrayField<T>(fields: any, fieldName: string): T[] {
  const field = safeField<any>(fields, fieldName, null);
  if (!field || !Array.isArray(field)) return [];
  return field as T[];
}

/**
 * Safely extract a URL from a Contentful asset
 */
export function safeAssetUrl(asset: any): string {
  if (!asset) return '';
  if (asset && asset.fields && asset.fields.file && asset.fields.file.url) {
    const url = asset.fields.file.url;
    return url.startsWith('//') ? `https:${url}` : url;
  }
  return '';
}

/**
 * Safely extract an image object from a Contentful asset
 */
export function safeAssetToImage(asset: any): { url: string; alt: string; width?: number; height?: number } | null {
  if (!asset) return null;
  
  if (asset && asset.fields && asset.fields.file && asset.fields.file.url) {
    const url = asset.fields.file.url.startsWith('//') ? 
      `https:${asset.fields.file.url}` : asset.fields.file.url;
    
    return {
      url,
      alt: safeString(asset.fields.title) || '',
      width: asset.fields.file.details?.image?.width,
      height: asset.fields.file.details?.image?.height
    };
  }
  
  return null;
}

/**
 * Safely convert a Contentful rich text document to a string summary
 */
export function safeRichTextToString(richText: any): string {
  if (!richText) return '';
  
  try {
    // Handle nested content structure
    if (richText.content && Array.isArray(richText.content)) {
      return richText.content
        .map((block: any) => {
          if (block.content && Array.isArray(block.content)) {
            return block.content
              .map((item: any) => item.value || '')
              .filter(Boolean)
              .join(' ');
          }
          return block.value || '';
        })
        .filter(Boolean)
        .join(' ')
        .trim();
    }
    
    // Return empty string for invalid format
    return '';
  } catch (error) {
    console.error('Error converting rich text to string:', error);
    return '';
  }
}

/**
 * Type guard for arrays
 */
export function isArray<T>(value: any): value is T[] {
  return Array.isArray(value);
}

/**
 * Safely get an array from any value
 */
export function ensureArray<T>(value: any): T[] {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];
  return [value] as T[];
}
