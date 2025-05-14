
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const PrivacyPolicy = () => {
  const currentYear = new Date().getFullYear();
  
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <Layout>
      <Helmet>
        <title>Privacy Policy - Vending Solutions</title>
        <meta name="description" content="Our privacy policy explains how we collect, use, and protect your personal information." />
      </Helmet>
      
      <div className="container py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-vending-blue-dark">Privacy Policy</h1>
          <div className="print:hidden flex gap-2">
            <Button variant="outline" onClick={handlePrint}>Print Policy</Button>
            <Button variant="outline" asChild>
              <Link to="/terms-of-service">Terms of Service</Link>
            </Button>
          </div>
        </div>
        
        <div className="prose max-w-none">
          <p>Last updated: January {currentYear}</p>
          
          <h2>1. Introduction</h2>
          <p>
            At Vending Solutions, we respect your privacy and are committed to protecting your personal data. 
            This privacy policy will inform you about how we look after your personal data when you visit our website 
            and tell you about your privacy rights and how the law protects you.
          </p>
          
          <h2>2. The Data We Collect About You</h2>
          <p>
            Personal data means any information about an individual from which that person can be identified. 
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped as follows:
          </p>
          <ul>
            <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
            <li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
            <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, 
            time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
            <li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li>
          </ul>
          
          <h2>3. How We Use Your Personal Data</h2>
          <p>
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul>
            <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
            <li>Where we need to comply with a legal obligation.</li>
          </ul>
          
          <h2>4. Data Security</h2>
          <p>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in 
            an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and 
            other third parties who have a business need to know. They will only process your personal data on our instructions and they are 
            subject to a duty of confidentiality.
          </p>
          
          <h2>5. Data Retention</h2>
          <p>
            We will only retain your personal data for as long as reasonably necessary to fulfill the purposes we collected it for, 
            including for the purposes of satisfying any legal, regulatory, tax, accounting or reporting requirements.
          </p>
          
          <h2>6. Your Legal Rights</h2>
          <p>
            Under certain circumstances, you have rights under data protection laws in relation to your personal data including the right to receive a 
            copy of the personal data we hold about you and the right to make a complaint at any time to your local data protection authority.
          </p>
          
          <h2>7. Third-Party Links</h2>
          <p>
            This website may include links to third-party websites, plug-ins and applications. Clicking on those links or enabling those connections may 
            allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements. 
            When you leave our website, we encourage you to read the privacy policy of every website you visit.
          </p>
          
          <h2>8. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy or our privacy practices, please contact us through our <Link to="/contact">contact page</Link>.
          </p>
        </div>
        
        <div className="mt-8 print:hidden">
          <Button asChild>
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
