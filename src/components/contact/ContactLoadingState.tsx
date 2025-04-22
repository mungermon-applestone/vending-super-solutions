
import React from "react";
import Layout from "@/components/layout/Layout";

const ContactLoadingState = () => (
  <Layout>
    <div className="container max-w-4xl mx-auto py-12">
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/5 mb-2"></div>
        <div className="h-24 bg-gray-200 rounded w-full mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
      </div>
    </div>
  </Layout>
);

export default ContactLoadingState;
