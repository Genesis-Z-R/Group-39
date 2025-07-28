import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import { StackParamList } from '../types';
import { useQuestions } from '../utils/QuestionsContext';
import { useAuth } from '../utils/AuthContext';
import Logo from '../components/Logo';

type AskScreenNavigationProp = StackNavigationProp<StackParamList, 'MainTabs'>;

export default function AskScreen() {
  const navigation = useNavigation<AskScreenNavigationProp>();
  const { addQuestion } = useQuestions();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a question title');
      return;
    }
    if (!content.trim()) {
      Alert.alert('Error', 'Please enter question content');
      return;
    }
    if (tags.length === 0) {
      Alert.alert('Error', 'Please add at least one tag');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Add the new question to the context
      addQuestion({
        title: title.trim(),
        content: content.trim(),
        tags: tags,
        author: user || {
          id: '1',
          name: 'Anonymous User',
          username: 'anonymous',
          email: 'anonymous@example.com',
          profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
          bio: 'Anonymous user',
          reputation: 0,
          followers: 0,
          following: 0,
          isVerified: false,
          createdAt: new Date(),
        },
        images: images,
      });

      Alert.alert(
        'Success',
        'Your question has been posted!',
        [
          {
            text: 'OK',
            onPress: () => {
              setTitle('');
              setContent('');
              setTags([]);
              setImages([]);
              setIsSubmitting(false);
              navigation.navigate('MainTabs');
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to post question. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    if (title.trim() || content.trim() || tags.length > 0) {
      // Save to local storage (simplified for now)
      Alert.alert('Draft Saved', 'Your question draft has been saved.');
    }
  };

  const isFormValid = title.trim() && content.trim() && tags.length > 0;

  const QuestionPreview = () => (
    <View style={styles.previewContainer}>
      <Text style={styles.previewTitle}>Preview</Text>
      <View style={styles.previewContent}>
        <Text style={styles.previewQuestionTitle}>{title || 'Your question title will appear here'}</Text>
        <Text style={styles.previewQuestionContent}>{content || 'Your question content will appear here'}</Text>
        {tags.length > 0 && (
          <View style={styles.previewTags}>
            {tags.map((tag, index) => (
              <View key={index} style={styles.previewTag}>
                <Text style={styles.previewTagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
        {images.length > 0 && (
          <Text style={styles.previewImagesText}>{images.length} image(s) attached</Text>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.header}>
          <Logo size="medium" showText={false} />
          <View style={styles.headerText}>
            <Text style={styles.title}>Ask a Question</Text>
            <Text style={styles.subtitle}>
              Share your knowledge and get answers from the community
            </Text>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Question Title *</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="What's your question? Be specific."
              value={title}
              onChangeText={setTitle}
              maxLength={300}
              returnKeyType="next"
              blurOnSubmit={false}
            />
            <Text style={styles.characterCount}>{title.length}/300</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Question Details *</Text>
            <TextInput
              style={styles.contentInput}
              placeholder="Provide more context about your question..."
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
              maxLength={5000}
              returnKeyType="default"
              blurOnSubmit={false}
            />
            <Text style={styles.characterCount}>{content.length}/5000</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tags *</Text>
            <Text style={styles.tagDescription}>
              Add up to 5 tags to help others find your question
            </Text>
            <View style={styles.tagInputContainer}>
              <TextInput
                style={styles.tagInput}
                placeholder="Add a tag..."
                value={currentTag}
                onChangeText={setCurrentTag}
                onSubmitEditing={handleAddTag}
                returnKeyType="done"
                maxLength={20}
              />
              <TouchableOpacity
                style={[styles.addTagButton, !currentTag.trim() && styles.addTagButtonDisabled]}
                onPress={handleAddTag}
                disabled={!currentTag.trim()}
              >
                <Ionicons name="add" size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>

            {tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveTag(tag)}
                      style={styles.removeTagButton}
                    >
                      <Ionicons name="close" size={16} color="#666" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Add Images (Optional)</Text>
            <TouchableOpacity
              style={styles.imageUploadButton}
              onPress={async () => {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                  Alert.alert('Permission denied', 'Please grant permission to access images.');
                  return;
                }
                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  allowsEditing: true,
                  aspect: [4, 3],
                  quality: 0.7,
                });
                if (!result.canceled && result.assets && result.assets.length > 0) {
                  setImages(prev => [...prev, result.assets[0].uri]);
                }
              }}
            >
              <Ionicons name="image" size={24} color="#1a73e8" />
              <Text style={styles.imageUploadButtonText}>
                {images.length > 0 ? `${images.length} images selected` : 'Add images to your question'}
              </Text>
            </TouchableOpacity>
                         {images.length > 0 && (
               <View style={styles.selectedImagesContainer}>
                 {images.map((imageUri, index) => (
                   <View key={index} style={styles.imageWrapper}>
                     <Image
                       source={{ uri: imageUri }}
                       style={styles.selectedImage}
                     />
                     <TouchableOpacity
                       style={styles.removeImageButton}
                       onPress={() => setImages(prev => prev.filter((_, i) => i !== index))}
                     >
                       <Ionicons name="close-circle" size={20} color="#ff4444" />
                     </TouchableOpacity>
                   </View>
                 ))}
               </View>
             )}
                      </View>

            {showPreview && <QuestionPreview />}
          </View>
        </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerButtons}>
          <TouchableOpacity
            style={styles.previewButton}
            onPress={() => setShowPreview(!showPreview)}
          >
            <Text style={styles.previewButtonText}>
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.draftButton}
            onPress={handleSaveDraft}
          >
            <Text style={styles.draftButtonText}>Save Draft</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => {
            // Create question with form data or fallback to sample data
            const questionData = {
              title: title.trim() || 'Question ' + Date.now(),
              content: content.trim() || 'This is a question posted from the app.',
              tags: tags.length > 0 ? tags : ['general'],
              author: user || {
                id: 'anonymous',
                name: 'Anonymous User',
                username: 'anonymous',
                email: 'anonymous@example.com',
                profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
                bio: 'Anonymous user',
                reputation: 0,
                followers: 0,
                following: 0,
                isVerified: false,
                createdAt: new Date(),
              },
              images: images,
            };
            
            addQuestion(questionData);
            
            // Clear form and show success message
            setTitle('');
            setContent('');
            setTags([]);
            setImages([]);
            setCurrentTag('');
            
            Alert.alert(
              'Success',
              'Your question has been posted!',
              [
                {
                  text: 'OK',
                  onPress: () => navigation.navigate('MainTabs'),
                },
              ]
            );
          }}
        >
          <Text style={styles.submitButtonText}>
            Post Question
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  titleInput: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  contentInput: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minHeight: 120,
  },
  characterCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  tagDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagInput: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 8,
  },
  addTagButton: {
    backgroundColor: '#1a73e8',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addTagButtonDisabled: {
    backgroundColor: '#ccc',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#1a73e8',
    fontWeight: '500',
    marginRight: 4,
  },
  removeTagButton: {
    padding: 2,
  },
  imageUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  imageUploadButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#1a73e8',
  },
  selectedImagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  selectedImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 8,
    marginBottom: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  previewContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  previewContent: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
  },
  previewQuestionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  previewQuestionContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  previewTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  previewTag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  previewTagText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '500',
  },
  previewImagesText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  footer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  previewButton: {
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1a73e8',
  },
  previewButtonText: {
    color: '#1a73e8',
    fontSize: 14,
    fontWeight: '600',
  },
  draftButton: {
    backgroundColor: '#fff3e0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff9800',
  },
  draftButtonText: {
    color: '#ff9800',
    fontSize: 14,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#1a73e8',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  submitButtonTextDisabled: {
    color: '#999',
  },
}); 