
import { ContentTypeOperations } from '../types';
import { CaseStudyWithRelations } from '@/types/caseStudy';
import { fetchCaseStudies, fetchCaseStudyBySlug, createCaseStudy, updateCaseStudy, deleteCaseStudy } from './index';

export const caseStudyOperations: ContentTypeOperations<CaseStudyWithRelations> = {
  fetchAll: async (options) => {
    const studies = await fetchCaseStudies();
    return studies;
  },
  
  fetchBySlug: async (slug: string) => {
    return await fetchCaseStudyBySlug(slug);
  },
  
  fetchById: async (id: string) => {
    const allStudies = await fetchCaseStudies();
    return allStudies.find(study => study.id === id) || null;
  },
  
  create: async (data) => {
    return await createCaseStudy(data);
  },
  
  update: async (id, data) => {
    return await updateCaseStudy(id, data);
  },
  
  delete: async (id) => {
    await deleteCaseStudy(id);
    return true;
  },
};
