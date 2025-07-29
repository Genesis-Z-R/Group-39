import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Share,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { sharePost } from '../services/api';
import { useTheme } from '../utils/ThemeContext';
import { Question } from '../types';

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  question: Question;
  onShareSuccess?: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({
  visible,
  onClose,
  question,
  onShareSuccess,
}) => {
  const { theme } = useTheme();

  const generateShareText = () => {
    const baseText = `${question.author.username} asked: "${question.title}"`;
    if (question.content) {
      return `${baseText}\n\n${question.content}\n\nCheck out this question on Bisa!`;
    }
    return `${baseText}\n\nCheck out this question on Bisa!`;
  };

  const generateShareUrl = () => {
    // In a real app, this would be a deep link to the specific question
    return `https://bisa.app/question/${question.id}`;
  };

  const handleNativeShare = async () => {
    try {
      const result = await Share.share({
        message: generateShareText(),
        url: generateShareUrl(),
        title: 'Check out this question on Bisa',
      });
      
      if (result.action === Share.sharedAction) {
        // Note: In a real app, you would send share data to backend here
        // await sharePost(question.id, token, {
        //   shareType: 'native',
        //   platform: 'mobile',
        // });
        onShareSuccess?.();
        onClose();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share question');
    }
  };

  const handleCopyLink = async () => {
    try {
      await Clipboard.setStringAsync(generateShareUrl());
      // Note: In a real app, you would send share data to backend here
      Alert.alert('Success', 'Link copied to clipboard!');
      onShareSuccess?.();
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to copy link');
    }
  };

  const handleCopyText = async () => {
    try {
      await Clipboard.setStringAsync(generateShareText());
      // Note: In a real app, you would send share data to backend here
      Alert.alert('Success', 'Question content copied to clipboard!');
      onShareSuccess?.();
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to copy text');
    }
  };

  const handleSocialShare = async (platform: string) => {
    const text = generateShareText();
    const url = generateShareUrl();
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
        break;
      case 'whatsapp':
        shareUrl = `whatsapp://send?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      default:
        return;
    }

    try {
      await Linking.openURL(shareUrl);
      // Note: In a real app, you would send share data to backend here
      onShareSuccess?.();
      onClose();
    } catch (error) {
      Alert.alert('Error', `Failed to open ${platform}`);
    }
  };

  const shareOptions = [
    {
      id: 'native',
      title: 'Share',
      icon: 'share-outline',
      color: '#007AFF',
      onPress: handleNativeShare,
    },
    {
      id: 'copy-link',
      title: 'Copy Link',
      icon: 'link-outline',
      color: '#34C759',
      onPress: handleCopyLink,
    },
    {
      id: 'copy-text',
      title: 'Copy Text',
      icon: 'document-text-outline',
      color: '#FF9500',
      onPress: handleCopyText,
    },
    {
      id: 'twitter',
      title: 'Twitter',
      icon: 'logo-twitter',
      color: '#1DA1F2',
      onPress: () => handleSocialShare('twitter'),
    },
    {
      id: 'facebook',
      title: 'Facebook',
      icon: 'logo-facebook',
      color: '#1877F2',
      onPress: () => handleSocialShare('facebook'),
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp',
      icon: 'logo-whatsapp',
      color: '#25D366',
      onPress: () => handleSocialShare('whatsapp'),
    },
    {
      id: 'telegram',
      title: 'Telegram',
      icon: 'paper-plane-outline',
      color: '#0088CC',
      onPress: () => handleSocialShare('telegram'),
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
        <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Share Question</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.preview}>
              <Text style={[styles.previewTitle, { color: theme.colors.text }]} numberOfLines={2}>
                {question.title}
              </Text>
              <Text style={[styles.previewAuthor, { color: theme.colors.textSecondary }]}>
                by {question.author.username}
              </Text>
            </View>

            <View style={styles.optionsGrid}>
              {shareOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.optionButton}
                  onPress={option.onPress}
                >
                  <View style={[styles.optionIcon, { backgroundColor: option.color }]}>
                    <Ionicons name={option.icon as any} size={24} color="#ffffff" />
                  </View>
                  <Text style={[styles.optionText, { color: theme.colors.text }]}>
                    {option.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  content: {
    padding: 20,
  },
  preview: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  previewAuthor: {
    fontSize: 14,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionButton: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 20,
  },
  optionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionText: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default ShareModal; 