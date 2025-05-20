
import React from "react";
import { useParams } from "react-router-dom";
import { useTechnologyData } from "@/hooks/useTechnologyData";
import TechnologyDetail from "./TechnologyDetail";
import ContentfulFallbackMessage from "@/components/common/ContentfulFallbackMessage";
import TechnologySEO from "@/components/seo/TechnologySEO";

const TechnologyDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { technology, isLoading, isError, error } = useTechnologyData(slug || '');

  if (isLoading) {
    return <div>Loading technology...</div>;
  }

  if (isError || !technology) {
    return (
      <ContentfulFallbackMessage
        title="Error loading technology details"
        message={`We encountered an error loading this technology: ${error?.message || 'Technology not found'}`}
        contentType="Technology"
      />
    );
  }

  return (
    <>
      {/* Add SEO component */}
      <TechnologySEO technology={technology} />
      {/* Pass technology prop to TechnologyDetail component */}
      <TechnologyDetail technology={technology} />
    </>
  );
};

export default TechnologyDetailPage;
