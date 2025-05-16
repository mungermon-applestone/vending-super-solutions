
import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

interface ContactCardsProps {
  data: {
    emailCardTitle?: string;
    emailAddress?: string;
    emailResponseTime?: string;
    phoneCardTitle?: string;
    phoneNumber?: string;
    phoneAvailability?: string;
    addressCardTitle?: string;
    address?: string;
    addressType?: string;
  };
}

const ContactCards = ({ data }: ContactCardsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-start">
        <div className="bg-vending-blue-light bg-opacity-20 p-3 rounded-full h-12 w-12 mr-4 flex items-center justify-center text-vending-blue">
          <Mail className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-medium mb-1">{data.emailCardTitle || 'Email Us'}</h3>
          <p className="text-gray-600">{data.emailAddress || 'support@applestonesolutions.com'}</p>
          {data.emailResponseTime && (
            <p className="text-gray-400 text-sm">{data.emailResponseTime}</p>
          )}
        </div>
      </div>
      <div className="flex items-start">
        <div className="bg-vending-blue-light bg-opacity-20 p-3 rounded-full h-12 w-12 mr-4 flex items-center justify-center text-vending-blue">
          <Phone className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-medium mb-1">{data.phoneCardTitle || 'Call Us'}</h3>
          <p className="text-gray-600">{data.phoneNumber || '(555) 123-4567'}</p>
          {data.phoneAvailability && (
            <p className="text-gray-400 text-sm">{data.phoneAvailability}</p>
          )}
        </div>
      </div>
      <div className="flex items-start">
        <div className="bg-vending-blue-light bg-opacity-20 p-3 rounded-full h-12 w-12 mr-4 flex items-center justify-center text-vending-blue">
          <MapPin className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-medium mb-1">{data.addressCardTitle || 'Mailing Address'}</h3>
          <p className="text-gray-600 whitespace-pre-line">{data.address || '3607 Main St.\nStone Ridge, NY 12484'}</p>
          {data.addressType && (
            <p className="text-gray-400 text-sm">{data.addressType}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactCards;
