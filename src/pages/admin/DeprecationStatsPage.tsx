
import React, { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DeprecationUsage from '@/components/admin/DeprecationUsage';
import { logDeprecationWarning } from '@/services/cms/utils/deprecationLogger';

const DeprecationStatsPage = () => {
  useEffect(() => {
    logDeprecationWarning(
      "DeprecationStatsPage", 
      "User viewed deprecation statistics"
    );
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Deprecation Statistics</h1>
          <p className="text-muted-foreground mb-6">
            Monitor usage of deprecated features to guide migration efforts
          </p>
          
          <Tabs defaultValue="usage" className="w-full">
            <TabsList>
              <TabsTrigger value="usage">Feature Usage</TabsTrigger>
              <TabsTrigger value="timeline">Migration Timeline</TabsTrigger>
            </TabsList>
            <TabsContent value="usage">
              <div className="grid gap-6">
                <DeprecationUsage showResetButton={true} showChart={true} />
                
                <Card>
                  <CardHeader>
                    <CardTitle>Usage Tracking</CardTitle>
                    <CardDescription>
                      Understanding the deprecation tracking system
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p>
                        The deprecation tracking system logs whenever a deprecated feature or component
                        is used in the application. This helps identify which parts of the codebase
                        still rely on legacy functionality and should be prioritized for migration.
                      </p>
                      
                      <h3 className="text-lg font-medium mt-4">How it works</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>
                          Each time a deprecated feature is used, it's logged by the tracking system
                        </li>
                        <li>
                          Usage statistics are stored in memory during the current session
                        </li>
                        <li>
                          The dashboard displays which features are most commonly used
                        </li>
                        <li>
                          Use this data to prioritize your migration efforts
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="timeline">
              <Card>
                <CardHeader>
                  <CardTitle>Migration Timeline</CardTitle>
                  <CardDescription>
                    Timeline for complete transition to Contentful
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="relative pl-8 pb-8 border-l-2 border-blue-100">
                      <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-green-500"></div>
                      <div className="mb-2">
                        <span className="text-sm font-semibold bg-green-100 text-green-800 px-2 py-0.5 rounded">Completed</span>
                        <h3 className="text-lg font-medium mt-1">Phase 1: Initial Deprecation</h3>
                      </div>
                      <p className="text-muted-foreground">
                        Added deprecation warnings to legacy systems and created initial Contentful adapters.
                      </p>
                    </div>
                    
                    <div className="relative pl-8 pb-8 border-l-2 border-blue-100">
                      <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-green-500"></div>
                      <div className="mb-2">
                        <span className="text-sm font-semibold bg-green-100 text-green-800 px-2 py-0.5 rounded">Completed</span>
                        <h3 className="text-lg font-medium mt-1">Phase 2: Admin Interface Updates</h3>
                      </div>
                      <p className="text-muted-foreground">
                        Added visual indicators and made admin interfaces read-only.
                      </p>
                    </div>
                    
                    <div className="relative pl-8 pb-8 border-l-2 border-blue-100">
                      <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-blue-500"></div>
                      <div className="mb-2">
                        <span className="text-sm font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">In Progress</span>
                        <h3 className="text-lg font-medium mt-1">Phase 3: Progressive Removal</h3>
                        <p className="text-sm text-blue-600">Target: Q2 2025</p>
                      </div>
                      <p className="text-muted-foreground">
                        Replacing write operations with read-only implementations and redirects.
                      </p>
                    </div>
                    
                    <div className="relative pl-8 pb-8 border-l-2 border-blue-100">
                      <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-gray-300"></div>
                      <div className="mb-2">
                        <span className="text-sm font-semibold bg-gray-100 text-gray-800 px-2 py-0.5 rounded">Planned</span>
                        <h3 className="text-lg font-medium mt-1">Phase 4: Schema Cleanup</h3>
                        <p className="text-sm text-gray-600">Target: Q3 2025</p>
                      </div>
                      <p className="text-muted-foreground">
                        Remove legacy database schemas and update API endpoints.
                      </p>
                    </div>
                    
                    <div className="relative pl-8">
                      <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-gray-300"></div>
                      <div className="mb-2">
                        <span className="text-sm font-semibold bg-gray-100 text-gray-800 px-2 py-0.5 rounded">Planned</span>
                        <h3 className="text-lg font-medium mt-1">Phase 5: Final Validation</h3>
                        <p className="text-sm text-gray-600">Target: Q4 2025</p>
                      </div>
                      <p className="text-muted-foreground">
                        Complete testing of all functionality and remove all deprecated code.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default DeprecationStatsPage;
