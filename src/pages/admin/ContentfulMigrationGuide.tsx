
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AdminLayout from '@/components/AdminLayout';
import DeprecationBanner from '@/components/admin/DeprecationBanner';
import MigrationStatusBadge from '@/components/admin/MigrationStatusBadge';
import { 
  CONTENT_TYPE_MIGRATION_STATUS,
  CONTENT_TYPE_IDS,
  MIGRATION_STATUS 
} from '@/services/cms/utils/deprecationConstants';

const ContentfulMigrationGuide: React.FC = () => {
  const contentTypeEntries = Object.entries(CONTENT_TYPE_MIGRATION_STATUS);
  const statusCount = {
    [MIGRATION_STATUS.COMPLETED]: contentTypeEntries.filter(([_, status]) => status === MIGRATION_STATUS.COMPLETED).length,
    [MIGRATION_STATUS.IN_PROGRESS]: contentTypeEntries.filter(([_, status]) => status === MIGRATION_STATUS.IN_PROGRESS).length,
    [MIGRATION_STATUS.PENDING]: contentTypeEntries.filter(([_, status]) => status === MIGRATION_STATUS.PENDING).length,
  };

  const totalCount = contentTypeEntries.length;
  const completionPercentage = Math.round((statusCount[MIGRATION_STATUS.COMPLETED] / totalCount) * 100);

  // Get content type ID from the constants if available, otherwise use the content type name
  const getContentTypeId = (contentType: string): string => {
    const upperCaseContentType = contentType.toUpperCase();
    // Type assertion to avoid TypeScript errors
    return (CONTENT_TYPE_IDS as Record<string, string>)[upperCaseContentType] || contentType;
  };

  return (
    <AdminLayout>
      <DeprecationBanner />
      
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-8">Contentful Migration Guide</h1>
        
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Migration Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Overall completion:</span>
                  <span className="font-bold">{completionPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div className="p-2 border rounded">
                  <div className="font-bold text-xl text-green-600">{statusCount[MIGRATION_STATUS.COMPLETED]}</div>
                  <div className="text-sm">Completed</div>
                </div>
                <div className="p-2 border rounded">
                  <div className="font-bold text-xl text-amber-500">{statusCount[MIGRATION_STATUS.IN_PROGRESS]}</div>
                  <div className="text-sm">In Progress</div>
                </div>
                <div className="p-2 border rounded">
                  <div className="font-bold text-xl text-gray-500">{statusCount[MIGRATION_STATUS.PENDING]}</div>
                  <div className="text-sm">Pending</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Migration Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex justify-between items-center">
                  <span>Initial Setup</span>
                  <MigrationStatusBadge status={MIGRATION_STATUS.COMPLETED} />
                </li>
                <li className="flex justify-between items-center">
                  <span>Core Content Types</span>
                  <MigrationStatusBadge status={MIGRATION_STATUS.COMPLETED} />
                </li>
                <li className="flex justify-between items-center">
                  <span>Extended Content Types</span>
                  <MigrationStatusBadge status={MIGRATION_STATUS.IN_PROGRESS} />
                </li>
                <li className="flex justify-between items-center">
                  <span>Final Data Migration</span>
                  <MigrationStatusBadge status={MIGRATION_STATUS.PENDING} />
                </li>
                <li className="flex justify-between items-center">
                  <span>Admin Interface Updates</span>
                  <MigrationStatusBadge status={MIGRATION_STATUS.IN_PROGRESS} />
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Content Type Migration Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Content Type</TableHead>
                  <TableHead>Content Type ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contentTypeEntries.map(([contentType, status], index) => {
                  const contentTypeId = getContentTypeId(contentType);
                  const statusString = String(status);
                  const priority = statusString === MIGRATION_STATUS.PENDING ? 'Low' :
                                  statusString === MIGRATION_STATUS.IN_PROGRESS ? 'High' : 'Completed';
                  
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium capitalize">{contentType}</TableCell>
                      <TableCell>{contentTypeId}</TableCell>
                      <TableCell><MigrationStatusBadge status={statusString} /></TableCell>
                      <TableCell>{priority}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <div className="prose max-w-none">
          <h2>Migration Steps</h2>
          <ol>
            <li>
              <strong>Initial Setup (Completed)</strong>
              <p>Configuration of Contentful space and environment.</p>
            </li>
            <li>
              <strong>Core Content Types (Completed)</strong>
              <p>Set up primary content models like Products and Business Goals.</p>
            </li>
            <li>
              <strong>Extended Content Types (In Progress)</strong>
              <p>Development of specialized content types like Landing Pages and Case Studies.</p>
            </li>
            <li>
              <strong>Admin Interface Updates (In Progress)</strong>
              <p>Updating the admin interface to work with Contentful instead of legacy systems.</p>
            </li>
            <li>
              <strong>Final Data Migration (Pending)</strong>
              <p>Moving all remaining content to Contentful and retiring old systems.</p>
            </li>
          </ol>
          
          <h2>Development Guidelines</h2>
          <ul>
            <li>Always use Contentful for new content types</li>
            <li>Ensure proper error handling for transitional period</li>
            <li>Use the Content Management API for programmatic updates</li>
            <li>Create detailed TypeScript interfaces for all content models</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ContentfulMigrationGuide;
