import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../types';

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  type: 'toggle' | 'navigate' | 'action';
  icon: string;
  value?: boolean;
  onPress?: () => void;
}

type SettingsScreenNavigationProp = StackNavigationProp<StackParamList, 'MainTabs'>;

export default function SettingsScreen() {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => {
          Alert.alert('Logged out', 'You have been successfully logged out');
        }},
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. Are you sure you want to delete your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          Alert.alert('Account Deleted', 'Your account has been deleted');
        }},
      ]
    );
  };

  const settingsSections = [
    {
      title: 'Notifications',
      items: [
        {
          id: 'push-notifications',
          title: 'Push Notifications',
          subtitle: 'Receive notifications for new answers and comments',
          type: 'toggle' as const,
          icon: 'notifications-outline',
          value: notifications,
          onPress: () => setNotifications(!notifications),
        },
        {
          id: 'email-notifications',
          title: 'Email Notifications',
          subtitle: 'Receive email updates about your questions',
          type: 'toggle' as const,
          icon: 'mail-outline',
          value: emailNotifications,
          onPress: () => setEmailNotifications(!emailNotifications),
        },
      ],
    },
    {
      title: 'Appearance',
      items: [
        {
          id: 'dark-mode',
          title: 'Dark Mode',
          subtitle: 'Use dark theme throughout the app',
          type: 'toggle' as const,
          icon: 'moon-outline',
          value: theme.isDark,
          onPress: toggleTheme,
        },
      ],
    },
    {
      title: 'Content',
      items: [
        {
          id: 'auto-save',
          title: 'Auto Save',
          subtitle: 'Automatically save drafts while writing',
          type: 'toggle' as const,
          icon: 'save-outline',
          value: autoSave,
          onPress: () => setAutoSave(!autoSave),
        },
        {
          id: 'edit-profile',
          title: 'Edit Profile',
          subtitle: 'Update your profile information',
          type: 'navigate' as const,
          icon: 'person-outline',
          onPress: () => navigation.navigate('EditProfile', { user: { id: '1', name: 'John Doe', username: 'johndoe', email: 'john@example.com', profileImage: '', bio: '', location: '', website: '', reputation: 0, followers: 0, following: 0, isVerified: false, createdAt: new Date().toISOString() } }),
        },
        {
          id: 'privacy-settings',
          title: 'Privacy Settings',
          subtitle: 'Manage your privacy preferences',
          type: 'navigate' as const,
          icon: 'shield-outline',
          onPress: () => navigation.navigate('PrivacySettings'),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help-center',
          title: 'Help Center',
          subtitle: 'Get help and find answers',
          type: 'navigate' as const,
          icon: 'help-circle-outline',
          onPress: () => navigation.navigate('HelpSupport'),
        },
        {
          id: 'contact-support',
          title: 'Contact Support',
          subtitle: 'Get in touch with our support team',
          type: 'navigate' as const,
          icon: 'chatbubble-outline',
          onPress: () => navigation.navigate('HelpSupport'),
        },
        {
          id: 'report-bug',
          title: 'Report a Bug',
          subtitle: 'Help us improve by reporting issues',
          type: 'navigate' as const,
          icon: 'bug-outline',
          onPress: () => navigation.navigate('ReportBug'),
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          id: 'about-bisa',
          title: 'About BISA',
          subtitle: 'Learn more about our platform',
          type: 'navigate' as const,
          icon: 'information-circle-outline',
          onPress: () => navigation.navigate('AboutBisa'),
        },
        {
          id: 'terms-of-service',
          title: 'Terms of Service',
          subtitle: 'Read our terms and conditions',
          type: 'navigate' as const,
          icon: 'document-text-outline',
          onPress: () => navigation.navigate('TermsOfService'),
        },
        {
          id: 'privacy-policy',
          title: 'Privacy Policy',
          subtitle: 'Read our privacy policy',
          type: 'navigate' as const,
          icon: 'shield-checkmark-outline',
          onPress: () => navigation.navigate('PrivacyPolicy'),
        },
        {
          id: 'version',
          title: 'App Version',
          subtitle: 'Version 1.0.0',
          type: 'navigate' as const,
          icon: 'phone-portrait-outline',
          onPress: () => Alert.alert('App Version', 'BISA v1.0.0'),
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          id: 'logout',
          title: 'Logout',
          subtitle: 'Sign out of your account',
          type: 'action' as const,
          icon: 'log-out-outline',
          onPress: handleLogout,
        },
        {
          id: 'delete-account',
          title: 'Delete Account',
          subtitle: 'Permanently delete your account',
          type: 'action' as const,
          icon: 'trash-outline',
          onPress: handleDeleteAccount,
        },
      ],
    },
  ];

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}
      onPress={item.onPress}
      disabled={item.type === 'toggle'}
    >
      <View style={styles.settingItemLeft}>
        <View style={[styles.settingIcon, { backgroundColor: theme.colors.primary + '20' }]}>
          <Ionicons name={item.icon as any} size={20} color={theme.colors.textSecondary} />
        </View>
        <View style={styles.settingContent}>
          <Text style={[styles.settingTitle, { color: theme.colors.text }]}>{item.title}</Text>
          {item.subtitle && (
            <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>{item.subtitle}</Text>
          )}
        </View>
      </View>
      
      {item.type === 'toggle' ? (
        <Switch
          value={item.value}
          onValueChange={item.onPress}
          trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
          thumbColor={item.value ? '#ffffff' : '#ffffff'}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar 
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{section.title}</Text>
            <View style={[styles.sectionContent, { backgroundColor: theme.colors.surface }]}>
              {section.items.map(renderSettingItem)}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  sectionContent: {
    backgroundColor: '#ffffff',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#1a1a1a',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
}); 