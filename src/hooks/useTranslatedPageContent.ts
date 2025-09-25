import { useTranslatedCMSContent } from './useTranslatedCMSContent';

export const useTranslatedMachinesPageContent = (pageContent: any) => {
  return useTranslatedCMSContent(pageContent, 'machines-page');
};

export const useTranslatedProductsPageContent = (pageContent: any) => {
  return useTranslatedCMSContent(pageContent, 'products-page');
};