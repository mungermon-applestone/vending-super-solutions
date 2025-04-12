
import { ContentTypeOperations } from '../types';
import { LandingPage } from '@/types/landingPage';
import { 
  fetchLandingPages, 
  fetchLandingPageByKey, 
  createLandingPage, 
  updateLandingPage, 
  deleteLandingPage 
} from './index';

export const landingPageOperations: ContentTypeOperations<LandingPage> = {
  fetchAll: async (options) => {
    const pages = await fetchLandingPages();
    return pages;
  },
  
  fetchBySlug: async (key: string) => {
    return await fetchLandingPageByKey(key);
  },
  
  fetchById: async (id: string) => {
    const allPages = await fetchLandingPages();
    return allPages.find(page => page.id === id) || null;
  },
  
  create: async (data) => {
    return await createLandingPage(data);
  },
  
  update: async (id, data) => {
    return await updateLandingPage(id, data);
  },
  
  delete: async (id) => {
    await deleteLandingPage(id);
    return true;
  },
};
