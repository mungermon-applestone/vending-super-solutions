
import React from "react";
import Layout from "@/components/layout/Layout";

interface ContactErrorStateProps {
  error: unknown;
  includesEntryCount?: number;
  knownFAQIds?: string[];
}

const ContactErrorState: React.FC<ContactErrorStateProps> = ({
  error,
  includesEntryCount,
  knownFAQIds
}) => (
  <Layout>
    <div className="container max-w-4xl mx-auto py-12 text-red-500">
      <h2 className="text-2xl font-bold mb-4">Error Loading Contact Information</h2>
      <p>{error instanceof Error ? error.message : String(error)}</p>
      <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded">
        <p className="text-sm">Technical details: {JSON.stringify(error)}</p>
        {typeof includesEntryCount === 'number' ? (
          <div className="text-xs text-gray-400 mt-4">
            Found {includesEntryCount} entries in includes.<br/>
            Known FAQ IDs: {knownFAQIds?.join(", ")}
          </div>
        ) : null}
      </div>
    </div>
  </Layout>
);

export default ContactErrorState;
