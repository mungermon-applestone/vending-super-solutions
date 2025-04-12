
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { LockIcon, MailIcon } from 'lucide-react';
import Layout from '@/components/layout/Layout';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, signUp, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // If user is already logged in and is an admin, redirect to admin dashboard
  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin');
    }
  }, [user, isAdmin, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
  };
  
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {isSignUp ? 'Create an account' : 'Sign in to your account'}
            </CardTitle>
            <CardDescription className="text-center">
              {isSignUp 
                ? 'Enter your email and create a password to create your account' 
                : 'Enter your email and password to access the admin panel'}
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                  ? 'Please wait...'
                  : isSignUp
                    ? 'Create account'
                    : 'Sign in'
                }
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center">
            <Button variant="link" onClick={toggleAuthMode}>
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : 'Don\'t have an account? Create one'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default SignIn;
