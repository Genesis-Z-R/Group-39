import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getShareStats } from '../../src/services/api';
import { useAuth } from '../../src/context/authContext';

interface ShareAnalyticsProps {
  postId: string;
  visible: boolean;
  onClose: () => void;
}

interface ShareStats {
  totalShares: number;
  shareTypeStats: Array<[string, number]>;
  postId: string;
}

const ShareAnalytics: React.FC<ShareAnalyticsProps> = ({
  postId,
  visible,
  onClose,
}) => {
  const [stats, setStats] = useState<ShareStats | null>(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (visible && postId) {
      loadShareStats();
    }
  }, [visible, postId]);

  const loadShareStats = async () => {
    setLoading(true);
    try {
      const data = await getShareStats(postId, token);
      setStats(data);
    } catch (error) {
      console.error('Failed to load share stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getShareTypeIcon = (shareType: string) => {
    switch (shareType) {
      case 'native':
        return 'share-outline';
      case 'twitter':
        return 'logo-twitter';
      case 'facebook':
        return 'logo-facebook';
      case 'whatsapp':
        return 'logo-whatsapp';
      case 'telegram':
        return 'paper-plane-outline';
      case 'copy_link':
        return 'link-outline';
      case 'copy_text':
        return 'document-text-outline';
      default:
        return 'share-outline';
    }
  };

  const getShareTypeColor = (shareType: string) => {
    switch (shareType) {
      case 'native':
        return '#007AFF';
      case 'twitter':
        return '#1DA1F2';
      case 'facebook':
        return '#1877F2';
      case 'whatsapp':
        return '#25D366';
      case 'telegram':
        return '#0088CC';
      case 'copy_link':
        return '#34C759';
      case 'copy_text':
        return '#FF9500';
      default:
        return '#57606f';
    }
  };

  const formatShareType = (shareType: string) => {
    return shareType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Share Analytics</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Loading share statistics...</Text>
            </View>
          ) : stats ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.totalSharesContainer}>
                <Text style={styles.totalSharesLabel}>Total Shares</Text>
                <Text style={styles.totalSharesCount}>{stats.totalShares}</Text>
              </View>

              <View style={styles.statsContainer}>
                <Text style={styles.statsTitle}>Share Breakdown</Text>
                {stats.shareTypeStats.length > 0 ? (
                  stats.shareTypeStats.map(([shareType, count], index) => (
                    <View key={index} style={styles.statRow}>
                      <View style={styles.statIconContainer}>
                        <Ionicons
                          name={getShareTypeIcon(shareType) as any}
                          size={20}
                          color={getShareTypeColor(shareType)}
                        />
                      </View>
                      <Text style={styles.statLabel}>
                        {formatShareType(shareType)}
                      </Text>
                      <Text style={styles.statCount}>{count}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noStatsText}>No share data available</Text>
                )}
              </View>
            </ScrollView>
          ) : (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={48} color="#ff6b6b" />
              <Text style={styles.errorText}>Failed to load share statistics</Text>
              <TouchableOpacity style={styles.retryButton} onPress={loadShareStats}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  totalSharesContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    marginVertical: 16,
    alignItems: 'center',
  },
  totalSharesLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  totalSharesCount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statsContainer: {
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statLabel: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  statCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  noStatsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ShareAnalytics; 