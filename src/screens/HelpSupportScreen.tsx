import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../types';
import { useTheme } from '../utils/ThemeContext';

type HelpSupportScreenNavigationProp = StackNavigationProp<StackParamList, 'MainTabs'>;

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface SupportCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  color: string;
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'How do I ask a question on Bisa?',
    answer: 'Tap the "Ask" button in the bottom navigation, write your question with relevant details, add tags, and post. Make sure to provide enough context for better answers.',
    category: 'general'
  },
  {
    id: '2',
    question: 'How does the reputation system work?',
    answer: 'You earn reputation by receiving upvotes on your questions and answers. The more helpful your contributions, the higher your reputation score becomes.',
    category: 'reputation'
  },
  {
    id: '3',
    question: 'Can I edit my questions after posting?',
    answer: 'Yes, you can edit your questions within 24 hours of posting. Go to your question and tap the edit icon to make changes.',
    category: 'content'
  },
  {
    id: '4',
    question: 'How do I fact-check a post?',
    answer: 'Tap the shield icon on any question card to run AI fact-checking. This analyzes the content and provides confidence scores for claims.',
    category: 'features'
  },
  {
    id: '5',
    question: 'What are tags and how do I use them?',
    answer: 'Tags help categorize your questions and make them discoverable. Use relevant tags like "react-native", "javascript", or "technology" to reach the right audience.',
    category: 'content'
  },
  {
    id: '6',
    question: 'How do I share a question?',
    answer: 'Tap the share icon on any question card to access multiple sharing options including social media, copy link, or native sharing.',
    category: 'features'
  },
  {
    id: '7',
    question: 'Can I follow other users?',
    answer: 'Yes, you can follow other users by visiting their profile and tapping the follow button. This helps you stay updated with their latest questions and answers.',
    category: 'social'
  },
  {
    id: '8',
    question: 'How do I report inappropriate content?',
    answer: 'Tap the three dots menu on any post and select "Report". Our team will review the content and take appropriate action.',
    category: 'safety'
  }
];

const supportCategories: SupportCategory[] = [
  {
    id: 'account',
    title: 'Account & Profile',
    icon: 'person-circle-outline',
    description: 'Help with account settings, profile management, and authentication',
    color: '#007AFF'
  },
  {
    id: 'content',
    title: 'Content & Posts',
    icon: 'document-text-outline',
    description: 'Guidance on creating, editing, and managing your questions and answers',
    color: '#34C759'
  },
  {
    id: 'features',
    title: 'App Features',
    icon: 'apps-outline',
    description: 'Learn about fact-checking, sharing, and other app features',
    color: '#FF9500'
  },
  {
    id: 'technical',
    title: 'Technical Issues',
    icon: 'construct-outline',
    description: 'Troubleshoot app crashes, login problems, and performance issues',
    color: '#FF3B30'
  },
  {
    id: 'safety',
    title: 'Safety & Privacy',
    icon: 'shield-checkmark-outline',
    description: 'Report abuse, manage privacy settings, and stay safe',
    color: '#AF52DE'
  },
  {
    id: 'billing',
    title: 'Billing & Premium',
    icon: 'card-outline',
    description: 'Premium features, subscription management, and billing support',
    color: '#5856D6'
  }
];

export default function HelpSupportScreen() {
  const navigation = useNavigation<HelpSupportScreenNavigationProp>();
  const { theme } = useTheme();
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'Choose how you\'d like to contact us:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Email Support', 
          onPress: () => Linking.openURL('mailto:support@bisa.app?subject=Help Request')
        },
        { 
          text: 'Live Chat', 
          onPress: () => Alert.alert('Live Chat', 'Live chat feature coming soon!')
        },
        { 
          text: 'Call Us', 
          onPress: () => Linking.openURL('tel:+1234567890')
        }
      ]
    );
  };

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  const getCategoryFAQs = (categoryId: string) => {
    return faqData.filter(faq => faq.category === categoryId);
  };

  const renderFAQItem = (faq: FAQItem) => {
    const isExpanded = expandedFAQ === faq.id;
    
    return (
      <View key={faq.id} style={[styles.faqItem, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity
          style={styles.faqQuestion}
          onPress={() => setExpandedFAQ(isExpanded ? null : faq.id)}
        >
          <Text style={[styles.faqQuestionText, { color: theme.colors.text }]}>
            {faq.question}
          </Text>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.faqAnswer}>
            <Text style={[styles.faqAnswerText, { color: theme.colors.textSecondary }]}>
              {faq.answer}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderSupportCategory = (category: SupportCategory) => {
    const isSelected = selectedCategory === category.id;
    const categoryFAQs = getCategoryFAQs(category.id);
    
    return (
      <View key={category.id} style={[styles.categoryContainer, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity
          style={styles.categoryHeader}
          onPress={() => handleCategoryPress(category.id)}
        >
          <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
            <Ionicons name={category.icon as any} size={24} color="#ffffff" />
          </View>
          <View style={styles.categoryInfo}>
            <Text style={[styles.categoryTitle, { color: theme.colors.text }]}>
              {category.title}
            </Text>
            <Text style={[styles.categoryDescription, { color: theme.colors.textSecondary }]}>
              {category.description}
            </Text>
          </View>
          <Ionicons
            name={isSelected ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
        
        {isSelected && categoryFAQs.length > 0 && (
          <View style={styles.categoryFAQs}>
            {categoryFAQs.map(renderFAQItem)}
          </View>
        )}
      </View>
    );
  };

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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Help & Support</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Quick Actions */}
        <View style={[styles.quickActions, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Quick Actions</Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleContactSupport}
            >
              <Ionicons name="chatbubble-outline" size={24} color="#ffffff" />
              <Text style={styles.actionButtonText}>Contact Support</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#34C759' }]}
              onPress={() => Linking.openURL('https://bisa.app/status')}
            >
              <Ionicons name="checkmark-circle-outline" size={24} color="#ffffff" />
              <Text style={styles.actionButtonText}>System Status</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Support Categories */}
        <View style={styles.categoriesSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Support Categories</Text>
          {supportCategories.map(renderSupportCategory)}
        </View>

        {/* Popular FAQs */}
        <View style={[styles.faqSection, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Popular Questions</Text>
          {faqData.slice(0, 4).map(renderFAQItem)}
        </View>

        {/* Contact Information */}
        <View style={[styles.contactSection, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Get in Touch</Text>
          
          <View style={styles.contactItems}>
            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => Linking.openURL('mailto:support@bisa.app')}
            >
              <Ionicons name="mail-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.contactText, { color: theme.colors.text }]}>support@bisa.app</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => Linking.openURL('https://bisa.app/help')}
            >
              <Ionicons name="globe-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.contactText, { color: theme.colors.text }]}>Help Center</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => Linking.openURL('https://twitter.com/bisa_app')}
            >
              <Ionicons name="logo-twitter" size={20} color={theme.colors.primary} />
              <Text style={[styles.contactText, { color: theme.colors.text }]}>@bisa_app</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Version */}
        <View style={[styles.versionSection, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.versionText, { color: theme.colors.textSecondary }]}>
            Bisa v1.0.0
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
  quickActions: {
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 8,
  },
  categoriesSection: {
    marginBottom: 16,
  },
  categoryContainer: {
    marginBottom: 8,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  categoryFAQs: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  faqSection: {
    padding: 20,
    marginBottom: 16,
  },
  faqItem: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  faqQuestionText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  faqAnswerText: {
    fontSize: 14,
    lineHeight: 20,
  },
  contactSection: {
    padding: 20,
    marginBottom: 16,
  },
  contactItems: {
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  contactText: {
    fontSize: 16,
    marginLeft: 12,
  },
  versionSection: {
    padding: 20,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
  },
}); 