
import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import TranslatableText from '@/components/translation/TranslatableText';

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
          <h3 className="text-lg font-medium mb-1">
            <TranslatableText context="contact-cards">
              {data.emailCardTitle || 'Email Us'}
            </TranslatableText>
          </h3>
          <p className="text-gray-600">{data.emailAddress || 'support@applestonesolutions.com'}</p>
          {data.emailResponseTime && (
            <p className="text-gray-400 text-sm">
              <TranslatableText context="contact-cards">
                {data.emailResponseTime}
              </TranslatableText>
            </p>
          )}
        </div>
      </div>
      <div className="flex items-start">
        <div className="bg-vending-blue-light bg-opacity-20 p-3 rounded-full h-12 w-12 mr-4 flex items-center justify-center text-vending-blue">
          <Phone className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-medium mb-1">
            <TranslatableText context="contact-cards">
              {data.phoneCardTitle || 'Call Us'}
            </TranslatableText>
          </h3>
          <p className="text-gray-600">{data.phoneNumber || '(555) 123-4567'}</p>
          {data.phoneAvailability && (
            <p className="text-gray-400 text-sm">
              <TranslatableText context="contact-cards">
                {data.phoneAvailability}
              </TranslatableText>
            </p>
          )}
        </div>
      </div>
      <div className="flex items-start">
        <div className="bg-vending-blue-light bg-opacity-20 p-3 rounded-full h-12 w-12 mr-4 flex items-center justify-center text-vending-blue">
          <MapPin className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-medium mb-1">
            <TranslatableText context="contact-cards">
              {data.addressCardTitle || 'Mailing Address'}
            </TranslatableText>
          </h3>
          <p className="text-gray-600 whitespace-pre-line">{data.address || '3607 Main St.\nStone Ridge, NY 12484'}</p>
          {data.addressType && (
            <p className="text-gray-400 text-sm">
              <TranslatableText context="contact-cards">
                {data.addressType}
              </TranslatableText>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactCards;
