
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{
    user: User | null;
    session: Session | null;
  } | undefined>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log('Auth state change:', event);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      // Check admin status when auth state changes
      if (currentSession?.user) {
        checkAdminStatus(currentSession.user.id);
      } else {
        setIsAdmin(false);
      }
    });

    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log('Current session:', currentSession);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Check admin status for existing session
        if (currentSession?.user) {
          checkAdminStatus(currentSession.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAdminStatus = async (userId: string) => {
    try {
      console.log('Checking admin status for user:', userId);
      // Use RPC function instead of direct table query
      const { data, error } = await supabase.rpc('is_admin', { uid: userId });
      
      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        return;
      }
      
      console.log('Admin status result:', data);
      setIsAdmin(data === true);

      // If this is the default admin email and not an admin yet, add them as admin
      if (!data && user?.email === 'munger@applestonesolutions.com') {
        const { error: insertError } = await supabase
          .from('admin_users')
          .insert({ user_id: userId });
        
        if (insertError) {
          console.error('Error adding default admin:', insertError);
        } else {
          console.log('Default admin added successfully');
          setIsAdmin(true);
        }
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('Attempting to sign in with email:', email);
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Sign-in error:', error.message);
        toast({
          title: "Sign-in failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      console.log('Sign-in successful, data:', data);
      
      // If this is the default admin, ensure they're in the admin_users table
      if (email === 'munger@applestonesolutions.com' && data.user) {
        await checkAdminStatus(data.user.id);
      }
      
      toast({
        title: "Signed in successfully",
        description: "Welcome back!",
      });
      return data;
    } catch (error) {
      console.error('Sign-in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        toast({
          title: "Sign-up failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      // If this is the default admin email, mark them as admin
      if (email === 'munger@applestonesolutions.com') {
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          const { error: insertError } = await supabase
            .from('admin_users')
            .insert({ user_id: userData.user.id });
          
          if (insertError) {
            console.error('Error adding admin status:', insertError);
          }
        }
      }
      
      toast({
        title: "Sign-up successful",
        description: "Your account has been created.",
      });
    } catch (error) {
      console.error('Sign-up error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
      });
    } catch (error) {
      console.error('Sign-out error:', error);
      toast({
        title: "Sign-out failed",
        description: "An error occurred during sign-out.",
        variant: "destructive",
      });
    }
  };

  const value = {
    session,
    user,
    isLoading,
    isAdmin,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
