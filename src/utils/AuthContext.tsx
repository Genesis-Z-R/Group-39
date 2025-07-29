import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { FirebaseAuthService } from '../services/firebaseAuth';
import { Alert } from 'react-native';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  isLoading: boolean; // Add this for backward compatibility
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, displayName?: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase auth state changes
  useEffect(() => {
    console.log('🔄 AuthContext: Setting up Firebase auth listener');
    
    try {
      const unsubscribe = FirebaseAuthService.onAuthStateChange((firebaseUser) => {
        console.log('🔄 AuthContext: Auth state changed:', firebaseUser ? firebaseUser.id : 'null');
        setUser(firebaseUser);
        setLoading(false);
      });

      return () => {
        console.log('🔄 AuthContext: Cleaning up auth listener');
        unsubscribe();
      };
    } catch (error) {
      console.error('❌ AuthContext: Failed to set up auth listener:', error);
      setLoading(false);
      return () => {};
    }
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const user = await FirebaseAuthService.signIn(email, password);
      setUser(user);
      return true;
    } catch (error: any) {
      console.error('❌ AuthContext: Sign in failed:', error);
      Alert.alert('Sign In Failed', error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, displayName?: string): Promise<boolean> => {
    try {
      setLoading(true);
      const user = await FirebaseAuthService.signUp(email, password, displayName);
      setUser(user);
      Alert.alert(
        'Account Created', 
        'Your account has been created successfully! Please check your email for verification.'
      );
      return true;
    } catch (error: any) {
      console.error('❌ AuthContext: Sign up failed:', error);
      Alert.alert('Sign Up Failed', error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      await FirebaseAuthService.signOut();
      setUser(null);
    } catch (error: any) {
      console.error('❌ AuthContext: Sign out failed:', error);
      Alert.alert('Sign Out Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (!user) return false;
      
      // Update Firebase profile if displayName or photoURL changed
      const firebaseUpdates: { displayName?: string; photoURL?: string } = {};
      if (userData.name && userData.name !== user.name) {
        firebaseUpdates.displayName = userData.name;
      }
      if (userData.profileImage && userData.profileImage !== user.profileImage) {
        firebaseUpdates.photoURL = userData.profileImage;
      }

      if (Object.keys(firebaseUpdates).length > 0) {
        await FirebaseAuthService.updateProfile(firebaseUpdates);
      }

      // Update local user state
      setUser(prev => prev ? { ...prev, ...userData } : prev);
      return true;
    } catch (error: any) {
      console.error('❌ AuthContext: Update user failed:', error);
      Alert.alert('Update Failed', error.message);
      return false;
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      await FirebaseAuthService.resetPassword(email);
      Alert.alert(
        'Password Reset', 
        'Password reset email sent! Please check your inbox.'
      );
    } catch (error: any) {
      console.error('❌ AuthContext: Reset password failed:', error);
      Alert.alert('Password Reset Failed', error.message);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    isLoading: loading, // Add this for backward compatibility
    signIn,
    signUp,
    signOut,
    updateUser,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 