
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

export interface MachineDetailInquiryProps {
  machineId: string;
  machineTitle: string;
}

const MachineDetailInquiry: React.FC<MachineDetailInquiryProps> = ({ machineId, machineTitle }) => {
  const emailSubject = `Inquiry about ${machineTitle} (ID: ${machineId})`;
  const emailBody = `I would like more information about the ${machineTitle} machine.`;
  
  return (
    <div className="bg-blue-50 p-6 rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-semibold mb-3 text-gray-800">Interested in this machine?</h2>
      <p className="text-gray-600 mb-6">
        Contact our sales team to learn more about pricing, customization, and availability.
      </p>
      <Button className="flex items-center gap-2" asChild>
        <a 
          href={`mailto:sales@example.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
        >
          <Mail className="h-4 w-4" />
          Contact Sales
        </a>
      </Button>
    </div>
  );
};

export default MachineDetailInquiry;
