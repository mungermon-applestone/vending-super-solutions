
import React from 'react';
import { CMSMachine } from '@/types/cms';

interface MachineDetailDeploymentsProps {
  deploymentExamples: CMSMachine['deploymentExamples'];
  sectionTitle?: string;
}

const MachineDetailDeployments: React.FC<MachineDetailDeploymentsProps> = ({ 
  deploymentExamples,
  sectionTitle = "Deployment Examples"
}) => {
  if (!deploymentExamples || deploymentExamples.length === 0) return null;
  
  return (
    <section className="py-12 bg-white" id="deployment-examples">
      <div className="container-wide">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-vending-blue-dark">
          {sectionTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {deploymentExamples.map((example, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
              <img 
                src={example.image.url} 
                alt={example.image.alt || example.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">{example.title}</h3>
                <p className="text-gray-600">{example.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MachineDetailDeployments;
