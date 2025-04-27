
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface TechnologySchemaDataProps {
  breadcrumbItems: Array<{name: string; url: string; position: number}>;
  technology?: {
    name: string;
    description: string;
    image?: string;
    features?: Array<{
      name: string;
      description: string;
    }>;
  };
  isListPage?: boolean;
}

const TechnologySchemaData: React.FC<TechnologySchemaDataProps> = ({
  breadcrumbItems,
  technology,
  isListPage = false
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

  const technologySchema = technology ? {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": technology.name,
    "description": technology.description,
    "image": technology.image ? `https://yourdomain.com${technology.image}` : undefined,
    "author": {
      "@type": "Organization",
      "name": "Vending Solutions"
    },
    ...(technology.features && {
      "articleBody": technology.features.map(f => `${f.name}: ${f.description}`).join('\n')
    })
  } : isListPage ? {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Vending Machine Technologies",
    "description": "Explore our advanced vending machine technologies and solutions.",
    "url": "https://yourdomain.com/technology"
  } : undefined;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      {technologySchema && (
        <script type="application/ld+json">
          {JSON.stringify(technologySchema)}
        </script>
      )}
    </Helmet>
  );
};

export default TechnologySchemaData;
