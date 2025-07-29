import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { User } from '../types';

// Convert Firebase User to our User type
const convertFirebaseUserToUser = (firebaseUser: FirebaseUser): User => {
  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || '',
    username: firebaseUser.displayName || '',
    email: firebaseUser.email || '',
    profileImage: firebaseUser.photoURL || undefined,
    bio: '',
    location: '',
    website: '',
    reputation: 0,
    followers: 0,
    following: 0,
    isVerified: firebaseUser.emailVerified,
    createdAt: new Date(firebaseUser.metadata.creationTime || Date.now()),
  };
};

// Authentication service class
export class FirebaseAuthService {
  // Sign up with email and password
  static async signUp(email: string, password: string, displayName?: string): Promise<User> {
    try {
      console.log('🔥 Firebase: Starting sign up for:', email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name if provided
      if (displayName && userCredential.user) {
        try {
          await updateProfile(userCredential.user, {
            displayName: displayName
          });
          console.log('✅ Firebase: Profile updated with display name');
        } catch (profileError) {
          console.warn('⚠️ Firebase: Failed to update profile:', profileError);
        }
      }

      // Send email verification
      if (userCredential.user) {
        try {
          await sendEmailVerification(userCredential.user);
          console.log('✅ Firebase: Email verification sent');
        } catch (verificationError) {
          console.warn('⚠️ Firebase: Failed to send email verification:', verificationError);
        }
      }

      const user = convertFirebaseUserToUser(userCredential.user);
      console.log('✅ Firebase: User created successfully:', user.id);
      return user;
    } catch (error: any) {
      console.error('❌ Firebase: Sign up failed:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Sign in with email and password
  static async signIn(email: string, password: string): Promise<User> {
    try {
      console.log('🔥 Firebase: Starting sign in for:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = convertFirebaseUserToUser(userCredential.user);
      console.log('✅ Firebase: Sign in successful:', user.id);
      return user;
    } catch (error: any) {
      console.error('❌ Firebase: Sign in failed:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Sign out
  static async signOut(): Promise<void> {
    try {
      console.log('🔥 Firebase: Starting sign out');
      await signOut(auth);
      console.log('✅ Firebase: Sign out successful');
    } catch (error: any) {
      console.error('❌ Firebase: Sign out failed:', error);
      throw new Error('Failed to sign out');
    }
  }

  // Get current user
  static getCurrentUser(): User | null {
    try {
      const firebaseUser = auth.currentUser;
      return firebaseUser ? convertFirebaseUserToUser(firebaseUser) : null;
    } catch (error) {
      console.error('❌ Firebase: Failed to get current user:', error);
      return null;
    }
  }

  // Listen to auth state changes
  static onAuthStateChange(callback: (user: User | null) => void): () => void {
    try {
      console.log('🔥 Firebase: Setting up auth state listener');
      return onAuthStateChanged(auth, (firebaseUser) => {
        try {
          const user = firebaseUser ? convertFirebaseUserToUser(firebaseUser) : null;
          console.log('🔄 Firebase: Auth state changed:', user ? user.id : 'null');
          callback(user);
        } catch (error) {
          console.error('❌ Firebase: Error in auth state callback:', error);
          callback(null);
        }
      });
    } catch (error) {
      console.error('❌ Firebase: Failed to set up auth state listener:', error);
      // Return a no-op function to prevent crashes
      return () => {};
    }
  }

  // Reset password
  static async resetPassword(email: string): Promise<void> {
    try {
      console.log('🔥 Firebase: Starting password reset for:', email);
      await sendPasswordResetEmail(auth, email);
      console.log('✅ Firebase: Password reset email sent');
    } catch (error: any) {
      console.error('❌ Firebase: Password reset failed:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Update user profile
  static async updateProfile(updates: { displayName?: string; photoURL?: string }): Promise<void> {
    try {
      console.log('🔥 Firebase: Starting profile update');
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No user is currently signed in');
      }
      await updateProfile(currentUser, updates);
      console.log('✅ Firebase: Profile updated successfully');
    } catch (error: any) {
      console.error('❌ Firebase: Profile update failed:', error);
      throw new Error('Failed to update profile');
    }
  }

  // Get error messages
  private static getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again';
      case 'auth/invalid-email':
        return 'Please enter a valid email address';
      case 'auth/weak-password':
        return 'Password is too weak. Please choose a stronger password';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/operation-not-allowed':
        return 'This operation is not allowed';
      case 'auth/invalid-credential':
        return 'Invalid credentials. Please check your email and password';
      default:
        return 'An error occurred. Please try again';
    }
  }
} 