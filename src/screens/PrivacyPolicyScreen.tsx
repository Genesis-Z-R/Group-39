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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../types';
import { useTheme } from '../utils/ThemeContext';

type PrivacyPolicyScreenNavigationProp = StackNavigationProp<StackParamList, 'MainTabs'>;

interface PolicySection {
  id: string;
  title: string;
  content: string[];
}

const policySections: PolicySection[] = [
  {
    id: '1',
    title: 'Information We Collect',
    content: [
      'Personal Information: When you create an account, we collect your name, email address, and profile information.',
      'Usage Data: We collect information about how you use our platform, including questions asked, answers provided, and interactions with other users.',
      'Device Information: We may collect device-specific information such as your IP address, browser type, and operating system.',
      'Cookies and Tracking: We use cookies and similar technologies to enhance your experience and analyze platform usage.'
    ]
  },
  {
    id: '2',
    title: 'How We Use Your Information',
    content: [
      'To provide and maintain our platform services',
      'To personalize your experience and show relevant content',
      'To communicate with you about your account and platform updates',
      'To improve our services and develop new features',
      'To ensure platform security and prevent abuse',
      'To comply with legal obligations and enforce our terms'
    ]
  },
  {
    id: '3',
    title: 'Information Sharing',
    content: [
      'We do not sell, trade, or rent your personal information to third parties.',
      'We may share information with service providers who help us operate our platform.',
      'We may disclose information if required by law or to protect our rights and safety.',
      'Your public profile information is visible to other users as you choose to share it.',
      'We may share aggregated, anonymized data for research and analytics purposes.'
    ]
  },
  {
    id: '4',
    title: 'Data Security',
    content: [
      'We implement industry-standard security measures to protect your information.',
      'Your data is encrypted during transmission and storage.',
      'We regularly review and update our security practices.',
      'We limit access to your personal information to authorized personnel only.',
      'We have procedures in place to respond to security incidents.'
    ]
  },
  {
    id: '5',
    title: 'Your Rights and Choices',
    content: [
      'Access: You can view and update your personal information in your account settings.',
      'Deletion: You can request deletion of your account and associated data.',
      'Export: You can download a copy of your data through your account settings.',
      'Opt-out: You can opt out of certain data collection and communications.',
      'Correction: You can correct inaccurate information in your profile.',
      'Portability: You can transfer your data to other services.'
    ]
  },
  {
    id: '6',
    title: 'Data Retention',
    content: [
      'We retain your information as long as your account is active.',
      'We may retain certain information after account deletion for legal or security purposes.',
      'Deactivated accounts are deleted within 30 days.',
      'Backup data may be retained for up to 90 days.',
      'We will notify you of any changes to our retention policies.'
    ]
  },
  {
    id: '7',
    title: 'Children\'s Privacy',
    content: [
      'Our platform is not intended for children under 13 years of age.',
      'We do not knowingly collect personal information from children under 13.',
      'If we become aware that we have collected such information, we will delete it promptly.',
      'Parents or guardians should contact us if they believe their child has provided personal information.'
    ]
  },
  {
    id: '8',
    title: 'International Transfers',
    content: [
      'Your information may be transferred to and processed in countries other than your own.',
      'We ensure appropriate safeguards are in place for international data transfers.',
      'We comply with applicable data protection laws and regulations.',
      'You can contact us for information about our data transfer practices.'
    ]
  },
  {
    id: '9',
    title: 'Third-Party Services',
    content: [
      'Our platform may contain links to third-party websites and services.',
      'We are not responsible for the privacy practices of third-party services.',
      'We encourage you to review the privacy policies of third-party services.',
      'We do not share your information with third parties without your consent.'
    ]
  },
  {
    id: '10',
    title: 'Changes to This Policy',
    content: [
      'We may update this privacy policy from time to time.',
      'We will notify you of significant changes through the platform or email.',
      'Your continued use of the platform after changes constitutes acceptance.',
      'We encourage you to review this policy periodically.',
      'The date of the last update is shown at the bottom of this policy.'
    ]
  }
];

export default function PrivacyPolicyScreen() {
  const navigation = useNavigation<PrivacyPolicyScreenNavigationProp>();
  const { theme } = useTheme();

  const handleContactUs = () => {
    Linking.openURL('mailto:privacy@bisa.app?subject=Privacy Policy Inquiry');
  };

  const renderPolicySection = (section: PolicySection) => (
    <View key={section.id} style={[styles.section, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{section.title}</Text>
      {section.content.map((paragraph, index) => (
        <Text key={index} style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
          {paragraph}
        </Text>
      ))}
    </View>
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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Privacy Policy</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Introduction */}
        <View style={[styles.introSection, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.introHeader}>
            <Ionicons name="shield-checkmark" size={24} color={theme.colors.primary} />
            <Text style={[styles.introTitle, { color: theme.colors.text }]}>Privacy Policy</Text>
          </View>
          <Text style={[styles.introText, { color: theme.colors.textSecondary }]}>
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
          <Text style={[styles.introDescription, { color: theme.colors.textSecondary }]}>
            At Bisa, we are committed to protecting your privacy and ensuring the security of your personal information. 
            This Privacy Policy explains how we collect, use, and protect your information when you use our platform.
          </Text>
        </View>

        {/* Policy Sections */}
        {policySections.map(renderPolicySection)}

        {/* Contact Section */}
        <View style={[styles.contactSection, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.contactTitle, { color: theme.colors.text }]}>Contact Us</Text>
          <Text style={[styles.contactText, { color: theme.colors.textSecondary }]}>
            If you have any questions about this Privacy Policy or our privacy practices, please contact us:
          </Text>
          
          <TouchableOpacity
            style={styles.contactButton}
            onPress={handleContactUs}
          >
            <Ionicons name="mail-outline" size={20} color={theme.colors.primary} />
            <Text style={[styles.contactButtonText, { color: theme.colors.primary }]}>
              privacy@bisa.app
            </Text>
          </TouchableOpacity>
          
          <View style={styles.contactInfo}>
            <Text style={[styles.contactInfoText, { color: theme.colors.textSecondary }]}>
              Bisa Inc.
            </Text>
            <Text style={[styles.contactInfoText, { color: theme.colors.textSecondary }]}>
              123 Innovation Drive
            </Text>
            <Text style={[styles.contactInfoText, { color: theme.colors.textSecondary }]}>
              San Francisco, CA 94105
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={[styles.footer, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
            This privacy policy is effective as of the date listed above and applies to all users of the Bisa platform.
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
  introSection: {
    padding: 20,
    marginBottom: 16,
  },
  introHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  introText: {
    fontSize: 14,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  introDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
  section: {
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1a1a1a',
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  contactSection: {
    padding: 20,
    marginBottom: 16,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  contactInfo: {
    marginTop: 8,
  },
  contactInfoText: {
    fontSize: 14,
    lineHeight: 18,
  },
  footer: {
    padding: 20,
    marginBottom: 16,
  },
  footerText: {
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
}); 