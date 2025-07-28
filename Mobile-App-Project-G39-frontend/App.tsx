import { ScreenContent } from 'components/ScreenContent';
import { StatusBar } from 'expo-status-bar';
import './global.css';
import { AuthProvider } from './src/context/authContext';

export default function App() {
  return (
    <AuthProvider>
      <ScreenContent title="Home" path="App.tsx"></ScreenContent>
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
