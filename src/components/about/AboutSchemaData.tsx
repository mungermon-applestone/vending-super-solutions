
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface AboutSchemaDataProps {
  breadcrumbItems: Array<{name: string; url: string; position: number}>;
  organizationName?: string;
  organizationLogo?: string;
  organizationDescription?: string;
  foundingDate?: string;
  founders?: Array<{name: string; title: string}>;
  socialMediaLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

const AboutSchemaData: React.FC<AboutSchemaDataProps> = ({
  breadcrumbItems,
  organizationName = 'Vending Solutions',
  organizationLogo = '/logo.png',
  organizationDescription,
  foundingDate,
  founders,
  socialMediaLinks
}) => {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems.map((item) => ({
      "@type": "ListItem",
      "position": item.position,
      "item": {
        "@id": item.url,
        "name": item.name
      }
    }))
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": organizationName,
    "logo": {
      "@type": "ImageObject",
      "url": `https://yourdomain.com${organizationLogo}`
    },
    "url": "https://yourdomain.com",
    ...(organizationDescription && {
      "description": organizationDescription
    }),
    ...(foundingDate && {
      "foundingDate": foundingDate
    }),
    ...(founders && founders.length > 0 && {
      "founder": founders.map(founder => ({
        "@type": "Person",
        "name": founder.name,
        "jobTitle": founder.title
      }))
    }),
    ...(socialMediaLinks && {
      "sameAs": [
        socialMediaLinks.linkedin,
        socialMediaLinks.twitter,
        socialMediaLinks.facebook
      ].filter(Boolean)
    })
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
