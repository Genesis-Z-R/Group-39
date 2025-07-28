import React, { createContext, useContext, useState } from 'react';
import { mockUsers } from '../services/mockData';
import { User } from '../types';
import { getUsers, saveUsers, getCurrentUser, saveCurrentUser, removeCurrentUser, seedAllMockData } from './storage';
import { useEffect } from 'react';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => boolean;
  signUp: (userData: Partial<User> & { password: string }) => boolean;
  signOut: () => void;
  updateUser: (userData: Partial<User>) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    (async () => {
      await seedAllMockData();
      const loadedUsers = await getUsers();
      setUsers(loadedUsers.length ? loadedUsers : mockUsers);
      const loadedUser = await getCurrentUser();
      setUser(loadedUser);
    })();
  }, []);

  useEffect(() => {
    saveUsers(users);
  }, [users]);

  useEffect(() => {
    if (user) saveCurrentUser(user);
    else removeCurrentUser();
  }, [user]);

  const signIn = (email: string, password: string): boolean => {
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      return true;
    }
    return false;
  };

  const signUp = (userData: Partial<User> & { password: string }): boolean => {
    if (users.find(u => u.email === userData.email)) {
      return false;
    }
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name || '',
      username: userData.username || '',
      email: userData.email || '',
      password: userData.password,
      profileImage: userData.profileImage,
      bio: userData.bio,
      location: userData.location,
      website: userData.website,
      reputation: 0,
      followers: 0,
      following: 0,
      isVerified: false,
      createdAt: new Date(),
    };
    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    return true;
  };

  const signOut = () => {
    setUser(null);
  };

  const updateUser = (userData: Partial<User>): boolean => {
    if (!user) return false;
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, ...userData } : u));
    setUser(prev => prev ? { ...prev, ...userData } : prev);
    return true;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 