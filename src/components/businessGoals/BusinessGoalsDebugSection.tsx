
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2 } from 'lucide-react';
import { CMSBusinessGoal } from '@/types/cms';

interface BusinessGoalsDebugSectionProps {
  content: any;
  isLoading: boolean;
  error: any;
  goals?: CMSBusinessGoal[];
}

const BusinessGoalsDebugSection: React.FC<BusinessGoalsDebugSectionProps> = ({ 
  content,
  isLoading,
  error,
  goals
}) => {
  return (
    <div className="container py-12 border-t border-gray-200 mt-12">
      <h2 className="text-xl font-semibold mb-4">Debug Information (Development Only)</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Page Content</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading content...</span>
              </div>
            ) : error ? (
              <div className="text-red-500">
                <p>Error: {error.message}</p>
              </div>
            ) : !content ? (
              <p>No content available.</p>
            ) : (
              <Accordion type="single" collapsible>
                <AccordionItem value="content">
                  <AccordionTrigger>Content Data</AccordionTrigger>
                  <AccordionContent>
                    <pre className="text-xs overflow-auto p-2 bg-gray-100 rounded max-h-96">
                      {JSON.stringify(content, null, 2)}
                    </pre>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Business Goals Data</CardTitle>
          </CardHeader>
          <CardContent>
            {!goals || goals.length === 0 ? (
              <p>No business goals available.</p>
            ) : (
              <Accordion type="single" collapsible>
                <AccordionItem value="goals">
                  <AccordionTrigger>Goals Data ({goals.length} goals)</AccordionTrigger>
                  <AccordionContent>
                    <pre className="text-xs overflow-auto p-2 bg-gray-100 rounded max-h-96">
                      {JSON.stringify(
                        goals.map(g => ({
                          id: g.id,
                          title: g.title,
                          slug: g.slug,
                          link: `/business-goals/${g.slug}`
                        })), 
                        null, 
                        2
                      )}
                    </pre>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="slugMap">
                  <AccordionTrigger>Slug Map</AccordionTrigger>
                  <AccordionContent>
                    <div className="bg-gray-100 p-3 rounded">
                      <h4 className="font-medium mb-2">Goal URL Mappings:</h4>
                      <ul className="space-y-2 text-sm">
                        {goals.map(goal => (
                          <li key={goal.id} className="border-b border-gray-200 pb-2">
                            <strong>{goal.title}</strong><br/>
                            <span className="text-gray-600">Slug: </span>{goal.slug}<br/>
                            <span className="text-gray-600">URL: </span>
                            <a 
                              href={`/business-goals/${goal.slug}`} 
                              className="text-blue-600 hover:underline"
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              /business-goals/{goal.slug}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessGoalsDebugSection;
