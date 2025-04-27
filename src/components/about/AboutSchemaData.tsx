
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface AboutSchemaDataProps {
  breadcrumbItems: Array<{name: string; url: string; position: number}>;
  organizationName?: string;
  organizationLogo?: string;
}

const AboutSchemaData: React.FC<AboutSchemaDataProps> = ({
  breadcrumbItems,
  organizationName = 'Vending Solutions',
  organizationLogo = '/logo.png'
}) => {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": organizationName,
    "logo": organizationLogo,
    "url": "https://yourdomain.com"
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
    </Helmet>
  );
};

export default AboutSchemaData;
