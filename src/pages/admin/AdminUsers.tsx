import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, UserPlus } from 'lucide-react';

interface AdminUser {
  id: string;
  user_id: string;
  created_at: string;
  email?: string;
}

const AdminUsers: React.FC = () => {
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not an admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/sign-in');
    }
  }, [isAdmin, navigate]);

  // Fetch admin users
  const { data: adminUsers = [], isLoading, refetch } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*');
      
      if (error) {
        toast({
          title: 'Error fetching admin users',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
      
      // Process the data to retrieve user information
      const adminUsersWithEmail = await Promise.all(
        data.map(async (adminUser) => {
          try {
            // Try to get user details if possible
            const userResponse = await supabase.auth.admin.getUserById(adminUser.user_id);
            return {
              ...adminUser,
              email: userResponse?.data?.user?.email,
            };
          } catch (error) {
            console.error('Error fetching user details:', error);
            return adminUser;
          }
        })
      );
      
      return adminUsersWithEmail;
    },
    enabled: isAdmin,
  });
  
  const handleAddUser = async () => {
    setIsSubmitting(true);
    
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUserEmail,
        password: newUserPassword,
      });
      
      if (authError) {
        toast({
          title: 'Error creating user',
          description: authError.message,
          variant: 'destructive',
        });
        return;
      }
      
      if (authData.user) {
        // Add user to admin_users table
        const { error: adminError } = await supabase
          .from('admin_users')
          .insert([{ user_id: authData.user.id }]);
        
        if (adminError) {
          toast({
            title: 'Error adding admin role',
            description: adminError.message,
            variant: 'destructive',
          });
          return;
        }
        
        toast({
          title: 'Admin user created',
          description: `${newUserEmail} has been added as an admin`,
        });
        
        // Close dialog and refresh list
        setIsAddUserDialogOpen(false);
        setNewUserEmail('');
        setNewUserPassword('');
        refetch();
      }
    } catch (error) {
      console.error('Error adding admin user:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Admin User Management</h1>
          <Button onClick={() => setIsAddUserDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" /> Add Admin User
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Admin Users</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Loading admin users...</div>
            ) : adminUsers.length === 0 ? (
              <div className="text-center py-4">No admin users found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminUsers.map((adminUser) => (
                    <TableRow key={adminUser.id}>
                      <TableCell>
                        {/* Use optional chaining to check if email exists */}
                        {adminUser.email || 'Unknown email'}
                      </TableCell>
                      <TableCell>
                        {new Date(adminUser.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={adminUser.user_id === user?.id}
                          title={adminUser.user_id === user?.id ? "Cannot remove yourself" : "Remove admin"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        
        <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Admin User</DialogTitle>
              <DialogDescription>
                Create a new admin user with full access to the CMS.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••���•"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser} disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add User'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default AdminUsers;
