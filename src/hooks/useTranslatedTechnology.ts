import { useTranslatedCMSContent } from './useTranslatedCMSContent';
import { CMSTechnology } from '@/types/cms';

export const useTranslatedTechnology = (technology: CMSTechnology | null | undefined) => {
  return useTranslatedCMSContent(technology, 'technology');
};