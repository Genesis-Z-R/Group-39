import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Linking,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../types';
import { useTheme } from '../utils/ThemeContext';
import Logo from '../components/Logo';

type AboutBisaScreenNavigationProp = StackNavigationProp<StackParamList, 'MainTabs'>;

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Emmanuella Asiamah',
    role: 'Quality Assurance',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop',
    bio: 'Former Google engineer with 10+ years in tech. Passionate about building platforms that connect people through knowledge sharing.'
  },
  {
    id: '2',
    name: 'Ramsey Donkor',
    role: 'Project Manager',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    bio: 'Full-stack developer and AI enthusiast. Led the development of our fact-checking system and recommendation algorithms.'
  },
  {
    id: '3',
    name: 'Classic Genius',
    role: 'Head of Product',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    bio: 'UX expert with a background in psychology. Focuses on creating intuitive experiences that make learning accessible to everyone.'
  },
  {
    id: '4',
    name: 'Mckoj Vester',
    role: 'Lead Developer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    bio: 'Award-winning designer with expertise in mobile interfaces. Believes that great design should be invisible and empowering.'
  },
  {
    id: '5',
    name: 'Woeyram Agbebo',
    role: 'Lead Designer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    bio: 'Award-winning designer with expertise in mobile interfaces. Believes that great design should be invisible and empowering.'
  },
  {
    id: '6',
    name: 'Clifford Oppong',
    role: 'System Analyst',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    bio: 'Award-winning designer with expertise in mobile interfaces. Believes that great design should be invisible and empowering.'
  },
  {
    id: '7',
    name: 'Samari Nafis Rashid',
    role: 'Lead Designer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    bio: 'Award-winning designer with expertise in mobile interfaces. Believes that great design should be invisible and empowering.'
  },
];

const features: Feature[] = [
  {
    id: '1',
    title: 'AI Fact-Checking',
    description: 'Advanced AI algorithms analyze content for accuracy and provide confidence scores for claims.',
    icon: 'shield-checkmark-outline',
    color: '#4CAF50'
  },
  {
    id: '2',
    title: 'Smart Recommendations',
    description: 'Machine learning suggests relevant questions and users based on your interests and expertise.',
    icon: 'bulb-outline',
    color: '#FF9800'
  },
  {
    id: '3',
    title: 'Community Moderation',
    description: 'Robust moderation tools and community guidelines ensure high-quality, respectful discussions.',
    icon: 'people-outline',
    color: '#2196F3'
  },
  {
    id: '4',
    title: 'Real-time Notifications',
    description: 'Stay updated with instant notifications for answers, comments, and mentions.',
    icon: 'notifications-outline',
    color: '#9C27B0'
  },
  {
    id: '5',
    title: 'Rich Media Support',
    description: 'Share images, videos, and code snippets to make your questions more engaging and informative.',
    icon: 'images-outline',
    color: '#FF5722'
  },
  {
    id: '6',
    title: 'Reputation System',
    description: 'Build credibility through helpful contributions and earn recognition in the community.',
    icon: 'trophy-outline',
    color: '#FFD700'
  }
];

export default function AboutBisaScreen() {
  const navigation = useNavigation<AboutBisaScreenNavigationProp>();
  const { theme } = useTheme();

  const handleLinkPress = (url: string) => {
    Linking.openURL(url);
  };

  const renderTeamMember = (member: TeamMember) => (
    <View key={member.id} style={[styles.teamMember, { backgroundColor: theme.colors.surface }]}>
      <Image source={{ uri: member.avatar }} style={styles.memberAvatar} />
      <View style={styles.memberInfo}>
        <Text style={[styles.memberName, { color: theme.colors.text }]}>{member.name}</Text>
        <Text style={[styles.memberRole, { color: theme.colors.primary }]}>{member.role}</Text>
        <Text style={[styles.memberBio, { color: theme.colors.textSecondary }]}>{member.bio}</Text>
      </View>
    </View>
  );

  const renderFeature = (feature: Feature) => (
    <View key={feature.id} style={[styles.featureItem, { backgroundColor: theme.colors.surface }]}>
      <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
        <Ionicons name={feature.icon as any} size={24} color="#ffffff" />
      </View>
      <View style={styles.featureContent}>
        <Text style={[styles.featureTitle, { color: theme.colors.text }]}>{feature.title}</Text>
        <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>
          {feature.description}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar 
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      
      {/* Header */}
      {/* <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>About Bisa</Text>
        <View style={styles.headerSpacer} />
      </View> */}

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Hero Section */}
        <View style={[styles.heroSection, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.logoContainer}>
            <Logo size="large" showText={true} />
          </View>
          <Text style={[styles.tagline, { color: theme.colors.textSecondary }]}>
            Connecting minds through knowledge sharing
          </Text>
          <Text style={[styles.version, { color: theme.colors.textSecondary }]}>
            Version 1.0.0
          </Text>
        </View>

        {/* Mission Section */}
        <View style={[styles.missionSection, { backgroundColor: theme.colors.surface }]}>
          <Text style={[ { color: theme.colors.text }]}>Our Mission</Text>
          <Text style={[styles.missionText, { color: theme.colors.textSecondary }]}>
            Bisa is on a mission to democratize knowledge sharing by creating a platform where anyone can ask questions, 
            share expertise, and learn from others. We believe that every question deserves an answer, and every person 
            has valuable knowledge to share.
          </Text>
          <Text style={[styles.missionText, { color: theme.colors.textSecondary }]}>
            Our AI-powered fact-checking system ensures that information shared on Bisa is accurate and reliable, 
            making it a trusted source for learning and discovery.
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Key Features</Text>
          {features.map(renderFeature)}
        </View>

        {/* Team Section */}
        <View style={styles.teamSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Meet Our Team</Text>
          {teamMembers.map(renderTeamMember)}
        </View>

        {/* Stats Section */}
        <View style={[styles.statsSection, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Bisa by the Numbers</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.primary }]}>1M+</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Questions Asked</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.primary }]}>500K+</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Active Users</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.primary }]}>95%</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Accuracy Rate</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.primary }]}>50+</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Countries</Text>
            </View>
          </View>
        </View>

        {/* Links Section */}
        <View style={[styles.linksSection, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Connect With Us</Text>
          
          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => handleLinkPress('https://bisa.app')}
          >
            <Ionicons name="globe-outline" size={20} color={theme.colors.primary} />
            <Text style={[styles.linkText, { color: theme.colors.text }]}>Website</Text>
            <Ionicons name="open-outline" size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => handleLinkPress('https://twitter.com/bisa_app')}
          >
            <Ionicons name="logo-twitter" size={20} color={theme.colors.primary} />
            <Text style={[styles.linkText, { color: theme.colors.text }]}>Twitter</Text>
            <Ionicons name="open-outline" size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => handleLinkPress('https://linkedin.com/company/bisa-app')}
          >
            <Ionicons name="logo-linkedin" size={20} color={theme.colors.primary} />
            <Text style={[styles.linkText, { color: theme.colors.text }]}>LinkedIn</Text>
            <Ionicons name="open-outline" size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => handleLinkPress('mailto:hello@bisa.app')}
          >
            <Ionicons name="mail-outline" size={20} color={theme.colors.primary} />
            <Text style={[styles.linkText, { color: theme.colors.text }]}>hello@bisa.app</Text>
            <Ionicons name="open-outline" size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Legal Section */}
        <View style={[styles.legalSection, { backgroundColor: theme.colors.surface }]}>
          <TouchableOpacity
            style={styles.legalItem}
            onPress={() => handleLinkPress('https://bisa.app/privacy')}
          >
            <Text style={[styles.legalText, { color: theme.colors.textSecondary }]}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.legalItem}
            onPress={() => handleLinkPress('https://bisa.app/terms')}
          >
            <Text style={[styles.legalText, { color: theme.colors.textSecondary }]}>Terms of Service</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.legalItem}
            onPress={() => handleLinkPress('https://bisa.app/cookies')}
          >
            <Text style={[styles.legalText, { color: theme.colors.textSecondary }]}>Cookie Policy</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={[styles.footer, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
            © 2024 Bisa Inc. All rights reserved.
          </Text>
          <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
            Made with ❤️ for the global community
          </Text>
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
  content: {
    flex: 1,
  },
  heroSection: {
    alignItems: 'center',
    padding: 40,
  },
  logoContainer: {
    marginBottom: 20,
  },
  tagline: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  version: {
    fontSize: 14,
  },
  missionSection: {
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  missionText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  featuresSection: {
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    marginBottom: 8,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  teamSection: {
    marginBottom: 16,
  },
  teamMember: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 8,
  },
  memberAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  memberBio: {
    fontSize: 14,
    lineHeight: 20,
  },
  statsSection: {
    padding: 20,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
  linksSection: {
    padding: 20,
    marginBottom: 16,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  linkText: {
    fontSize: 16,
    flex: 1,
    marginLeft: 12,
  },
  legalSection: {
    padding: 20,
    marginBottom: 16,
  },
  legalItem: {
    paddingVertical: 8,
  },
  legalText: {
    fontSize: 14,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
}); 