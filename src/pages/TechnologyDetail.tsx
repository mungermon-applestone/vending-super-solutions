
import React from 'react';
import { CMSTechnology } from '@/types/cms';
import TechnologyHero from '@/components/technology/TechnologyHero';
import TechnologySections from '@/components/technology/TechnologySections';

interface TechnologyDetailProps {
  technology: CMSTechnology;
}

const TechnologyDetail: React.FC<TechnologyDetailProps> = ({ technology }) => {
  return (
    <div className="technology-detail">
      {/* Hero Section */}
      <TechnologyHero technology={technology} />
      
      {/* Technology Sections */}
      {technology.sections && technology.sections.length > 0 && (
        <TechnologySections sections={technology.sections} />
      )}
    </div>
  );
};

export default TechnologyDetail;
