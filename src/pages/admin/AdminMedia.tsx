
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminMedia = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Media Library</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Media Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Media management functionality is currently disabled to resolve compatibility issues.
            Please check back in a future update.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMedia;
