
import React from 'react';
import { useParams } from 'react-router-dom';
import DeprecatedAdminLayout from '@/components/admin/layout/DeprecatedAdminLayout';
import ContentfulRedirector from '@/components/admin/contentful/ContentfulRedirector';
import { logDeprecationWarning } from '@/services/cms/utils/deprecation';

const BusinessGoalEditor = () => {
  const { slug } = useParams<{ slug: string }>();
  const isEditMode = !!slug && slug !== 'new';
  const isCreating = !isEditMode;
  
  React.useEffect(() => {
    logDeprecationWarning(
      "BusinessGoalEditor",
      "The Business Goal editor interface is deprecated and will be removed in a future version.",
      "Please use Contentful to manage business goal content."
    );
  }, []);

  return (
    <DeprecatedAdminLayout
      title={isCreating ? "Create Business Goal" : "Edit Business Goal"}
      description="Business goal management has moved to Contentful"
      contentType="Business Goal"
      backPath="/admin/business-goals"
    >
      <ContentfulRedirector 
        contentType="businessGoal"
        contentTypeName="Business Goal"
        slug={isEditMode ? slug : undefined}
        isCreating={isCreating}
        returnPath="/admin/business-goals"
      />
    </DeprecatedAdminLayout>
  );
};

export default BusinessGoalEditor;
