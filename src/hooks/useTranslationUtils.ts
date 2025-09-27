import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from './useTranslation';

/**
 * Utility hooks for common translation patterns
 */

/**
 * Hook for translating form buttons (Submit, Cancel, Save, etc.)
 */
export const useFormButtonTranslations = () => {
  const { translated: submit } = useTranslation("Submit", { context: "form-buttons", fallbackToOriginal: true });
  const { translated: cancel } = useTranslation("Cancel", { context: "form-buttons", fallbackToOriginal: true });
  const { translated: save } = useTranslation("Save", { context: "form-buttons", fallbackToOriginal: true });
  const { translated: delete_ } = useTranslation("Delete", { context: "form-buttons", fallbackToOriginal: true });
  const { translated: edit } = useTranslation("Edit", { context: "form-buttons", fallbackToOriginal: true });
  const { translated: send } = useTranslation("Send", { context: "form-buttons", fallbackToOriginal: true });
  const { translated: loading } = useTranslation("Loading...", { context: "form-buttons", fallbackToOriginal: true });
  const { translated: saving } = useTranslation("Saving...", { context: "form-buttons", fallbackToOriginal: true });
  const { translated: deleting } = useTranslation("Deleting...", { context: "form-buttons", fallbackToOriginal: true });
  const { translated: sending } = useTranslation("Sending...", { context: "form-buttons", fallbackToOriginal: true });

  return {
    submit,
    cancel,
    save,
    delete: delete_,
    edit,
    send,
    loading,
    saving,
    deleting,
    sending
  };
};

/**
 * Hook for translating common UI states
 */
export const useUIStateTranslations = () => {
  const { translated: loading } = useTranslation("Loading", { context: "ui-states", fallbackToOriginal: true });
  const { translated: error } = useTranslation("Error", { context: "ui-states", fallbackToOriginal: true });
  const { translated: success } = useTranslation("Success", { context: "ui-states", fallbackToOriginal: true });
  const { translated: noResults } = useTranslation("No results found", { context: "ui-states", fallbackToOriginal: true });
  const { translated: tryAgain } = useTranslation("Try again", { context: "ui-states", fallbackToOriginal: true });
  const { translated: unknownError } = useTranslation("Unknown error", { context: "ui-states", fallbackToOriginal: true });

  return {
    loading,
    error,
    success,
    noResults,
    tryAgain,
    unknownError
  };
};

/**
 * Hook for translating navigation elements
 */
export const useNavigationTranslations = () => {
  const { translated: home } = useTranslation("Home", { context: "navigation", fallbackToOriginal: true });
  const { translated: about } = useTranslation("About", { context: "navigation", fallbackToOriginal: true });
  const { translated: contact } = useTranslation("Contact", { context: "navigation", fallbackToOriginal: true });
  const { translated: blog } = useTranslation("Blog", { context: "navigation", fallbackToOriginal: true });
  const { translated: products } = useTranslation("Products", { context: "navigation", fallbackToOriginal: true });
  const { translated: machines } = useTranslation("Machines", { context: "navigation", fallbackToOriginal: true });
  const { translated: technology } = useTranslation("Technology", { context: "navigation", fallbackToOriginal: true });
  const { translated: solutions } = useTranslation("Solutions", { context: "navigation", fallbackToOriginal: true });
  const { translated: company } = useTranslation("Company", { context: "navigation", fallbackToOriginal: true });

  return {
    home,
    about,
    contact,
    blog,
    products,
    machines,
    technology,
    solutions,
    company
  };
};

/**
 * Hook to check if we should show translation UI
 */
export const useTranslationUI = () => {
  const { currentLanguage } = useLanguage();
  
  return {
    showLanguageSelector: true,
    showTranslationDisclaimer: currentLanguage !== 'en',
    isTranslating: currentLanguage !== 'en'
  };
};