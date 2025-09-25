import { useTranslatedCMSContent } from './useTranslatedCMSContent';
import { CMSBusinessGoal } from '@/types/cms';

export const useTranslatedBusinessGoal = (businessGoal: CMSBusinessGoal | null | undefined) => {
  return useTranslatedCMSContent(businessGoal, 'business-goal');
};