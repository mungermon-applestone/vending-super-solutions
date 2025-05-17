
import { Asset, Entry, EntrySkeletonType } from 'contentful';

/**
 * Type guard to check if an object is a Contentful Asset
 */
export function isContentfulAsset(value: any): value is Asset {
  return (
    value &&
    typeof value === 'object' &&
    'sys' in value &&
    value.sys &&
    value.sys.type === 'Asset' &&
    'fields' in value &&
    value.fields &&
    'file' in value.fields
  );
}

/**
 * Type guard to check if an object is a Contentful Entry
 */
export function isContentfulEntry<T = any>(value: any): value is Entry<T> {
  return (
    value &&
    typeof value === 'object' &&
    'sys' in value &&
    value.sys &&
    value.sys.type === 'Entry' &&
    'fields' in value &&
    !!value.fields
  );
}

/**
 * Safely checks if a field exists and has the expected type
 */
export function hasField<T>(obj: any, fieldName: string, typeCheck: (val: any) => boolean): obj is { fields: { [key: string]: T } } {
  return (
    obj &&
    typeof obj === 'object' &&
    'fields' in obj &&
    obj.fields &&
    typeof obj.fields === 'object' &&
    fieldName in obj.fields &&
    typeCheck(obj.fields[fieldName])
  );
}

/**
 * Type guard to check if value is a string
 */
export const isString = (value: any): value is string => typeof value === 'string';

/**
 * Type guard to check if value is a number
 */
export const isNumber = (value: any): value is number => typeof value === 'number';

/**
 * Type guard to check if value is an array
 */
export const isArray = (value: any): value is any[] => Array.isArray(value);

/**
 * Type guard to check if value is an object
 */
export const isObject = (value: any): value is Record<string, any> => 
  value !== null && typeof value === 'object' && !Array.isArray(value);
