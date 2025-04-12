
import { supabase } from '@/integrations/supabase/client';
import { CaseStudy, CaseStudyResult, CaseStudyTestimonial, CaseStudyWithRelations } from '@/types/caseStudy';
import { logCMSOperation, handleCMSError } from '../types';

// Fetch all case studies
export async function fetchCaseStudies(): Promise<CaseStudyWithRelations[]> {
  logCMSOperation('fetchAll', 'case-studies', 'Fetching all case studies');
  
  try {
    // Fetch case studies
    const { data: caseStudies, error } = await supabase
      .from('case_studies')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    if (!caseStudies) return [];
    
    // Get all results and testimonials for the case studies
    const caseStudiesWithRelations = await Promise.all(
      caseStudies.map(async (study) => {
        return getCaseStudyWithRelations(study);
      })
    );
    
    return caseStudiesWithRelations;
  } catch (error) {
    handleCMSError('fetchAll', 'case-studies', error);
    return [];
  }
}

// Fetch a case study by its slug
export async function fetchCaseStudyBySlug(slug: string): Promise<CaseStudyWithRelations | null> {
  logCMSOperation('fetchBySlug', 'case-studies', `Fetching case study with slug: ${slug}`);
  
  try {
    const { data, error } = await supabase
      .from('case_studies')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    if (!data) return null;
    
    return await getCaseStudyWithRelations(data);
  } catch (error) {
    handleCMSError('fetchBySlug', 'case-studies', error);
    return null;
  }
}

// Create a new case study
export async function createCaseStudy(data: any): Promise<string> {
  logCMSOperation('create', 'case-studies', `Creating new case study: ${data.title}`);
  
  try {
    // Insert the case study
    const { data: caseStudy, error } = await supabase
      .from('case_studies')
      .insert([{
        title: data.title,
        slug: data.slug,
        summary: data.summary,
        content: data.content,
        industry: data.industry,
        image_url: data.image_url,
        image_alt: data.image_alt,
        visible: data.visible
      }])
      .select('id')
      .single();
    
    if (error) throw error;
    if (!caseStudy) throw new Error('Failed to create case study');
    
    // Insert results if provided
    if (data.results && data.results.length > 0) {
      const resultsToInsert = data.results.map((result: any, index: number) => ({
        case_study_id: caseStudy.id,
        text: result.text,
        display_order: index
      }));
      
      const { error: resultsError } = await supabase
        .from('case_study_results')
        .insert(resultsToInsert);
      
      if (resultsError) throw resultsError;
    }
    
    // Insert testimonial if provided
    if (data.testimonial && data.testimonial.quote) {
      const { error: testimonialError } = await supabase
        .from('case_study_testimonials')
        .insert([{
          case_study_id: caseStudy.id,
          quote: data.testimonial.quote,
          author: data.testimonial.author,
          company: data.testimonial.company,
          position: data.testimonial.position
        }]);
      
      if (testimonialError) throw testimonialError;
    }
    
    return caseStudy.id;
  } catch (error) {
    handleCMSError('create', 'case-studies', error);
    throw error;
  }
}

// Update an existing case study
export async function updateCaseStudy(id: string, data: any): Promise<boolean> {
  logCMSOperation('update', 'case-studies', `Updating case study: ${id}`);
  
  try {
    // Update the case study
    const { error } = await supabase
      .from('case_studies')
      .update({
        title: data.title,
        slug: data.slug,
        summary: data.summary,
        content: data.content,
        industry: data.industry,
        image_url: data.image_url,
        image_alt: data.image_alt,
        visible: data.visible,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) throw error;
    
    // Update results - first delete existing ones
    const { error: deleteResultsError } = await supabase
      .from('case_study_results')
      .delete()
      .eq('case_study_id', id);
    
    if (deleteResultsError) throw deleteResultsError;
    
    // Insert new results
    if (data.results && data.results.length > 0) {
      const resultsToInsert = data.results.map((result: any, index: number) => ({
        case_study_id: id,
        text: result.text,
        display_order: index
      }));
      
      const { error: resultsError } = await supabase
        .from('case_study_results')
        .insert(resultsToInsert);
      
      if (resultsError) throw resultsError;
    }
    
    // Update testimonial
    if (data.testimonial) {
      // First delete existing testimonial
      const { error: deleteTestimonialError } = await supabase
        .from('case_study_testimonials')
        .delete()
        .eq('case_study_id', id);
      
      if (deleteTestimonialError) throw deleteTestimonialError;
      
      // Insert new testimonial if provided
      if (data.testimonial.quote) {
        const { error: testimonialError } = await supabase
          .from('case_study_testimonials')
          .insert([{
            case_study_id: id,
            quote: data.testimonial.quote,
            author: data.testimonial.author,
            company: data.testimonial.company,
            position: data.testimonial.position
          }]);
        
        if (testimonialError) throw testimonialError;
      }
    }
    
    return true;
  } catch (error) {
    handleCMSError('update', 'case-studies', error);
    throw error;
  }
}

// Delete a case study
export async function deleteCaseStudy(id: string): Promise<boolean> {
  logCMSOperation('delete', 'case-studies', `Deleting case study: ${id}`);
  
  try {
    const { error } = await supabase
      .from('case_studies')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    handleCMSError('delete', 'case-studies', error);
    throw error;
  }
}

// Helper function to get a case study with its related data
async function getCaseStudyWithRelations(study: CaseStudy): Promise<CaseStudyWithRelations> {
  try {
    // Fetch results for this case study
    const { data: results, error: resultsError } = await supabase
      .from('case_study_results')
      .select('*')
      .eq('case_study_id', study.id)
      .order('display_order', { ascending: true });
    
    if (resultsError) throw resultsError;
    
    // Fetch testimonial for this case study
    const { data: testimonials, error: testimonialError } = await supabase
      .from('case_study_testimonials')
      .select('*')
      .eq('case_study_id', study.id);
    
    if (testimonialError) throw testimonialError;
    
    return {
      ...study,
      results: results || [],
      testimonial: testimonials && testimonials.length > 0 ? testimonials[0] : undefined
    };
  } catch (error) {
    console.error(`Error fetching relations for case study ${study.id}:`, error);
    return {
      ...study,
      results: [],
      testimonial: undefined
    };
  }
}
