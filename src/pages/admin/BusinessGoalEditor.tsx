
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import BusinessGoalEditorForm from '@/components/admin/business-goal-editor/BusinessGoalEditorForm';

const BusinessGoalEditor = () => {
  const { goalSlug } = useParams<{ goalSlug: string }>();
  
  // Add logging to debug parameter handling
  console.log('[BusinessGoalEditor] Goal slug from URL:', goalSlug);
  const isEditMode = !!goalSlug && goalSlug !== 'new';
  console.log('[BusinessGoalEditor] Is edit mode:', isEditMode);
  
  return (
    <Layout>
      <BusinessGoalEditorForm goalSlug={goalSlug} isEditMode={isEditMode} />
    </Layout>
  );
};

export default BusinessGoalEditor;
