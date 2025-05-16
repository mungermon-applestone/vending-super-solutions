
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMachines } from '@/hooks/useMachinesData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import DeprecatedAdminLayout from '@/components/admin/layout/DeprecatedAdminLayout';
import { CMSMachine } from '@/types/cms';
import { logDeprecationWarning } from '@/services/cms/utils/deprecationLogger';
import ViewInContentful from '@/components/admin/ViewInContentful';

const AdminMachines = () => {
  const navigate = useNavigate();
  const { data: machines = [], isLoading } = useMachines();
  
  // Log deprecation of this admin page
  useEffect(() => {
    logDeprecationWarning(
      "AdminMachines",
      "The Machines admin interface is deprecated and will be removed in a future version.",
      "Please use Contentful to manage machine content."
    );
  }, []);
  
  return (
    <DeprecatedAdminLayout
      title="Machine Management"
      description="View all machines in the system (read-only)"
      contentType="Machine"
      backPath="/admin/dashboard"
    >
      <div className="flex justify-between mb-6">
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          Read-Only View
        </Badge>
        <ViewInContentful 
          contentType="machine"
          className="bg-blue-50 text-blue-700 border-blue-200"
        />
      </div>

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="text-center py-10">Loading machines...</div>
          ) : machines.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">No machines found</p>
              <ViewInContentful 
                contentType="machine"
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              />
            </div>
          ) : (
            <Table>
              <TableCaption>A list of all machines (read-only view).</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Temperature</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {machines.map((machine: CMSMachine) => (
                  <TableRow key={machine.id}>
                    <TableCell className="font-medium">{machine.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {machine.type || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {machine.temperature || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ViewInContentful 
                          contentType="machine"
                          contentId={machine.id}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/machines/${machine.slug}`)}
                          className="h-8 px-2 w-8"
                          title="View machine page"
                        >
                          <ChevronRight size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="border-t bg-gray-50 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            This interface is read-only. All content management should be done in Contentful.
          </p>
          <ViewInContentful 
            contentType="machine"
            size="sm"
          />
        </CardFooter>
      </Card>
    </DeprecatedAdminLayout>
  );
};

export default AdminMachines;
