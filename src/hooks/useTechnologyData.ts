
import { useState, useEffect } from 'react';
import { fetchTechnologyBySlug } from '@/services/cms/contentTypes/technologies';
import { CMSTechnology } from '@/types/cms';
import { useQuery } from '@tanstack/react-query';

export const useTechnologyData = (slug: string) => {
  const {
    data: technology,
    isLoading,
    isError,
    error
  } = useQuery<CMSTechnology | null, Error>({
    queryKey: ['technology', slug],
    queryFn: () => fetchTechnologyBySlug(slug),
    enabled: !!slug,
  });

  return {
    technology,
    isLoading: isLoading && !!slug,
    isError,
    error,
  };
};
