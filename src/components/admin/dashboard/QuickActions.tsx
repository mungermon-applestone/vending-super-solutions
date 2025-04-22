
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Settings, Users, FileText, Image } from 'lucide-react';
import { Link } from 'react-router-dom';
import CMSConfigInfo from './CMSConfigInfo';

const QuickActions = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Add Content</CardTitle>
              <CardDescription>Create new content items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Button asChild variant="outline" className="justify-start">
                  <Link to="/admin/products/new">
                    <Plus className="mr-2 h-4 w-4" /> New Product Type
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <Link to="/admin/machines/new">
                    <Plus className="mr-2 h-4 w-4" /> New Machine
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <Link to="/admin/technology/new">
                    <Plus className="mr-2 h-4 w-4" /> New Technology
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Manage</CardTitle>
              <CardDescription>Site administration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Button asChild variant="outline" className="justify-start">
                  <Link to="/admin/users">
                    <Users className="mr-2 h-4 w-4" /> Users
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <Link to="/admin/settings">
                    <Settings className="mr-2 h-4 w-4" /> Settings
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <Link to="/admin/media">
                    <Image className="mr-2 h-4 w-4" /> Media Library
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Content</CardTitle>
              <CardDescription>Edit existing content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Button asChild variant="outline" className="justify-start">
                  <Link to="/admin/landing-pages">
                    <FileText className="mr-2 h-4 w-4" /> Landing Pages
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <Link to="/admin/blog">
                    <FileText className="mr-2 h-4 w-4" /> Blog Posts
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <Link to="/admin/case-studies">
                    <FileText className="mr-2 h-4 w-4" /> Case Studies
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <CMSConfigInfo />
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
