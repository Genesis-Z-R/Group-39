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
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../types';
import { useTheme } from '../utils/ThemeContext';

type PrivacySettingsScreenNavigationProp = StackNavigationProp<StackParamList, 'MainTabs'>;

interface PrivacyOption {
  id: string;
  title: string;
  description: string;
  type: 'toggle' | 'navigate' | 'action';
  icon: string;
  value?: boolean;
  onPress?: () => void;
}

export default function PrivacySettingsScreen() {
  const navigation = useNavigation<PrivacySettingsScreenNavigationProp>();
  const { theme } = useTheme();
  
  // Privacy state
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [showEmail, setShowEmail] = useState(false);
  const [showLocation, setShowLocation] = useState(true);
  const [allowMessages, setAllowMessages] = useState(true);
  const [allowMentions, setAllowMentions] = useState(true);
  const [dataCollection, setDataCollection] = useState(true);
  const [analytics, setAnalytics] = useState(true);
  const [personalizedAds, setPersonalizedAds] = useState(false);

  const handleDataExport = () => {
    Alert.alert(
      'Export Data',
      'Your data will be prepared and sent to your email within 24 hours.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => {
          Alert.alert('Success', 'Data export request submitted. You will receive an email when ready.');
        }},
      ]
    );
  };

  const handleDeleteData = () => {
    Alert.alert(
      'Delete All Data',
      'This will permanently delete all your data including questions, answers, and profile information. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          Alert.alert('Data Deleted', 'All your data has been permanently deleted.');
        }},
      ]
    );
  };

  const privacySections = [
    {
      title: 'Profile Privacy',
      items: [
        {
          id: 'profile-visibility',
          title: 'Profile Visibility',
          description: 'Control who can see your profile',
          type: 'navigate' as const,
          icon: 'eye-outline',
          onPress: () => {
            Alert.alert(
              'Profile Visibility',
              'Choose your profile visibility:',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Public', onPress: () => setProfileVisibility('public') },
                { text: 'Friends Only', onPress: () => setProfileVisibility('friends') },
                { text: 'Private', onPress: () => setProfileVisibility('private') },
              ]
            );
          },
        },
        {
          id: 'show-email',
          title: 'Show Email Address',
          description: 'Display your email on your profile',
          type: 'toggle' as const,
          icon: 'mail-outline',
          value: showEmail,
          onPress: () => setShowEmail(!showEmail),
        },
        {
          id: 'show-location',
          title: 'Show Location',
          description: 'Display your location on your profile',
          type: 'toggle' as const,
          icon: 'location-outline',
          value: showLocation,
          onPress: () => setShowLocation(!showLocation),
        },
      ],
    },
    {
      title: 'Communication',
      items: [
        {
          id: 'allow-messages',
          title: 'Allow Direct Messages',
          description: 'Let other users send you private messages',
          type: 'toggle' as const,
          icon: 'chatbubble-outline',
          value: allowMessages,
          onPress: () => setAllowMessages(!allowMessages),
        },
        {
          id: 'allow-mentions',
          title: 'Allow Mentions',
          description: 'Let others mention you in posts and comments',
          type: 'toggle' as const,
          icon: 'at-outline',
          value: allowMentions,
          onPress: () => setAllowMentions(!allowMentions),
        },
      ],
    },
    {
      title: 'Data & Analytics',
      items: [
        {
          id: 'data-collection',
          title: 'Data Collection',
          description: 'Allow us to collect usage data to improve the app',
          type: 'toggle' as const,
          icon: 'analytics-outline',
          value: dataCollection,
          onPress: () => setDataCollection(!dataCollection),
        },
        {
          id: 'analytics',
          title: 'Analytics',
          description: 'Help us improve by sharing anonymous usage statistics',
          type: 'toggle' as const,
          icon: 'bar-chart-outline',
          value: analytics,
          onPress: () => setAnalytics(!analytics),
        },
        {
          id: 'personalized-ads',
          title: 'Personalized Ads',
          description: 'Show ads based on your interests and activity',
          type: 'toggle' as const,
          icon: 'megaphone-outline',
          value: personalizedAds,
          onPress: () => setPersonalizedAds(!personalizedAds),
        },
      ],
    },
    {
      title: 'Data Management',
      items: [
        {
          id: 'export-data',
          title: 'Export My Data',
          description: 'Download a copy of all your data',
          type: 'action' as const,
          icon: 'download-outline',
          onPress: handleDataExport,
        },
        {
          id: 'delete-data',
          title: 'Delete All Data',
          description: 'Permanently delete all your data from our servers',
          type: 'action' as const,
          icon: 'trash-outline',
          onPress: handleDeleteData,
        },
      ],
    },
  ];

  const renderPrivacyItem = (item: PrivacyOption) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.privacyItem, { borderBottomColor: theme.colors.border }]}
      onPress={item.onPress}
      disabled={item.type === 'toggle'}
    >
      <View style={styles.privacyItemLeft}>
        <View style={[styles.privacyIcon, { backgroundColor: theme.colors.primary + '20' }]}>
          <Ionicons name={item.icon as any} size={20} color={theme.colors.textSecondary} />
        </View>
        <View style={styles.privacyContent}>
          <Text style={[styles.privacyTitle, { color: theme.colors.text }]}>{item.title}</Text>
          <Text style={[styles.privacyDescription, { color: theme.colors.textSecondary }]}>
            {item.description}
          </Text>
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
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Privacy Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Privacy Summary */}
        <View style={[styles.summarySection, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.summaryHeader}>
            <Ionicons name="shield-checkmark" size={24} color={theme.colors.primary} />
            <Text style={[styles.summaryTitle, { color: theme.colors.text }]}>Your Privacy</Text>
          </View>
          <Text style={[styles.summaryText, { color: theme.colors.textSecondary }]}>
            Control how your information is shared and used. Your privacy is important to us.
          </Text>
        </View>

        {/* Privacy Sections */}
        {privacySections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{section.title}</Text>
            <View style={[styles.sectionContent, { backgroundColor: theme.colors.surface }]}>
              {section.items.map(renderPrivacyItem)}
            </View>
          </View>
        ))}

        {/* Privacy Policy Link */}
        <View style={[styles.policySection, { backgroundColor: theme.colors.surface }]}>
          <TouchableOpacity
            style={styles.policyLink}
            onPress={() => navigation.navigate('PrivacyPolicy')}
          >
            <Ionicons name="document-text-outline" size={20} color={theme.colors.primary} />
            <Text style={[styles.policyText, { color: theme.colors.primary }]}>
              Read our Privacy Policy
            </Text>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  summarySection: {
    padding: 20,
    marginBottom: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  sectionContent: {
    backgroundColor: '#ffffff',
  },
  privacyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  privacyItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  privacyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  privacyContent: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 16,
    color: '#1a1a1a',
    marginBottom: 2,
  },
  privacyDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  policySection: {
    padding: 20,
    marginBottom: 16,
  },
  policyLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  policyText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginLeft: 12,
  },
}); 