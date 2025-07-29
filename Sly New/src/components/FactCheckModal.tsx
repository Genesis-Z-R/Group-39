import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/ThemeContext';
import { Question } from '../types';
import { FactCheckResult, Claim, Source, FactCheckService } from '../services/factCheckService';

interface FactCheckModalProps {
  visible: boolean;
  onClose: () => void;
  question: Question;
}

const FactCheckModal: React.FC<FactCheckModalProps> = ({
  visible,
  onClose,
  question,
}) => {
  const { theme } = useTheme();
  const [factCheckResult, setFactCheckResult] = useState<FactCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible && question) {
      performFactCheck();
    }
  }, [visible, question]);

  const performFactCheck = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const factCheckService = FactCheckService.getInstance();
      const result = await factCheckService.factCheckQuestion(question);
      setFactCheckResult(result);
    } catch (err) {
      setError('Failed to perform fact check. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSourcePress = (url: string) => {
    Linking.openURL(url);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return '#4CAF50';
    if (confidence >= 0.6) return '#FF9800';
    return '#F44336';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  const renderClaim = (claim: Claim, index: number) => (
    <View key={index} style={[styles.claimContainer, { backgroundColor: theme.colors.card }]}>
      <View style={styles.claimHeader}>
        <Ionicons
          name={claim.isVerified ? 'checkmark-circle' : 'close-circle'}
          size={20}
          color={claim.isVerified ? '#4CAF50' : '#F44336'}
        />
        <Text style={[styles.claimText, { color: theme.colors.text }]} numberOfLines={3}>
          {claim.text}
        </Text>
      </View>
      <View style={styles.claimDetails}>
        <View style={styles.confidenceIndicator}>
          <View style={[styles.confidenceBar, { backgroundColor: getConfidenceColor(claim.confidence) }]}>
            <View style={[styles.confidenceFill, { width: `${claim.confidence * 100}%` }]} />
          </View>
          <Text style={[styles.confidenceText, { color: theme.colors.textSecondary }]}>
            {getConfidenceText(claim.confidence)} ({Math.round(claim.confidence * 100)}%)
          </Text>
        </View>
        <Text style={[styles.explanationText, { color: theme.colors.textSecondary }]}>
          {claim.explanation}
        </Text>
      </View>
    </View>
  );

  const renderSource = (source: Source, index: number) => (
    <TouchableOpacity
      key={index}
      style={[styles.sourceContainer, { backgroundColor: theme.colors.card }]}
      onPress={() => handleSourcePress(source.url)}
    >
      <View style={styles.sourceHeader}>
        <Ionicons name="link-outline" size={16} color={theme.colors.primary} />
        <Text style={[styles.sourceTitle, { color: theme.colors.text }]}>
          {source.title}
        </Text>
      </View>
      <View style={styles.sourceDetails}>
        <View style={styles.reliabilityIndicator}>
          <View style={[styles.reliabilityBar, { backgroundColor: '#4CAF50' }]}>
            <View style={[styles.reliabilityFill, { width: `${source.reliability * 100}%` }]} />
          </View>
          <Text style={[styles.reliabilityText, { color: theme.colors.textSecondary }]}>
            Reliability: {Math.round(source.reliability * 100)}%
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

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
            <Text style={[styles.title, { color: theme.colors.text }]}>
              AI Fact Check
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={[styles.loadingText, { color: theme.colors.text }]}>
                  Analyzing content with AI...
                </Text>
              </View>
            )}

            {error && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={24} color="#F44336" />
                <Text style={[styles.errorText, { color: theme.colors.text }]}>
                  {error}
                </Text>
                <TouchableOpacity style={styles.retryButton} onPress={performFactCheck}>
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            )}

            {factCheckResult && !loading && (
              <>
                <View style={[styles.summaryContainer, { backgroundColor: theme.colors.card }]}>
                  <View style={styles.summaryHeader}>
                    <Ionicons
                      name={factCheckResult.isFactual ? 'checkmark-circle' : 'warning'}
                      size={24}
                      color={factCheckResult.isFactual ? '#4CAF50' : '#FF9800'}
                    />
                    <Text style={[styles.summaryText, { color: theme.colors.text }]}>
                      {factCheckResult.summary}
                    </Text>
                  </View>
                  <View style={styles.overallConfidence}>
                    <Text style={[styles.confidenceLabel, { color: theme.colors.textSecondary }]}>
                      Overall Confidence
                    </Text>
                    <Text style={[styles.confidenceValue, { color: getConfidenceColor(factCheckResult.confidence) }]}>
                      {Math.round(factCheckResult.confidence * 100)}%
                    </Text>
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                    Claims Analysis
                  </Text>
                  {factCheckResult.claims.map((claim, index) => renderClaim(claim, index))}
                </View>

                {factCheckResult.sources.length > 0 && (
                  <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                      Sources
                    </Text>
                    {factCheckResult.sources.map((source, index) => renderSource(source, index))}
                  </View>
                )}

                <View style={styles.disclaimer}>
                  <Text style={[styles.disclaimerText, { color: theme.colors.textSecondary }]}>
                    ⚠️ This fact check is for informational purposes only. Always verify information from multiple sources.
                  </Text>
                </View>
              </>
            )}
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
    maxHeight: '90%',
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
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  summaryContainer: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  summaryText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    lineHeight: 20,
  },
  overallConfidence: {
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  confidenceLabel: {
    fontSize: 12,
    marginBottom: 5,
  },
  confidenceValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  claimContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  claimHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  claimText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    lineHeight: 18,
  },
  claimDetails: {
    marginLeft: 28,
  },
  confidenceIndicator: {
    marginBottom: 5,
  },
  confidenceBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 2,
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  confidenceText: {
    fontSize: 12,
  },
  explanationText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  sourceContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  sourceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sourceTitle: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  sourceDetails: {
    marginLeft: 24,
  },
  reliabilityIndicator: {
    marginBottom: 5,
  },
  reliabilityBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 2,
  },
  reliabilityFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  reliabilityText: {
    fontSize: 12,
  },
  disclaimer: {
    padding: 15,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    marginTop: 10,
  },
  disclaimerText: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default FactCheckModal; 