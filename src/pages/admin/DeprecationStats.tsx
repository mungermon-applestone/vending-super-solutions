
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import DeprecatedAdminLayout from '@/components/admin/layout/DeprecatedAdminLayout';
import DeprecationUsage from '@/components/admin/DeprecationUsage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

const DeprecationStats = () => {
  return (
    <DeprecatedAdminLayout
      title="Deprecation Statistics"
      description="Monitor usage of deprecated features and functions"
      backPath="/admin/dashboard"
      contentType="System"
    >
      <Alert className="mb-6">
        <InfoIcon className="h-5 w-5" />
        <AlertTitle>Monitoring Deprecated Features</AlertTitle>
        <AlertDescription>
          This dashboard tracks the usage of deprecated features during the current session.
          Use this information to identify which parts of the system are still relying on
          deprecated functionality that should be migrated to Contentful.
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="usage">
        <TabsList className="mb-4">
          <TabsTrigger value="usage">Usage Statistics</TabsTrigger>
          <TabsTrigger value="critical">Critical Paths</TabsTrigger>
        </TabsList>
        
        <TabsContent value="usage">
          <DeprecationUsage showChart={true} />
        </TabsContent>
        
        <TabsContent value="critical">
          <Card>
            <CardHeader>
              <CardTitle>Critical Path Usage</CardTitle>
              <CardDescription>
                Functions and components marked as critical paths that need careful handling during migration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Path</th>
                    <th className="text-left py-2">Used In</th>
                    <th className="text-left py-2">Risk Level</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 pr-4">useContentfulProducts()</td>
                    <td className="py-2 pr-4">Homepage, Products page</td>
                    <td className="py-2">
                      <Badge variant="destructive">High</Badge>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4">useFeaturedProducts()</td>
                    <td className="py-2 pr-4">Homepage</td>
                    <td className="py-2">
                      <Badge variant="destructive">High</Badge>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4">useContentfulMachines()</td>
                    <td className="py-2 pr-4">Machines page</td>
                    <td className="py-2">
                      <Badge variant="destructive">High</Badge>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4">useFeaturedMachines()</td>
                    <td className="py-2 pr-4">Homepage</td>
                    <td className="py-2">
                      <Badge variant="destructive">High</Badge>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4">useMachineBySlug()</td>
                    <td className="py-2 pr-4">Machine detail pages</td>
                    <td className="py-2">
                      <Badge variant="destructive">High</Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DeprecatedAdminLayout>
  );
};

export default DeprecationStats;

// Missing Badge component import
import { Badge } from '@/components/ui/badge';
