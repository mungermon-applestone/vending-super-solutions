import { useNavigationContent } from './useNavigationContent';
import { useTranslation } from '@/hooks/useTranslation';

export interface TranslatedNavigationContent {
  products: string;
  machines: string;
  businessGoals: string;
  technology: string;
  blog: string;
  about: string;
  contact: string;
  home: string;
  menu: string;
  language: string;
  loading: string;
  isLoading: boolean;
  hasError: boolean;
}

/**
 * Hook that provides translated navigation content for both CMS and fallback text
 */
export function useTranslatedNavigationContent(): TranslatedNavigationContent {
  const navigationContent = useNavigationContent();
  
  // Translate static navigation items
  const { translated: home } = useTranslation('Home', { context: 'navigation' });
  const { translated: menu } = useTranslation('Menu', { context: 'navigation' });  
  const { translated: language } = useTranslation('Language', { context: 'navigation' });
  const { translated: loading } = useTranslation('Loading...', { context: 'navigation' });
  
  // Translate CMS content
  const { translated: products } = useTranslation(navigationContent.products, { context: 'navigation' });
  const { translated: machines } = useTranslation(navigationContent.machines, { context: 'navigation' });
  const { translated: businessGoals } = useTranslation(navigationContent.businessGoals, { context: 'navigation' });
  const { translated: technology } = useTranslation(navigationContent.technology, { context: 'navigation' });
  const { translated: blog } = useTranslation(navigationContent.blog, { context: 'navigation' });
  const { translated: about } = useTranslation(navigationContent.about, { context: 'navigation' });
  const { translated: contact } = useTranslation(navigationContent.contact, { context: 'navigation' });

  return {
    products,
    machines,
    businessGoals,
    technology,
    blog,
    about,
    contact,
    home,
    menu,
    language,
    loading,
    isLoading: navigationContent.isLoading,
    hasError: navigationContent.hasError
  };
}