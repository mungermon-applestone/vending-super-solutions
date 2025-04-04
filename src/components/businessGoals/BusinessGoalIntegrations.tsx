
import { ReactNode } from 'react';

interface Integration {
  name: string;
  description: string;
  icon: ReactNode;
}

interface BusinessGoalIntegrationsProps {
  integrations: Integration[];
}

const BusinessGoalIntegrations = ({ integrations }: BusinessGoalIntegrationsProps) => {
  return (
    <section className="py-16 bg-white">
      <div className="container-wide">
        <h2 className="text-3xl font-bold text-center text-vending-blue-dark mb-4">
          Integrations & Tools
        </h2>
        <p className="text-center text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
          Our platform connects with these tools to help you maximize your business outcomes.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {integrations.map((integration, index) => (
            <div 
              key={index} 
              className="bg-vending-gray rounded-lg p-6 text-center hover:shadow-md transition-shadow"
            >
              <div className="bg-white p-3 rounded-full w-14 h-14 flex items-center justify-center text-vending-blue mx-auto mb-4">
                {integration.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{integration.name}</h3>
              <p className="text-gray-600 text-sm">{integration.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusinessGoalIntegrations;
