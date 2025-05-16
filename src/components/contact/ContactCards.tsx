
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import EmailLink from '@/components/common/EmailLink';

export interface ContactCardsProps {
  data?: {
    email?: string;
    phone?: string;
    address?: string;
    hours?: string;
  };
}

const ContactCards: React.FC<ContactCardsProps> = ({ data }) => {
  const email = data?.email || 'info@example.com';
  const phone = data?.phone || '+1 (555) 123-4567';
  const address = data?.address || '123 Business Ave, Suite 100, New York, NY 10001';
  const hours = data?.hours || 'Monday - Friday: 9:00 AM - 5:00 PM';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <MapPin className="h-5 w-5 text-blue-500 mr-2" />
            Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{address}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Phone className="h-5 w-5 text-blue-500 mr-2" />
            Phone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <a href={`tel:${phone.replace(/\D/g, '')}`} className="text-gray-600 hover:text-blue-600 transition-colors">
            {phone}
          </a>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Mail className="h-5 w-5 text-blue-500 mr-2" />
            Email
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmailLink emailAddress={email} className="text-gray-600 hover:text-blue-600 transition-colors" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Clock className="h-5 w-5 text-blue-500 mr-2" />
            Business Hours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{hours}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactCards;
