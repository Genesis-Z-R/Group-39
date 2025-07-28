import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { onAuthStateChanged, getIdToken, User as FirebaseUser } from "firebase/auth";
import { auth } from "../config/Firebase";
import { syncUserWithBackend } from "../services/api";

interface AuthContextType {
  user: FirebaseUser | null;
  token: string;
  loading: boolean;
  setToken: (token: string) => void;
  syncUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  token: "", 
  loading: true, 
  setToken: () => {},
  syncUser: async () => {}
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  // Function to sync user with backend
  const syncUser = async () => {
    if (user && token) {
      try {
        console.log('🔄 Syncing user with backend...');
        const backendUser = await syncUserWithBackend(token);
        console.log('✅ User synced with backend:', backendUser);
      } catch (error) {
        console.error('❌ Failed to sync user with backend:', error);
        // Don't throw error - this shouldn't break the auth flow
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const t = await getIdToken(firebaseUser, true); // true = force refresh
        setToken(t);
        console.log('Firebase ID Token:', t);
        
        // Automatically sync user with backend after authentication
        setTimeout(() => {
          syncUserWithBackend(t).then(backendUser => {
            console.log('✅ User automatically synced with backend:', backendUser);
          }).catch(error => {
            console.error('❌ Auto-sync failed:', error);
          });
        }, 1000); // Small delay to ensure token is properly set
      } else {
        setToken("");
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, setToken, syncUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 