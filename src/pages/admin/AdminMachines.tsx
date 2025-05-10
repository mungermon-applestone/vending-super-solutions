
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMachines } from '@/hooks/useMachinesData';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Edit, ChevronRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import DeprecatedAdminLayout from '@/components/admin/layout/DeprecatedAdminLayout';
import { CMSMachine } from '@/types/cms';
import { logDeprecationWarning } from '@/services/cms/utils/deprecationLogger';

const AdminMachines = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: machines = [], isLoading } = useMachines();
  
  // Log deprecation of this admin page
  React.useEffect(() => {
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
        <div></div>
        <Button 
          onClick={() => navigate('/admin/machines/new')}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Add New Machine in Contentful
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="text-center py-10">Loading machines...</div>
          ) : machines.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">No machines found</p>
              <Button onClick={() => navigate('/admin/machines/new')}>
                Create Your First Machine
              </Button>
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/machines/edit/${machine.id}`)}
                          className="h-8 px-2 w-8"
                          title="Edit machine in Contentful"
                        >
                          <Edit size={16} />
                        </Button>
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
      </Card>
    </DeprecatedAdminLayout>
  );
};

export default AdminMachines;
