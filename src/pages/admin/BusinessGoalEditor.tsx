
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DeprecatedAdminLayout from '@/components/admin/layout/DeprecatedAdminLayout';
import BusinessGoalRedirector from '@/components/admin/business-goals/BusinessGoalRedirector';
import { logDeprecationWarning } from '@/services/cms/utils/deprecationLogger';

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
      <BusinessGoalRedirector 
        businessGoalSlug={isEditMode ? slug : undefined}
        isCreating={isCreating}
        backPath="/admin/business-goals"
      />
    </DeprecatedAdminLayout>
  );
};

export default BusinessGoalEditor;
