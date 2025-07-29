import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StackParamList } from '../types';
import AuthGuard from '../components/AuthGuard';

import TabNavigator from './TabNavigator';
import QuestionDetailScreen from '../screens/QuestionDetailScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import AskQuestionScreen from '../screens/AskQuestionScreen';
import EditQuestionScreen from '../screens/EditQuestionScreen';
import EditAnswerScreen from '../screens/EditAnswerScreen';
import TagQuestionsScreen from '../screens/TagQuestionsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import PrivacySettingsScreen from '../screens/PrivacySettingsScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import TermsOfServiceScreen from '../screens/TermsOfServiceScreen';
import ReportBugScreen from '../screens/ReportBugScreen';
import HelpSupportScreen from '../screens/HelpSupportScreen';
import AboutBisaScreen from '../screens/AboutBisaScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';

const Stack = createStackNavigator<StackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MainTabs"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#ffffff',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: '#1a1a1a',
          },
          headerTintColor: '#1a73e8',
        }}
      >
        <Stack.Screen 
          name="MainTabs" 
          component={AuthGuard}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="QuestionDetail" 
          component={QuestionDetailScreen}
          options={{ title: 'Question' }}
        />
        <Stack.Screen 
          name="UserProfile" 
          component={UserProfileScreen}
          options={{ title: 'Profile' }}
        />
        <Stack.Screen 
          name="AskQuestion" 
          component={AskQuestionScreen}
          options={{ title: 'Ask Question' }}
        />
        <Stack.Screen 
          name="EditQuestion" 
          component={EditQuestionScreen}
          options={{ title: 'Edit Question' }}
        />
        <Stack.Screen 
          name="EditAnswer" 
          component={EditAnswerScreen}
          options={{ title: 'Edit Answer' }}
        />
        <Stack.Screen 
          name="TagQuestions" 
          component={TagQuestionsScreen}
          options={{ title: 'Questions' }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
                    <Stack.Screen
              name="EditProfile"
              component={EditProfileScreen}
              options={{ title: 'Edit Profile' }}
            />
            <Stack.Screen
              name="PrivacySettings"
              component={PrivacySettingsScreen}
              options={{ title: 'Privacy Settings' }}
            />
            <Stack.Screen
              name="PrivacyPolicy"
              component={PrivacyPolicyScreen}
              options={{ title: 'Privacy Policy' }}
            />
            <Stack.Screen
              name="TermsOfService"
              component={TermsOfServiceScreen}
              options={{ title: 'Terms of Service' }}
            />
            <Stack.Screen
              name="ReportBug"
              component={ReportBugScreen}
              options={{ title: 'Report a Bug' }}
            />
            <Stack.Screen
              name="HelpSupport"
              component={HelpSupportScreen}
              options={{ title: 'Help & Support' }}
            />
            <Stack.Screen
              name="AboutBisa"
              component={AboutBisaScreen}
              options={{ title: 'About Bisa' }}
            />
            <Stack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
    </NavigationContainer>
  );
} 