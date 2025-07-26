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
import { sharePost } from '../../src/services/api';
import { useAuth } from '../../src/context/authContext';

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  post: {
    id: string;
    question: string;
    answer?: string;
    user: {
      name: string;
    };
  };
  onShareSuccess?: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({
  visible,
  onClose,
  post,
  onShareSuccess,
}) => {
  const { token } = useAuth();
  const generateShareText = () => {
    const baseText = `${post.user.name} asked: "${post.question}"`;
    if (post.answer) {
      return `${baseText}\n\nAnswer: ${post.answer}\n\nCheck out this post on Bisa!`;
    }
    return `${baseText}\n\nCheck out this post on Bisa!`;
  };

  const generateShareUrl = () => {
    // In a real app, this would be a deep link to the specific post
    return `https://bisa.app/post/${post.id}`;
  };

  const handleNativeShare = async () => {
    try {
      const result = await Share.share({
        message: generateShareText(),
        url: generateShareUrl(),
        title: 'Check out this post on Bisa',
      });
      
      if (result.action === Share.sharedAction) {
        // Send share data to backend
        await sharePost(post.id, token, {
          shareType: 'native',
          platform: 'mobile',
        });
        onShareSuccess?.();
        onClose();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share post');
    }
  };

  const handleCopyLink = async () => {
    try {
      await Clipboard.setStringAsync(generateShareUrl());
      // Send share data to backend
      await sharePost(post.id, token, {
        shareType: 'copy_link',
        platform: 'mobile',
      });
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
      // Send share data to backend
      await sharePost(post.id, token, {
        shareType: 'copy_text',
        platform: 'mobile',
      });
      Alert.alert('Success', 'Post content copied to clipboard!');
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
      // Send share data to backend
      await sharePost(post.id, token, {
        shareType: platform,
        platform: 'mobile',
      });
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
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Share Post</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.postPreview}>
            <Text style={styles.previewTitle}>Preview:</Text>
            <Text style={styles.previewText} numberOfLines={3}>
              {post.question}
            </Text>
            {post.answer && (
              <Text style={styles.previewAnswer} numberOfLines={2}>
                {post.answer}
              </Text>
            )}
          </View>

          <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.optionsGrid}>
              {shareOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.optionButton}
                  onPress={option.onPress}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconContainer, { backgroundColor: option.color + '20' }]}>
                    <Ionicons name={option.icon as any} size={24} color={option.color} />
                  </View>
                  <Text style={styles.optionTitle}>{option.title}</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  postPreview: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  previewText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    lineHeight: 22,
  },
  previewAnswer: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    lineHeight: 20,
  },
  optionsContainer: {
    flex: 1,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  optionButton: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
});

export default ShareModal; 