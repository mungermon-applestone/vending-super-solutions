
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useTechnologySections } from '@/hooks/useTechnologySections';
import TechnologyTableRow from '@/components/admin/technology/TechnologyTableRow';
import StrapiIntegrationInfo from '@/components/admin/technology/StrapiIntegrationInfo';
import { getCMSInfo } from '@/services/cms/utils/cmsInfo';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { cloneTechnology, deleteTechnology } from '@/services/cms/technology';
import { CMSTechnology } from '@/types/cms';

const TechnologyList: React.FC = () => {
  const { technologies, isLoading } = useTechnologySections();
  const cmsInfo = getCMSInfo();
  const isStrapi = cmsInfo.provider === 'Strapi';
  const { toast } = useToast();
  const [isCloningId, setIsCloningId] = useState<string | null>(null);
  
  const handleDeleteClick = (technology: CMSTechnology) => {
    // This would normally open a confirmation dialog
    console.log(`Delete clicked for ${technology.title}`);
  };
  
  const handleCloneClick = async (technology: CMSTechnology) => {
    try {
      setIsCloningId(technology.id);
      await cloneTechnology(technology.id, { toast });
    } catch (error) {
      console.error('Error cloning technology:', error);
    } finally {
      setIsCloningId(null);
    }
  };
  
  return (
    <Layout>
      <div className="container py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Technologies</h1>
            <p className="text-muted-foreground">
              Manage the technologies you offer to customers
            </p>
          </div>
          <Button asChild>
            <Link to="/admin/technology/new">
              <PlusCircle className="h-4 w-4 mr-2" /> 
              Add Technology
            </Link>
          </Button>
        </div>
        
        {/* Show Strapi Integration Info when using Strapi */}
        {isStrapi && <StrapiIntegrationInfo />}
        
        <Card>
          <CardHeader>
            <CardTitle>All Technologies</CardTitle>
            <CardDescription>
              {isLoading 
                ? "Loading technologies..." 
                : `${technologies.length} technologies found`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <div className="grid grid-cols-12 border-b px-4 py-2 bg-muted/40 font-medium">
                <div className="col-span-5">Name</div>
                <div className="col-span-3">Slug</div>
                <div className="col-span-2">Visibility</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>
              
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-12 px-4 py-3 border-b last:border-b-0 items-center">
                    <div className="col-span-5"><Skeleton className="h-6 w-full max-w-[200px]" /></div>
                    <div className="col-span-3"><Skeleton className="h-6 w-full max-w-[120px]" /></div>
                    <div className="col-span-2"><Skeleton className="h-6 w-16" /></div>
                    <div className="col-span-2 flex justify-end gap-2">
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  </div>
                ))
              ) : technologies.length === 0 ? (
                <div className="px-4 py-10 text-center text-muted-foreground">
                  No technologies found. Create your first technology to get started.
                </div>
              ) : (
                technologies.map(technology => (
                  <TechnologyTableRow 
                    key={technology.id} 
                    technology={technology}
                    onDeleteClick={handleDeleteClick}
                    onCloneClick={handleCloneClick}
                    isCloningId={isCloningId}
                  />
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TechnologyList;
