import { signOut } from 'firebase/auth';
import { auth } from '../config/Firebase';
import { router } from 'expo-router';
import { Alert } from 'react-native';


export default async function handleLogout() {
  try {
    await signOut(auth);
    Alert.alert("Success", "You’ve been logged out.");
    router.replace("/(AuthScreens)/Login"); // or your actual login screen
  } catch (error: any) {
    console.error("Logout failed", error);
    Alert.alert("Logout Failed", error.message);
  }
}