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

type TermsOfServiceScreenNavigationProp = StackNavigationProp<StackParamList, 'MainTabs'>;

interface TermsSection {
  id: string;
  title: string;
  content: string[];
}

const termsSections: TermsSection[] = [
  {
    id: '1',
    title: 'Acceptance of Terms',
    content: [
      'By accessing and using the Bisa platform, you accept and agree to be bound by the terms and provision of this agreement.',
      'If you do not agree to abide by the above, please do not use this service.',
      'These terms apply to all visitors, users, and others who access or use the service.',
      'We reserve the right to modify these terms at any time, and such modifications shall be effective immediately upon posting.'
    ]
  },
  {
    id: '2',
    title: 'Description of Service',
    content: [
      'Bisa is a knowledge-sharing platform that allows users to ask questions, provide answers, and engage in discussions.',
      'The service includes features such as question posting, answering, commenting, fact-checking, and user profiles.',
      'We provide both free and premium features, subject to these terms.',
      'The service is provided "as is" and we make no warranties about its availability or functionality.'
    ]
  },
  {
    id: '3',
    title: 'User Accounts',
    content: [
      'You must create an account to access certain features of the platform.',
      'You are responsible for maintaining the confidentiality of your account credentials.',
      'You must provide accurate and complete information when creating your account.',
      'You are responsible for all activities that occur under your account.',
      'You must notify us immediately of any unauthorized use of your account.',
      'We reserve the right to terminate accounts that violate these terms.'
    ]
  },
  {
    id: '4',
    title: 'User Conduct',
    content: [
      'You agree to use the platform only for lawful purposes and in accordance with these terms.',
      'You must not post content that is illegal, harmful, threatening, abusive, or defamatory.',
      'You must not impersonate others or provide false information.',
      'You must not attempt to gain unauthorized access to the platform or other users\' accounts.',
      'You must not use the platform to spam, harass, or intimidate other users.',
      'You must respect intellectual property rights and not post copyrighted material without permission.'
    ]
  },
  {
    id: '5',
    title: 'Content Guidelines',
    content: [
      'You retain ownership of content you post, but grant us a license to use it.',
      'You are responsible for the accuracy and legality of content you post.',
      'We reserve the right to remove content that violates these terms.',
      'You must not post personal information of others without their consent.',
      'Content must be relevant and contribute to meaningful discussions.',
      'We encourage respectful and constructive dialogue on the platform.'
    ]
  },
  {
    id: '6',
    title: 'Intellectual Property',
    content: [
      'The platform and its original content, features, and functionality are owned by Bisa Inc.',
      'Our trademarks and trade dress may not be used without our prior written permission.',
      'You retain rights to your content, but grant us a worldwide license to use it.',
      'You may not use our intellectual property without explicit permission.',
      'We respect intellectual property rights and expect users to do the same.',
      'Report copyright violations through our designated channels.'
    ]
  },
  {
    id: '7',
    title: 'Privacy and Data',
    content: [
      'Your privacy is important to us. Please review our Privacy Policy.',
      'We collect and process personal data in accordance with applicable laws.',
      'You have rights regarding your personal data as outlined in our Privacy Policy.',
      'We implement appropriate security measures to protect your information.',
      'We may share data with third parties as described in our Privacy Policy.',
      'You can control your privacy settings through your account preferences.'
    ]
  },
  {
    id: '8',
    title: 'Limitation of Liability',
    content: [
      'We provide the platform "as is" without warranties of any kind.',
      'We are not liable for any indirect, incidental, or consequential damages.',
      'Our total liability shall not exceed the amount you paid for our services.',
      'We are not responsible for content posted by users.',
      'We do not guarantee the accuracy of information on the platform.',
      'You use the platform at your own risk.'
    ]
  },
  {
    id: '9',
    title: 'Termination',
    content: [
      'We may terminate or suspend your account at any time for violations.',
      'You may delete your account at any time through your account settings.',
      'Upon termination, your right to use the platform ceases immediately.',
      'We may retain certain information as required by law.',
      'Termination does not affect any provisions that should survive.',
      'You are responsible for backing up your content before termination.'
    ]
  },
  {
    id: '10',
    title: 'Governing Law',
    content: [
      'These terms are governed by the laws of the State of California.',
      'Any disputes shall be resolved in the courts of San Francisco, California.',
      'We may seek injunctive relief in any court of competent jurisdiction.',
      'If any provision is found to be unenforceable, the remaining provisions remain in effect.',
      'These terms constitute the entire agreement between you and Bisa.',
      'No waiver of any term shall be deemed a further waiver of that term.'
    ]
  }
];

export default function TermsOfServiceScreen() {
  const navigation = useNavigation<TermsOfServiceScreenNavigationProp>();
  const { theme } = useTheme();

  const handleContactUs = () => {
    Linking.openURL('mailto:legal@bisa.app?subject=Terms of Service Inquiry');
  };

  const renderTermsSection = (section: TermsSection) => (
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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Terms of Service</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Introduction */}
        <View style={[styles.introSection, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.introHeader}>
            <Ionicons name="document-text" size={24} color={theme.colors.primary} />
            <Text style={[styles.introTitle, { color: theme.colors.text }]}>Terms of Service</Text>
          </View>
          <Text style={[styles.introText, { color: theme.colors.textSecondary }]}>
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
          <Text style={[styles.introDescription, { color: theme.colors.textSecondary }]}>
            These Terms of Service govern your use of the Bisa platform and the services we provide. 
            By using our platform, you agree to these terms and our Privacy Policy.
          </Text>
        </View>

        {/* Terms Sections */}
        {termsSections.map(renderTermsSection)}

        {/* Contact Section */}
        <View style={[styles.contactSection, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.contactTitle, { color: theme.colors.text }]}>Contact Us</Text>
          <Text style={[styles.contactText, { color: theme.colors.textSecondary }]}>
            If you have any questions about these Terms of Service, please contact us:
          </Text>
          
          <TouchableOpacity
            style={styles.contactButton}
            onPress={handleContactUs}
          >
            <Ionicons name="mail-outline" size={20} color={theme.colors.primary} />
            <Text style={[styles.contactButtonText, { color: theme.colors.primary }]}>
              legal@bisa.app
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
            By using the Bisa platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
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