import { useTranslatedCMSContent } from './useTranslatedCMSContent';
import { CMSMachine } from '@/types/cms';

export const useTranslatedMachine = (machine: CMSMachine | null | undefined) => {
  return useTranslatedCMSContent(machine, 'machine');
};