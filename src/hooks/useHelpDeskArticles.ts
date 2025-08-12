import { useQuery } from "@tanstack/react-query";
import { contentfulHelpDeskArticleAdapter, ContentfulHelpDeskArticle } from "@/services/cms/adapters/helpDeskArticles/contentfulHelpDeskArticleAdapter";
import { toast } from "sonner";

interface UseHelpDeskArticlesOptions {
  enableToasts?: boolean;
}

export function useHelpDeskArticles(options: UseHelpDeskArticlesOptions = {}) {
  const { enableToasts = false } = options;

  return useQuery({
    queryKey: ["help-desk-articles"],
    queryFn: async () => {
      console.log('[useHelpDeskArticles] Fetching all articles');
      return await contentfulHelpDeskArticleAdapter.getAll();
    },
    retry: 1,
    retryDelay: 1000,
    meta: {
      onError: (error: Error) => {
        if (enableToasts) {
          toast.error(`Error loading help articles: ${error.message}`);
        }
        console.error('[useHelpDeskArticles] Error:', error);
      }
    }
  });
}

export function useHelpDeskArticlesByCategory(options: UseHelpDeskArticlesOptions = {}) {
  const { enableToasts = false } = options;

  return useQuery({
    queryKey: ["help-desk-articles-by-category"],
    queryFn: async () => {
      console.log('[useHelpDeskArticlesByCategory] Fetching articles grouped by category');
      return await contentfulHelpDeskArticleAdapter.getByCategory();
    },
    retry: 1,
    retryDelay: 1000,
    meta: {
      onError: (error: Error) => {
        if (enableToasts) {
          toast.error(`Error loading help articles: ${error.message}`);
        }
        console.error('[useHelpDeskArticlesByCategory] Error:', error);
      }
    }
  });
}

export function useHelpDeskArticleBySlug(slug: string | undefined, options: UseHelpDeskArticlesOptions = {}) {
  const { enableToasts = false } = options;

  return useQuery({
    queryKey: ["help-desk-article", slug],
    enabled: !!slug,
    queryFn: async () => {
      console.log('[useHelpDeskArticleBySlug] Fetching article with slug:', slug);
      
      if (!slug) throw new Error("No slug provided");
      
      const article = await contentfulHelpDeskArticleAdapter.getBySlug(slug);
      
      if (!article) {
        throw new Error(`Help desk article not found for slug: ${slug}`);
      }
      
      return article;
    },
    retry: 1,
    retryDelay: 1000,
    meta: {
      onError: (error: Error) => {
        if (enableToasts) {
          toast.error(`Error loading help article: ${error.message}`);
        }
        console.error('[useHelpDeskArticleBySlug] Error:', error);
      }
    }
  });
}