import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/authContext';
import { performFactCheck, getLatestFactCheck } from '../../src/services/api';

interface FactCheckResult {
  id: number;
  accuracyScore: number;
  validityStatus: string;
  confidenceLevel: string;
  aiAnalysis: string;
  sourcesCited: string;
  corrections: string;
  reasoning: string;
  checkedAt: string;
}

interface FactCheckModalProps {
  visible: boolean;
  onClose: () => void;
  postId: string;
  postContent: string;
}

const FactCheckModal: React.FC<FactCheckModalProps> = ({
  visible,
  onClose,
  postId,
  postContent,
}) => {
  const [factCheckResult, setFactCheckResult] = useState<FactCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (visible && postId) {
      loadLatestFactCheck();
    }
  }, [visible, postId]);

  const loadLatestFactCheck = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const result = await getLatestFactCheck(postId, token);
      setFactCheckResult(result);
    } catch (error) {
      console.error('Failed to load fact check:', error);
      setFactCheckResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePerformFactCheck = async () => {
    if (!token) {
      Alert.alert('Error', 'Authentication required');
      return;
    }

    setChecking(true);
    try {
      const result = await performFactCheck(postId, token, 'user');
      setFactCheckResult(result);
      Alert.alert('Success', 'Fact check completed successfully!');
    } catch (error) {
      console.error('Fact check failed:', error);
      Alert.alert('Error', 'Failed to perform fact check. Please try again.');
    } finally {
      setChecking(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TRUE':
        return '#28a745';
      case 'FALSE':
        return '#dc3545';
      case 'MISLEADING':
        return '#ffc107';
      case 'PARTIALLY_TRUE':
        return '#fd7e14';
      case 'UNVERIFIABLE':
        return '#6c757d';
      default:
        return '#6c757d';
    }
  };

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'HIGH':
        return '#28a745';
      case 'MEDIUM':
        return '#ffc107';
      case 'LOW':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
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
          <Text style={styles.headerTitle}>Fact Check Results</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Loading fact check results...</Text>
            </View>
          ) : factCheckResult ? (
            <View style={styles.resultContainer}>
              {/* Status Overview */}
              <View style={styles.statusSection}>
                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>Validity Status:</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(factCheckResult.validityStatus) }]}>
                    <Text style={styles.statusText}>{factCheckResult.validityStatus}</Text>
                  </View>
                </View>
                
                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>Confidence Level:</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getConfidenceColor(factCheckResult.confidenceLevel) }]}>
                    <Text style={styles.statusText}>{factCheckResult.confidenceLevel}</Text>
                  </View>
                </View>

                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>Accuracy Score:</Text>
                  <Text style={styles.accuracyScore}>
                    {Math.round(factCheckResult.accuracyScore * 100)}%
                  </Text>
                </View>
              </View>

              {/* AI Analysis */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>AI Analysis</Text>
                <Text style={styles.analysisText}>{factCheckResult.aiAnalysis}</Text>
              </View>

              {/* Reasoning */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Reasoning</Text>
                <Text style={styles.analysisText}>{factCheckResult.reasoning}</Text>
              </View>

              {/* Sources */}
              {factCheckResult.sourcesCited && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Sources Cited</Text>
                  <Text style={styles.analysisText}>{factCheckResult.sourcesCited}</Text>
                </View>
              )}

              {/* Corrections */}
              {factCheckResult.corrections && factCheckResult.corrections !== 'No major corrections identified' && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Corrections</Text>
                  <Text style={styles.analysisText}>{factCheckResult.corrections}</Text>
                </View>
              )}

              {/* Checked At */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Last Checked</Text>
                <Text style={styles.dateText}>{formatDate(factCheckResult.checkedAt)}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.noResultContainer}>
              <Ionicons name="search" size={64} color="#ccc" />
              <Text style={styles.noResultTitle}>No Fact Check Available</Text>
              <Text style={styles.noResultText}>
                This post hasn't been fact-checked yet. Tap the button below to perform a fact check.
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.factCheckButton, checking && styles.disabledButton]}
            onPress={handlePerformFactCheck}
            disabled={checking}
          >
            {checking ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.factCheckButtonText}>
                  {factCheckResult ? 'Re-check Facts' : 'Check Facts'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
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
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  resultContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statusSection: {
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  accuracyScore: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  analysisText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  dateText: {
    fontSize: 14,
    color: '#999',
  },
  noResultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  factCheckButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  factCheckButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default FactCheckModal; 