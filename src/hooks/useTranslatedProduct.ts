import { useTranslatedCMSContent } from './useTranslatedCMSContent';
import { CMSProductType } from '@/types/cms';

export const useTranslatedProduct = (product: CMSProductType | null | undefined) => {
  return useTranslatedCMSContent(product, 'product');
};