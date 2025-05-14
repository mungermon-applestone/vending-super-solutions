
/**
 * Safe conversion of any value to string
 */
export function safeString(value: any, fallback: string = ''): string {
  if (value === null || value === undefined) return fallback;
  return String(value);
}

/**
 * Safe conversion of any value to number
 */
export function safeNumber(value: any, fallback: number = 0): number {
  if (value === null || value === undefined) return fallback;
  const num = Number(value);
  return isNaN(num) ? fallback : num;
}

/**
 * Safe conversion of any value to boolean
 */
export function safeBoolean(value: any, fallback: boolean = false): boolean {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || value === '1';
  }
  if (typeof value === 'number') return value !== 0;
  return Boolean(value);
}

/**
 * Safe conversion of any value to array
 */
export function safeArray<T>(value: any, mapper?: (item: any) => T): T[] {
  if (!value) return [];
  if (!Array.isArray(value)) return [];
  
  if (mapper) {
    return value.map(mapper).filter(Boolean);
  }
  
  return value;
}

/**
 * Safe access to an array field in an object
 */
export function safeArrayField(obj: any, fieldName: string): any[] {
  if (!obj || !obj.fields || !Array.isArray(obj.fields[fieldName])) {
    return [];
  }
  return obj.fields[fieldName];
}

/**
 * Convert a Contentful asset to a CMS image object
 */
export function safeAssetToImage(asset: any) {
  if (!asset || !asset.fields || !asset.fields.file) {
    return null;
  }
  
  try {
    return {
      id: asset.sys?.id || '',
      url: `https:${asset.fields.file.url}`,
      alt: asset.fields.title || '',
      width: asset.fields.file.details?.image?.width,
      height: asset.fields.file.details?.image?.height
    };
  } catch (error) {
    console.error('Error converting asset to image:', error);
    return null;
  }
}

/**
 * Safe access to an object's property
 */
export function safeObjectProperty<T>(obj: any, path: string, defaultValue: T): T {
  if (!obj) return defaultValue;
  
  const parts = path.split('.');
  let current = obj;
  
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return defaultValue;
    }
    current = current[part];
  }
  
  return (current === undefined || current === null) ? defaultValue : current as T;
}

/**
 * Safe conversion of Contentful fields
 */
export function safeContentfulField<T>(
  entry: any, 
  fieldName: string, 
  transformer: (value: any) => T,
  defaultValue: T
): T {
  if (!entry || !entry.fields || entry.fields[fieldName] === undefined) {
    return defaultValue;
  }
  
  try {
    return transformer(entry.fields[fieldName]);
  } catch (error) {
    console.warn(`Error transforming Contentful field ${fieldName}:`, error);
    return defaultValue;
  }
}
