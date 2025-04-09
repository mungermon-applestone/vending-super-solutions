
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Monitor, Plus, Pencil, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTechnologies } from '@/services/cms';
import { CMSTechnology } from '@/types/cms';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useQueryClient, useQuery } from '@tanstack/react-query';

const AdminTechnology = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const {
    data: technologies,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['technologies'],
    queryFn: getTechnologies,
  });

  useEffect(() => {
    if (isError && error) {
      toast({
        variant: "destructive",
        title: "Error loading technologies",
        description: error.message || "Failed to load technology data"
      });
    }
  }, [isError, error, toast]);

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Monitor className="h-6 w-6" /> Technology Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage technology platform features and content
            </p>
          </div>
          <Button asChild className="gap-1">
            <Link to="/admin/technology/new">
              <Plus className="h-4 w-4" /> New Technology
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Technology Entries</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-md" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : technologies?.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Sections</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {technologies.map((tech) => (
                    <TableRow key={tech.id}>
                      <TableCell className="font-medium">{tech.title}</TableCell>
                      <TableCell>{tech.slug}</TableCell>
                      <TableCell>{tech.sections?.length || 0}</TableCell>
                      <TableCell>
                        <Badge variant={tech.visible ? "outline" : "secondary"}>
                          {tech.visible ? (
                            <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                          ) : (
                            <AlertCircle className="h-3 w-3 mr-1 text-amber-500" />
                          )}
                          {tech.visible ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/technology/${tech.slug}`}>
                            View
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/admin/technology/edit/${tech.slug}`}>
                            <Pencil className="h-3 w-3 mr-1" /> Edit
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-3 w-3 mr-1 text-red-500" /> Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete "{tech.title}" and all associated data.
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => {
                                  // TODO: Implement delete functionality
                                  toast({
                                    title: "Technology deleted",
                                    description: `${tech.title} has been deleted`
                                  });
                                }}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <h3 className="text-lg font-medium">No technologies found</h3>
                <p className="text-muted-foreground mt-1">
                  Get started by creating your first technology entry
                </p>
                <Button className="mt-4" asChild>
                  <Link to="/admin/technology/new">
                    <Plus className="h-4 w-4 mr-2" /> Create Technology
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminTechnology;
