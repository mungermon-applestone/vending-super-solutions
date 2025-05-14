
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const TermsOfService = () => {
  const currentYear = new Date().getFullYear();
  
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <Layout>
      <Helmet>
        <title>Terms of Service - Vending Solutions</title>
        <meta name="description" content="Our terms of service outline the rules and guidelines for using our products and services." />
      </Helmet>
      
      <div className="container py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-vending-blue-dark">Terms of Service</h1>
          <div className="print:hidden flex gap-2">
            <Button variant="outline" onClick={handlePrint}>Print Terms</Button>
            <Button variant="outline" asChild>
              <Link to="/privacy-policy">Privacy Policy</Link>
            </Button>
          </div>
        </div>
        
        <div className="prose max-w-none">
          <p>Last updated: January {currentYear}</p>
          
          <h2>1. Agreement to Terms</h2>
          <p>
            These Terms of Service constitute a legally binding agreement made between you and Vending Solutions
            concerning your access to and use of our website, products, and services. You agree that by accessing the
            site or our services, you have read, understood, and agreed to be bound by all of these Terms of Service.
          </p>
          
          <h2>2. Intellectual Property Rights</h2>
          <p>
            Unless otherwise indicated, the site and all its content, features, and functionality are owned by Vending Solutions,
            its licensors, or other providers and are protected by copyright, trademark, patent, trade secret, and other intellectual
            property laws.
          </p>
          
          <h2>3. User Representations</h2>
          <p>By using the site or our services, you represent and warrant that:</p>
          <ul>
            <li>You have the legal capacity to agree to these Terms of Service.</li>
            <li>You are not a minor in the jurisdiction in which you reside.</li>
            <li>You will not access the site through automated or non-human means.</li>
            <li>You will not use the site for any illegal or unauthorized purpose.</li>
            <li>Your use of the site will not violate any applicable law or regulation.</li>
          </ul>
          
          <h2>4. Products and Services</h2>
          <p>
            We make every effort to display as accurately as possible the features, specifications, colors, and images of our
            products that appear on the site. However, we cannot guarantee that your display's monitor will display colors accurately.
            We reserve the right, but are not obligated, to limit the sales of our products or services to any person, geographic
            region, or jurisdiction.
          </p>
          
          <h2>5. Purchases and Payment</h2>
          <p>
            We accept various forms of payment as specified on our site. You represent and warrant that you have the legal right
            to use any payment method you provide. We reserve the right to refuse any order you place with us, and
            we may limit or cancel quantities purchased per person, per household, or per order.
          </p>
          
          <h2>6. Prohibited Activities</h2>
          <p>You may not access or use the site for any purpose other than that for which we make the site available. As a user of the site, you agree not to:</p>
          <ul>
            <li>Systematically retrieve data from the site to create a collection or database.</li>
            <li>Trick, defraud, or mislead us or other users.</li>
            <li>Circumvent or disable any security or other technological features of the site.</li>
            <li>Use the site or its content for any revenue-generating endeavor or commercial enterprise.</li>
          </ul>
          
          <h2>7. Site Management</h2>
          <p>
            We reserve the right to: (1) monitor the site for violations of these Terms of Service; (2) take appropriate
            legal action against anyone who violates the law or these Terms of Service; (3) refuse, restrict access to, or
            terminate service; and (4) otherwise manage the site in a manner designed to protect our rights and provide the best service.
          </p>
          
          <h2>8. Privacy Policy</h2>
          <p>
            Your use of the site is also governed by our Privacy Policy, which is incorporated into these Terms of Service. 
            Please review our <Link to="/privacy-policy">Privacy Policy</Link>.
          </p>
          
          <h2>9. Term and Termination</h2>
          <p>
            These Terms of Service shall remain in full force and effect while you use the site. We may terminate your access
            at any time, without warning, if you violate any of the provisions of these Terms of Service.
          </p>
          
          <h2>10. Contact Us</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us through our <Link to="/contact">contact page</Link>.
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

export default TermsOfService;
