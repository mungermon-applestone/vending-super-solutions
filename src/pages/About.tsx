
import React from 'react';
import Layout from '@/components/layout/Layout';
import { useQuery } from '@tanstack/react-query';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Document, BLOCKS } from '@contentful/rich-text-types';
import { Skeleton } from '@/components/ui/skeleton';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import Image from '@/components/common/Image';

const About = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['about', '3Dn6DWVQR0VzhcQL6gdU0H'],
    queryFn: async () => {
      const client = await getContentfulClient();
      const entry = await client.getEntry('3Dn6DWVQR0VzhcQL6gdU0H', {
        include: 2 // Include linked assets (like images)
      });
      return entry;
    }
  });

  // Configure the rich text rendering options to handle embedded assets
  const richTextOptions = {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        // Get the asset reference from the node
        const { data: { target: { sys: { id } } } } = node;
        
        // Find the asset in the linked entries/assets
        const asset = data?.includes?.Asset?.find(
          (asset) => asset.sys.id === id
        );
        
        if (asset) {
          const { title, description, file } = asset.fields;
          const imageUrl = file.url;
          
          return (
            <div className="my-8">
              <Image 
                src={`https:${imageUrl}`}
                alt={description || title || 'About image'}
                className="w-full h-auto rounded-md"
              />
            </div>
          );
        }
        
        return null;
      }
    }
  };

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
            {data?.fields?.bodyContent && documentToReactComponents(data.fields.bodyContent as Document, richTextOptions)}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default About;
