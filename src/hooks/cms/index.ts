
import { useProductTypes, useProductType } from './useProductTypes';
import { useBusinessGoals } from './useBusinessGoals';
import { useBusinessGoal } from './useBusinessGoal';
import { useMachines, useMachine } from './useMachines';
import { useTechnologies, useTechnology } from './useTechnologies';
import { useTestimonials } from './useTestimonials';
import { useTestimonialSection } from './useTestimonialSection';
import { useHeroSlides } from './useHeroSlides';
import { useHomePageContent } from '@/hooks/useHomePageContent'; // Import the hook
import { useHelpDeskArticles, useHelpDeskArticlesByCategory, useHelpDeskArticleBySlug } from '@/hooks/useHelpDeskArticles';
import { useTranslatedNavigationContent } from './useTranslatedNavigationContent';
import { useTranslatedCMSContent, useTranslatedHeroSlide, useTranslatedFeatures } from '@/hooks/useTranslatedCMSContent';

export {
  useProductTypes, 
  useProductType,
  useBusinessGoals,
  useBusinessGoal,
  useMachines,
  useMachine,
  useTechnologies,
  useTechnology,
  useTestimonials,
  useTestimonialSection,
  useHeroSlides,
  useHomePageContent, // Export the hook
  useHelpDeskArticles,
  useHelpDeskArticlesByCategory,
  useHelpDeskArticleBySlug,
  useTranslatedNavigationContent,
  useTranslatedCMSContent,
  useTranslatedHeroSlide,
  useTranslatedFeatures
};
