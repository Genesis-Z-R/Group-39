import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useTheme } from '../utils/ThemeContext';
import { useAuth } from '../utils/AuthContext';
import { User } from '../types';

interface DrawerItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  badge?: number;
  isSection?: boolean;
  isToggle?: boolean;
  toggleValue?: boolean;
  onToggleChange?: (value: boolean) => void;
}

interface DrawerSection {
  title: string;
  items: DrawerItem[];
}

export default function CustomDrawerContent(props: any) {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(theme.dark);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              navigation.reset({
                index: 0,
                routes: [{ name: 'SignIn' }],
              });
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  const drawerSections: DrawerSection[] = [
    {
      title: 'Main',
      items: [
        {
          id: 'home',
          title: 'Home',
          icon: 'home-outline',
          onPress: () => navigation.navigate('MainTabs', { screen: 'Home' }),
        },
        {
          id: 'search',
          title: 'Search',
          icon: 'search-outline',
          onPress: () => navigation.navigate('MainTabs', { screen: 'Search' }),
        },
        {
          id: 'ask',
          title: 'Ask Question',
          icon: 'add-circle-outline',
          onPress: () => navigation.navigate('MainTabs', { screen: 'Ask' }),
        },
        {
          id: 'notifications',
          title: 'Notifications',
          icon: 'notifications-outline',
          onPress: () => navigation.navigate('MainTabs', { screen: 'Notifications' }),
          badge: 3,
        },
      ],
    },
    {
      title: 'Community',
      items: [
        {
          id: 'spaces',
          title: 'Spaces',
          icon: 'people-outline',
          onPress: () => Alert.alert('Spaces', 'Community spaces feature coming soon!'),
        },
        {
          id: 'following',
          title: 'Following',
          icon: 'heart-outline',
          onPress: () => Alert.alert('Following', 'Following feature coming soon!'),
        },
        {
          id: 'bookmarks',
          title: 'Bookmarks',
          icon: 'bookmark-outline',
          onPress: () => Alert.alert('Bookmarks', 'Bookmarks feature coming soon!'),
        },
        {
          id: 'my-questions',
          title: 'My Questions',
          icon: 'help-circle-outline',
          onPress: () => Alert.alert('My Questions', 'My questions feature coming soon!'),
        },
        {
          id: 'my-answers',
          title: 'My Answers',
          icon: 'chatbubble-outline',
          onPress: () => Alert.alert('My Answers', 'My answers feature coming soon!'),
        },
      ],
    },
    {
      title: 'Settings',
      items: [
        {
          id: 'profile',
          title: 'Edit Profile',
          icon: 'person-outline',
          onPress: () => navigation.navigate('EditProfile', { 
            user: {
              ...user,
              createdAt: user?.createdAt?.toISOString() || new Date().toISOString()
            } as User 
          }),
        },
        {
          id: 'settings',
          title: 'Settings',
          icon: 'settings-outline',
          onPress: () => navigation.navigate('Settings'),
        },
        {
          id: 'privacy',
          title: 'Privacy Settings',
          icon: 'shield-outline',
          onPress: () => navigation.navigate('PrivacySettings'),
        },
        {
          id: 'notifications-toggle',
          title: 'Push Notifications',
          icon: 'notifications-outline',
          isToggle: true,
          toggleValue: notificationsEnabled,
          onToggleChange: setNotificationsEnabled,
        },
        {
          id: 'dark-mode',
          title: 'Dark Mode',
          icon: 'moon-outline',
          isToggle: true,
          toggleValue: darkModeEnabled,
          onToggleChange: (value) => {
            setDarkModeEnabled(value);
            toggleTheme();
          },
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          title: 'Help & Support',
          icon: 'help-circle-outline',
          onPress: () => navigation.navigate('HelpSupport'),
        },
        {
          id: 'about',
          title: 'About BISA',
          icon: 'information-circle-outline',
          onPress: () => navigation.navigate('AboutBisa'),
        },
        {
          id: 'feedback',
          title: 'Send Feedback',
          icon: 'chatbox-outline',
          onPress: () => Alert.alert('Feedback', 'Open feedback form'),
        },
        {
          id: 'report-bug',
          title: 'Report a Bug',
          icon: 'bug-outline',
          onPress: () => navigation.navigate('ReportBug'),
        },
      ],
    },
    {
      title: 'Legal',
      items: [
        {
          id: 'privacy-policy',
          title: 'Privacy Policy',
          icon: 'shield-checkmark-outline',
          onPress: () => navigation.navigate('PrivacyPolicy'),
        },
        {
          id: 'terms',
          title: 'Terms of Service',
          icon: 'document-text-outline',
          onPress: () => navigation.navigate('TermsOfService'),
        },
        {
          id: 'cookies',
          title: 'Cookie Policy',
          icon: 'cafe-outline',
          onPress: () => Alert.alert('Cookie Policy', 'Navigate to cookie policy'),
        },
      ],
    },
  ];

  const renderDrawerItem = (item: DrawerItem) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.drawerItem,
        { borderBottomColor: theme.colors.border }
      ]}
      onPress={item.onPress}
    >
      <View style={styles.drawerItemContent}>
        <View style={styles.drawerItemLeft}>
          <Ionicons 
            name={item.icon} 
            size={20} 
            color={theme.colors.textSecondary} 
          />
          <Text style={[styles.drawerItemText, { color: theme.colors.text }]}>
            {item.title}
          </Text>
        </View>
        
        <View style={styles.drawerItemRight}>
          {item.badge && (
            <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
          )}
          {item.isToggle && (
            <Switch
              value={item.toggleValue}
              onValueChange={item.onToggleChange}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={theme.colors.surface}
            />
          )}
          {!item.isToggle && (
            <Ionicons 
              name="chevron-forward" 
              size={16} 
              color={theme.colors.textSecondary} 
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User Profile Section */}
        <View style={[styles.profileSection, { borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity
            style={styles.profileContent}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Profile' })}
          >
            {user?.profileImage || user?.avatar ? (
              <Image
                source={{ uri: user.profileImage || user.avatar }}
                style={styles.profileImage}
                defaultSource={require('../../assets/bisa-logo.jpeg')}
              />
            ) : (
              <View style={[styles.profileImage, { backgroundColor: theme.colors.primary }]}>
                <Ionicons name="person" size={30} color="#ffffff" />
              </View>
            )}
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: theme.colors.text }]}>
                {user?.name || 'Guest User'}
              </Text>
              <Text style={[styles.profileEmail, { color: theme.colors.textSecondary }]}>
                {user?.email || 'guest@example.com'}
              </Text>
              <View style={styles.profileStats}>
                <Text style={[styles.profileStat, { color: theme.colors.textSecondary }]}>
                  {user?.reputation || 0} reputation
                </Text>
                <Text style={[styles.profileStat, { color: theme.colors.textSecondary }]}>
                  {user?.followers || 0} followers
                </Text>
              </View>
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={theme.colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>

        {/* Drawer Sections */}
        {drawerSections.map((section, sectionIndex) => (
          <View key={section.title} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
              {section.title}
            </Text>
            {section.items.map(renderDrawerItem)}
          </View>
        ))}

        {/* Sign Out Button */}
        <View style={styles.signOutSection}>
          <TouchableOpacity
            style={[styles.signOutButton, { borderColor: theme.colors.border }]}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={20} color="#ff4444" />
            <Text style={[styles.signOutText, { color: '#ff4444' }]}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionSection}>
          <Text style={[styles.versionText, { color: theme.colors.textSecondary }]}>
            BISA v1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    marginBottom: 8,
  },
  profileStats: {
    flexDirection: 'row',
    gap: 15,
  },
  profileStat: {
    fontSize: 12,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  drawerItem: {
    borderBottomWidth: 0.5,
  },
  drawerItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  drawerItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  drawerItemText: {
    fontSize: 16,
    marginLeft: 15,
  },
  drawerItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  badge: {
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  signOutSection: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 15,
  },
  versionSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 12,
  },
}); 