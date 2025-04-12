
import { ContentTypeOperations } from '../types';
import { CaseStudyWithRelations } from '@/types/caseStudy';
import { fetchCaseStudies, fetchCaseStudyBySlug, createCaseStudy, updateCaseStudy, deleteCaseStudy } from './index';

export const caseStudyOperations: ContentTypeOperations<CaseStudyWithRelations> = {
  getAll: async () => {
    const studies = await fetchCaseStudies();
    return studies;
  },
  
  getBySlug: async (slug: string) => {
    return await fetchCaseStudyBySlug(slug);
  },
  
  getById: async (id: string) => {
    const allStudies = await fetchCaseStudies();
    return allStudies.find(study => study.id === id);
  },
  
  create: async (data) => {
    return await createCaseStudy(data);
  },
  
  update: async (id, data) => {
    return await updateCaseStudy(id, data);
  },
  
  remove: async (id) => {
    await deleteCaseStudy(id);
  },
};
