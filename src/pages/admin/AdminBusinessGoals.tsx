import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useBusinessGoals } from '@/hooks/useCMSData';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Edit, Eye, Trash2, Loader2 } from 'lucide-react';
import AdminControls from '@/components/admin/AdminControls';
import Layout from '@/components/layout/Layout';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { deleteBusinessGoal } from '@/services/businessGoal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AdminBusinessGoals = () => {
  const { data: businessGoals, isLoading, error } = useBusinessGoals();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State for delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<{ id: string; title: string; slug: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredGoals = searchTerm && businessGoals
    ? businessGoals.filter(goal => 
        goal.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        goal.slug.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : businessGoals;

  const handleDeleteClick = (goal: any) => {
    setGoalToDelete({
      id: goal.id,
      title: goal.title,
      slug: goal.slug
    });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!goalToDelete) return;
    
    try {
      setIsDeleting(true);
      await deleteBusinessGoal(goalToDelete.slug);
      
      toast({
        title: "Goal deleted",
        description: `${goalToDelete.title} has been deleted successfully.`
      });
      
      queryClient.invalidateQueries({ queryKey: ['businessGoals'] });
      
      setDeleteDialogOpen(false);
      setGoalToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete goal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

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
                        <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => navigate(`/goals/${goal.slug}`)}>
                          <Eye className="h-4 w-4" /> View
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => navigate(`/admin/business-goals/edit/${goal.slug}`)}>
                          <Edit className="h-4 w-4" /> Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteClick(goal)}
                        >
                          <Trash2 className="h-4 w-4" /> Delete
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the business goal "{goalToDelete?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AdminControls />
    </Layout>
  );
};

export default AdminBusinessGoals;
