import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { Card, Button, Title, Paragraph, Badge, ProgressBar } from 'react-native-paper';
import { Camera, Upload, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

const AIDrugVerificationScreen = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const { isDarkMode } = useTheme();

  const handleImageUpload = () => {
    // Simulate image upload
    Alert.alert('Image Upload', 'Image upload functionality would be implemented here');
  };

  const handleCameraCapture = () => {
    // Simulate camera capture
    const mockImage = 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Drug+Image';
    setSelectedImage(mockImage);
    setImagePreview(mockImage);
    setVerificationResult(null);
  };

  const simulateVerification = async () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please upload or capture an image first');
      return;
    }

    setIsVerifying(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const mockResult = {
        verified: Math.random() > 0.2, // 80% success rate
        confidence_score: (0.7 + Math.random() * 0.25).toFixed(2),
        detected_drug_name: "Amoxicillin 500mg",
        detected_dosage: "500mg",
        label_quality: ["Excellent", "Good", "Fair"][Math.floor(Math.random() * 3)],
        color_match: ["Perfect", "Good", "Acceptable"][Math.floor(Math.random() * 3)],
        shape_match: ["Exact", "Close", "Similar"][Math.floor(Math.random() * 3)],
        recommendations: [
          "Label is clearly visible and matches expected medication",
          "Dosage information is accurate",
          "Expiry date is within acceptable range"
        ]
      };
      
      setVerificationResult(mockResult);
      setIsVerifying(false);
      
      Alert.alert(
        "Verification Complete",
        `Drug verified with ${(mockResult.confidence_score * 100).toFixed(0)}% confidence`,
        [{ text: "OK" }]
      );
    }, 2000);
  };

  const getConfidenceColor = (score) => {
    if (score >= 0.9) return '#10B981';
    if (score >= 0.7) return '#F59E0B';
    return '#EF4444';
  };

  const getQualityColor = (quality) => {
    switch (quality) {
      case "Excellent": return '#10B981';
      case "Good": return '#3B82F6';
      case "Fair": return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setVerificationResult(null);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDarkMode ? '#1F2937' : '#F3F4F6' }]}>
      <View style={styles.header}>
        <Title style={[styles.headerTitle, { color: isDarkMode ? '#F9FAFB' : '#111827' }]}>
          AI Drug Verification
        </Title>
        <Paragraph style={[styles.headerSubtitle, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
          Verify medications using advanced computer vision and AI
        </Paragraph>
      </View>

      <View style={styles.content}>
        {/* Image Upload & Camera Section */}
        <Card style={[styles.card, { backgroundColor: isDarkMode ? '#374151' : '#FFFFFF' }]}>
          <Card.Content>
            <Title style={[styles.cardTitle, { color: isDarkMode ? '#F9FAFB' : '#111827' }]}>
              Upload or Capture Image
            </Title>
            
            {/* Image Preview */}
            {imagePreview && (
              <View style={styles.imageContainer}>
                <Image source={{ uri: imagePreview }} style={styles.imagePreview} />
                <TouchableOpacity style={styles.removeButton} onPress={clearImage}>
                  <X size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            )}

            {/* Upload Buttons */}
            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                icon={() => <Upload size={20} color="#3B82F6" />}
                onPress={handleImageUpload}
                style={[styles.button, styles.uploadButton]}
                labelStyle={styles.buttonLabel}
              >
                Upload Image
              </Button>
              
              <Button
                mode="outlined"
                icon={() => <Camera size={20} color="#10B981" />}
                onPress={handleCameraCapture}
                style={[styles.button, styles.cameraButton]}
                labelStyle={styles.buttonLabel}
              >
                Take Photo
              </Button>
            </View>

            {/* Verify Button */}
            <Button
              mode="contained"
              onPress={simulateVerification}
              loading={isVerifying}
              disabled={!selectedImage}
              style={[styles.verifyButton, { backgroundColor: '#8B5CF6' }]}
              labelStyle={styles.verifyButtonLabel}
            >
              {isVerifying ? 'Verifying...' : 'Verify Drug'}
            </Button>
          </Card.Content>
        </Card>

        {/* Verification Results */}
        <Card style={[styles.card, { backgroundColor: isDarkMode ? '#374151' : '#FFFFFF' }]}>
          <Card.Content>
            <Title style={[styles.cardTitle, { color: isDarkMode ? '#F9FAFB' : '#111827' }]}>
              Verification Results
            </Title>

            {verificationResult ? (
              <View style={styles.resultsContainer}>
                {/* Verification Status */}
                <View style={styles.statusRow}>
                  <Text style={[styles.statusLabel, { color: isDarkMode ? '#D1D5DB' : '#374151' }]}>
                    Status:
                  </Text>
                  <Badge
                    style={[
                      styles.statusBadge,
                      { backgroundColor: verificationResult.verified ? '#10B981' : '#EF4444' }
                    ]}
                  >
                    {verificationResult.verified ? 'VERIFIED' : 'NOT VERIFIED'}
                  </Badge>
                </View>

                {/* Confidence Score */}
                <View style={styles.confidenceContainer}>
                  <View style={styles.confidenceHeader}>
                    <Text style={[styles.confidenceLabel, { color: isDarkMode ? '#D1D5DB' : '#374151' }]}>
                      Confidence:
                    </Text>
                    <Text style={[styles.confidenceValue, { color: getConfidenceColor(verificationResult.confidence_score) }]}>
                      {(verificationResult.confidence_score * 100).toFixed(0)}%
                    </Text>
                  </View>
                  <ProgressBar
                    progress={verificationResult.confidence_score}
                    color={getConfidenceColor(verificationResult.confidence_score)}
                    style={styles.progressBar}
                  />
                </View>

                {/* Drug Details */}
                <View style={styles.detailsContainer}>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: isDarkMode ? '#D1D5DB' : '#374151' }]}>
                      Drug Name:
                    </Text>
                    <Text style={[styles.detailValue, { color: isDarkMode ? '#F9FAFB' : '#111827' }]}>
                      {verificationResult.detected_drug_name}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: isDarkMode ? '#D1D5DB' : '#374151' }]}>
                      Dosage:
                    </Text>
                    <Text style={[styles.detailValue, { color: isDarkMode ? '#F9FAFB' : '#111827' }]}>
                      {verificationResult.detected_dosage}
                    </Text>
                  </View>
                </View>

                {/* Quality Metrics */}
                <View style={styles.qualityContainer}>
                  <Text style={[styles.qualityTitle, { color: isDarkMode ? '#F9FAFB' : '#111827' }]}>
                    Quality Assessment:
                  </Text>
                  <View style={styles.qualityRow}>
                    <Text style={[styles.qualityLabel, { color: isDarkMode ? '#D1D5DB' : '#374151' }]}>
                      Label Quality:
                    </Text>
                    <Badge style={[styles.qualityBadge, { backgroundColor: getQualityColor(verificationResult.label_quality) }]}>
                      {verificationResult.label_quality}
                    </Badge>
                  </View>
                  <View style={styles.qualityRow}>
                    <Text style={[styles.qualityLabel, { color: isDarkMode ? '#D1D5DB' : '#374151' }]}>
                      Color Match:
                    </Text>
                    <Badge style={[styles.qualityBadge, { backgroundColor: getQualityColor(verificationResult.color_match) }]}>
                      {verificationResult.color_match}
                    </Badge>
                  </View>
                  <View style={styles.qualityRow}>
                    <Text style={[styles.qualityLabel, { color: isDarkMode ? '#D1D5DB' : '#374151' }]}>
                      Shape Match:
                    </Text>
                    <Badge style={[styles.qualityBadge, { backgroundColor: getQualityColor(verificationResult.shape_match) }]}>
                      {verificationResult.shape_match}
                    </Badge>
                  </View>
                </View>

                {/* Recommendations */}
                <View style={styles.recommendationsContainer}>
                  <Text style={[styles.recommendationsTitle, { color: isDarkMode ? '#F9FAFB' : '#111827' }]}>
                    Recommendations:
                  </Text>
                  {verificationResult.recommendations.map((rec, index) => (
                    <View key={index} style={styles.recommendationItem}>
                      <CheckCircle size={16} color="#10B981" />
                      <Text style={[styles.recommendationText, { color: isDarkMode ? '#D1D5DB' : '#374151' }]}>
                        {rec}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Info size={48} color={isDarkMode ? '#6B7280' : '#9CA3AF'} />
                <Text style={[styles.emptyStateText, { color: isDarkMode ? '#9CA3AF' : '#6B7280' }]}>
                  Upload or capture an image to verify
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
    alignItems: 'center',
  },
  imagePreview: {
    width: width - 80,
    height: 200,
    borderRadius: 12,
    resizeMode: 'contain',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 4,
    elevation: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  uploadButton: {
    borderColor: '#3B82F6',
  },
  cameraButton: {
    borderColor: '#10B981',
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  verifyButton: {
    width: '100%',
    paddingVertical: 8,
  },
  verifyButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    space: 16,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  confidenceContainer: {
    marginBottom: 16,
  },
  confidenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  confidenceLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  confidenceValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 16,
  },
  qualityContainer: {
    marginBottom: 16,
  },
  qualityTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  qualityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  qualityLabel: {
    fontSize: 14,
  },
  qualityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  recommendationsContainer: {
    marginBottom: 16,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
});

export default AIDrugVerificationScreen;
