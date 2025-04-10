
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBusinessGoals } from '@/hooks/useCMSData';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Edit, ExternalLink } from 'lucide-react';
import AdminControls from '@/components/admin/AdminControls';
import Layout from '@/components/layout/Layout';
import { Skeleton } from '@/components/ui/skeleton';

const AdminBusinessGoals = () => {
  const { data: businessGoals, isLoading, error } = useBusinessGoals();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGoals = searchTerm && businessGoals
    ? businessGoals.filter(goal => 
        goal.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        goal.slug.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : businessGoals;

  return (
    <Layout>
      <div className="container py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold">Business Goals Admin</h1>
          <Button asChild>
            <Link to="/admin/business-goals/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Business Goal
            </Link>
          </Button>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/3">
                <input
                  type="text"
                  placeholder="Search goals..."
                  className="w-full px-3 py-2 border rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <p className="text-muted-foreground">
                  {filteredGoals ? filteredGoals.length : '0'} business goals found
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-64" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-red-500">Error loading business goals: {error.message}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredGoals?.length === 0 ? (
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">
                    No business goals found. Create one to get started!
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredGoals?.map((goal) => (
                <Card key={goal.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h2 className="text-xl font-semibold">{goal.title}</h2>
                        <p className="text-muted-foreground">/{goal.slug}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/goals/${goal.slug}`} target="_blank">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                        <Button asChild size="sm">
                          <Link to={`/admin/business-goals/edit/${goal.slug}`}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
      <AdminControls />
    </Layout>
  );
};

export default AdminBusinessGoals;
