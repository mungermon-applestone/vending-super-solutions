
import React from 'react';
import Layout from '@/components/layout/Layout';
import { useQuery } from '@tanstack/react-query';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Document } from '@contentful/rich-text-types';
import { Skeleton } from '@/components/ui/skeleton';

const About = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['about', '3Dn6DWVQR0VzhcQL6gdU0H'],
    queryFn: async () => {
      // TODO: Implement proper Contentful fetch
      // For now returning mock data with correct Document structure
      const mockDocument: Document = {
        nodeType: 'document',
        data: {},
        content: [
          {
            nodeType: 'paragraph',
            data: {},
            content: [
              {
                nodeType: 'text',
                value: 'Welcome to our About page. Content coming soon from Contentful.',
                marks: [],
                data: {}
              }
            ]
          }
        ]
      };
      
      return {
        fields: {
          bodyContent: mockDocument
        }
      };
    }
  });

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto py-12">
        <h1 className="text-4xl font-bold mb-8">About Us</h1>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : (
          <div className="prose max-w-none">
            {data?.fields?.bodyContent && documentToReactComponents(data.fields.bodyContent)}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default About;
