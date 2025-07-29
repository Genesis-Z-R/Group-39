import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  StatusBar,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../types';
import { useTheme } from '../utils/ThemeContext';

type ReportBugScreenNavigationProp = StackNavigationProp<StackParamList, 'MainTabs'>;

interface BugCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const bugCategories: BugCategory[] = [
  {
    id: 'crash',
    title: 'App Crash',
    description: 'The app crashes or freezes unexpectedly',
    icon: 'warning-outline',
    color: '#FF3B30'
  },
  {
    id: 'ui',
    title: 'UI/UX Issue',
    description: 'Visual glitches, layout problems, or design issues',
    icon: 'color-palette-outline',
    color: '#FF9500'
  },
  {
    id: 'performance',
    title: 'Performance',
    description: 'Slow loading, lag, or performance problems',
    icon: 'speedometer-outline',
    color: '#FF6B35'
  },
  {
    id: 'feature',
    title: 'Feature Bug',
    description: 'A specific feature is not working correctly',
    icon: 'construct-outline',
    color: '#007AFF'
  },
  {
    id: 'login',
    title: 'Authentication',
    description: 'Login, signup, or account-related issues',
    icon: 'key-outline',
    color: '#5856D6'
  },
  {
    id: 'content',
    title: 'Content Issue',
    description: 'Problems with posts, comments, or data display',
    icon: 'document-text-outline',
    color: '#34C759'
  },
  {
    id: 'network',
    title: 'Network',
    description: 'Connection issues or API problems',
    icon: 'wifi-outline',
    color: '#AF52DE'
  },
  {
    id: 'other',
    title: 'Other',
    description: 'Any other issue not covered above',
    icon: 'ellipsis-horizontal-outline',
    color: '#8E8E93'
  }
];

export default function ReportBugScreen() {
  const navigation = useNavigation<ReportBugScreenNavigationProp>();
  const { theme } = useTheme();
  
  // Form state
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState('');
  const [expectedBehavior, setExpectedBehavior] = useState('');
  const [actualBehavior, setActualBehavior] = useState('');
  const [includeDeviceInfo, setIncludeDeviceInfo] = useState(true);
  const [includeScreenshot, setIncludeScreenshot] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (!selectedCategory || !title || !description) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    Alert.alert(
      'Submit Bug Report',
      'Are you sure you want to submit this bug report?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Submit', onPress: () => {
          Alert.alert(
            'Bug Report Submitted',
            'Thank you for your report! Our team will review it and get back to you if needed.',
            [{ text: 'OK', onPress: () => navigation.goBack() }]
          );
        }},
      ]
    );
  };

  const renderCategoryItem = (category: BugCategory) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryItem,
        { 
          backgroundColor: theme.colors.surface,
          borderColor: selectedCategory === category.id ? category.color : theme.colors.border,
          borderWidth: selectedCategory === category.id ? 2 : 1,
        }
      ]}
      onPress={() => setSelectedCategory(category.id)}
    >
      <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
        <Ionicons name={category.icon as any} size={24} color="#ffffff" />
      </View>
      <View style={styles.categoryContent}>
        <Text style={[styles.categoryTitle, { color: theme.colors.text }]}>
          {category.title}
        </Text>
        <Text style={[styles.categoryDescription, { color: theme.colors.textSecondary }]}>
          {category.description}
        </Text>
      </View>
      {selectedCategory === category.id && (
        <Ionicons name="checkmark-circle" size={24} color={category.color} />
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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Report a Bug</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Introduction */}
        <View style={[styles.introSection, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.introHeader}>
            <Ionicons name="bug" size={24} color={theme.colors.primary} />
            <Text style={[styles.introTitle, { color: theme.colors.text }]}>Help Us Improve</Text>
          </View>
          <Text style={[styles.introDescription, { color: theme.colors.textSecondary }]}>
            Your feedback helps us make Bisa better for everyone. Please provide as much detail as possible to help us understand and fix the issue.
          </Text>
        </View>

        {/* Bug Category Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Bug Category *</Text>
          <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
            Select the category that best describes the issue
          </Text>
          <View style={styles.categoriesGrid}>
            {bugCategories.map(renderCategoryItem)}
          </View>
        </View>

        {/* Bug Details Form */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Bug Details</Text>
          
          {/* Title */}
          <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Title *</Text>
            <TextInput
              style={[styles.textInput, { 
                color: theme.colors.text,
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.background
              }]}
              placeholder="Brief description of the bug"
              placeholderTextColor={theme.colors.textSecondary}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Description */}
          <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Description *</Text>
            <TextInput
              style={[styles.textArea, { 
                color: theme.colors.text,
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.background
              }]}
              placeholder="Describe the bug in detail..."
              placeholderTextColor={theme.colors.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Steps to Reproduce */}
          <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Steps to Reproduce</Text>
            <TextInput
              style={[styles.textArea, { 
                color: theme.colors.text,
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.background
              }]}
              placeholder="1. Go to...\n2. Click on...\n3. See error..."
              placeholderTextColor={theme.colors.textSecondary}
              value={steps}
              onChangeText={setSteps}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Expected vs Actual Behavior */}
          <View style={styles.behaviorContainer}>
            <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface, flex: 1, marginRight: 8 }]}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Expected Behavior</Text>
              <TextInput
                style={[styles.textArea, { 
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.background
                }]}
                placeholder="What should happen?"
                placeholderTextColor={theme.colors.textSecondary}
                value={expectedBehavior}
                onChangeText={setExpectedBehavior}
                multiline
                numberOfLines={3}
              />
            </View>
            <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface, flex: 1, marginLeft: 8 }]}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Actual Behavior</Text>
              <TextInput
                style={[styles.textArea, { 
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.background
                }]}
                placeholder="What actually happens?"
                placeholderTextColor={theme.colors.textSecondary}
                value={actualBehavior}
                onChangeText={setActualBehavior}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        </View>

        {/* Additional Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Additional Information</Text>
          
          <View style={[styles.switchContainer, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.switchContent}>
              <Ionicons name="phone-portrait-outline" size={20} color={theme.colors.textSecondary} />
              <View style={styles.switchText}>
                <Text style={[styles.switchTitle, { color: theme.colors.text }]}>Include Device Info</Text>
                <Text style={[styles.switchSubtitle, { color: theme.colors.textSecondary }]}>
                  Automatically include device and app version information
                </Text>
              </View>
            </View>
            <Switch
              value={includeDeviceInfo}
              onValueChange={setIncludeDeviceInfo}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={includeDeviceInfo ? '#ffffff' : '#ffffff'}
            />
          </View>

          <View style={[styles.switchContainer, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.switchContent}>
              <Ionicons name="image-outline" size={20} color={theme.colors.textSecondary} />
              <View style={styles.switchText}>
                <Text style={[styles.switchTitle, { color: theme.colors.text }]}>Include Screenshot</Text>
                <Text style={[styles.switchSubtitle, { color: theme.colors.textSecondary }]}>
                  Add a screenshot to help us understand the issue
                </Text>
              </View>
            </View>
            <Switch
              value={includeScreenshot}
              onValueChange={setIncludeScreenshot}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={includeScreenshot ? '#ffffff' : '#ffffff'}
            />
          </View>

          {/* Contact Email */}
          <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Contact Email (Optional)</Text>
            <TextInput
              style={[styles.textInput, { 
                color: theme.colors.text,
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.background
              }]}
              placeholder="your.email@example.com"
              placeholderTextColor={theme.colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>
        </View>

        {/* Submit Button */}
        <View style={styles.submitSection}>
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleSubmit}
          >
            <Ionicons name="send-outline" size={20} color="#ffffff" />
            <Text style={styles.submitButtonText}>Submit Bug Report</Text>
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
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  introDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    paddingHorizontal: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  categoriesGrid: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryContent: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  categoryDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  inputContainer: {
    padding: 16,
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  behaviorContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 8,
  },
  switchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  switchText: {
    marginLeft: 12,
    flex: 1,
  },
  switchTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  switchSubtitle: {
    fontSize: 14,
    lineHeight: 18,
  },
  submitSection: {
    padding: 20,
    marginBottom: 16,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 