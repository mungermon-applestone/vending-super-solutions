import { useTranslatedCMSContent } from './useTranslatedCMSContent';

export const useTranslatedMachinesPageContent = (pageContent: any) => {
  return useTranslatedCMSContent(pageContent, 'machines-page');
};

export const useTranslatedProductsPageContent = (pageContent: any) => {
  return useTranslatedCMSContent(pageContent, 'products-page');
};

export const useTranslatedBusinessGoalsPageContent = (pageContent: any) => {
  return useTranslatedCMSContent(pageContent, 'business-goals-page');
};