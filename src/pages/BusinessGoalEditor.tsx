
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import AdminControls from '@/components/admin/AdminControls';
import BusinessGoalEditorForm from '@/components/admin/business-goal-editor/BusinessGoalEditorForm';

const BusinessGoalEditor = () => {
  const { goalSlug } = useParams<{ goalSlug: string }>();

  return (
    <Layout>
      <BusinessGoalEditorForm goalSlug={goalSlug} />
      <AdminControls />
    </Layout>
  );
};

export default BusinessGoalEditor;
