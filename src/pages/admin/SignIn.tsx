
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { LockIcon, MailIcon, AlertCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('munger@applestonesolutions.com'); // Set default admin email
  const [password, setPassword] = useState('Password123!'); // Set default admin password
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { signIn, signUp, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // If user is already logged in and is an admin, redirect to admin dashboard
  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin');
    }
  }, [user, isAdmin, navigate]);
  
  // Handle signup for default admin if it doesn't exist
  const handleSignUpDefaultAdmin = async () => {
    if (email !== 'munger@applestonesolutions.com') {
      setErrorMessage("You can only sign up with the default admin credentials");
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      console.log("Creating default admin account");
      await signUp(email, password);
      
      // After sign-up, attempt to sign in
      console.log("Signing in with newly created admin account");
      await signIn(email, password);
      navigate('/admin');
    } catch (error: any) {
      console.error('Admin creation error:', error);
      setErrorMessage(error?.message || 'Failed to create admin account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      console.log("Submitting sign-in form with email:", email);
      await signIn(email, password);
      // If we reach here, sign-in was successful (no error thrown)
      console.log("Sign-in successful, navigating to admin dashboard");
      navigate('/admin');
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      // Special case for default admin - offer to create the account
      if (email === 'munger@applestonesolutions.com' && error?.message?.includes('Invalid login')) {
        setErrorMessage("Default admin account doesn't exist yet. Would you like to create it?");
      } else {
        setErrorMessage(error?.message || 'Invalid email or password. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Sign in to access admin panel
            </CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <div>{errorMessage}</div>
                </div>
                
                {errorMessage.includes("create it") && (
                  <Button 
                    onClick={handleSignUpDefaultAdmin}
                    className="mt-2 w-full"
                    disabled={isSubmitting}
                  >
                    Create Default Admin Account
                  </Button>
                )}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <MailIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email"
                    type="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password"
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={6}
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Signing in...'
                  : 'Sign in'
                }
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center text-sm text-muted-foreground">
            <p className="w-full">
              Default admin: munger@applestonesolutions.com / Password123!
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default SignIn;
