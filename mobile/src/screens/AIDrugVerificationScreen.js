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
  Dimensions,
  Animated
} from 'react-native';
import { Card, Button, Title, Paragraph, Badge, ProgressBar, Banner, useTheme as usePaperTheme } from 'react-native-paper';
import { Camera, Upload, CheckCircle, AlertTriangle, Info, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';
import { ModernCard } from '../components/ModernCard';
import { GRADIENTS } from '../utils/themes';

const { width, height } = Dimensions.get('window');

const AIDrugVerificationScreen = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [showSimulationBanner, setShowSimulationBanner] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));
  const { isDarkMode } = useTheme();
  const paperTheme = usePaperTheme();

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleImageUpload = async () => {
    try {
      // Request permission to access media library
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert(
          'Permission Required',
          'Permission to access camera roll is required to upload images.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setSelectedImage(imageUri);
        setImagePreview(imageUri);
        setVerificationResult(null);
        
        // Show simulation notice
        Alert.alert(
          'Simulation Mode',
          'This is a demo version. In production, the image would be processed by our AI verification system.',
          [{ text: 'Got it' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleCameraCapture = async () => {
    try {
      // Request permission to access camera
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert(
          'Permission Required',
          'Permission to access camera is required to take photos.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setSelectedImage(imageUri);
        setImagePreview(imageUri);
        setVerificationResult(null);
        
        // Show simulation notice
        Alert.alert(
          'Simulation Mode',
          'This is a demo version. In production, the captured image would be processed by our AI verification system.',
          [{ text: 'Got it' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to access camera. Please try again.');
    }
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
    <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
      {/* Modern Header with Gradient */}
      <LinearGradient
        colors={GRADIENTS.primary}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          <Title style={styles.headerTitle}>
            AI Drug Verification
          </Title>
          <Paragraph style={styles.headerSubtitle}>
            Verify medications using advanced computer vision and AI
          </Paragraph>
        </Animated.View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Simulation Notice Banner */}
        {showSimulationBanner && (
          <Banner
            visible={showSimulationBanner}
            actions={[
              {
                label: 'Got it',
                onPress: () => setShowSimulationBanner(false),
              },
            ]}
            icon={() => <Info size={20} color={paperTheme.colors.primary} />}
            style={styles.banner}
          >
            This is a simulation. Camera and image processing features are for demonstration purposes.
          </Banner>
        )}

        {/* Image Upload & Camera Section */}
        <ModernCard style={styles.card} shadow="medium">
          <View style={styles.cardContent}>
            <Title style={[styles.cardTitle, { color: paperTheme.colors.onSurface }]}>
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
              <LinearGradient
                colors={['#3B82F6', '#1D4ED8']}
                style={styles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Button
                  mode="text"
                  icon={() => <Upload size={20} color="white" />}
                  onPress={handleImageUpload}
                  style={styles.button}
                  labelStyle={[styles.buttonLabel, { color: 'white' }]}
                >
                  Upload Image
                </Button>
              </LinearGradient>
              
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Button
                  mode="text"
                  icon={() => <Camera size={20} color="white" />}
                  onPress={handleCameraCapture}
                  style={styles.button}
                  labelStyle={[styles.buttonLabel, { color: 'white' }]}
                >
                  Take Photo
                </Button>
              </LinearGradient>
            </View>

            {/* Verify Button */}
            <LinearGradient
              colors={selectedImage ? ['#8B5CF6', '#7C3AED'] : ['#9CA3AF', '#6B7280']}
              style={styles.verifyButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Button
                mode="text"
                onPress={simulateVerification}
                loading={isVerifying}
                disabled={!selectedImage}
                style={styles.verifyButton}
                labelStyle={[styles.verifyButtonLabel, { color: 'white' }]}
              >
                {isVerifying ? 'Verifying...' : 'Verify Drug'}
              </Button>
            </LinearGradient>
          </View>
        </ModernCard>

        {/* Verification Results */}
        <ModernCard style={styles.card} shadow="medium">
          <View style={styles.cardContent}>
            <Title style={[styles.cardTitle, { color: paperTheme.colors.onSurface }]}>
              Verification Results
            </Title>

            {verificationResult ? (
              <View style={styles.resultsContainer}>
                {/* Verification Status */}
                <View style={styles.statusRow}>
                  <Text style={[styles.statusLabel, { color: paperTheme.colors.onSurface }]}>
                    Status:
                  </Text>
                  <LinearGradient
                    colors={verificationResult.verified ? ['#10B981', '#059669'] : ['#EF4444', '#DC2626']}
                    style={styles.statusBadgeGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.statusBadgeText}>
                      {verificationResult.verified ? 'VERIFIED' : 'NOT VERIFIED'}
                    </Text>
                  </LinearGradient>
                </View>

                {/* Confidence Score */}
                <View style={styles.confidenceContainer}>
                  <View style={styles.confidenceHeader}>
                    <Text style={[styles.confidenceLabel, { color: paperTheme.colors.onSurface }]}>
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
                    <Text style={[styles.detailLabel, { color: paperTheme.colors.onSurfaceVariant }]}>
                      Drug Name:
                    </Text>
                    <Text style={[styles.detailValue, { color: paperTheme.colors.onSurface }]}>
                      {verificationResult.detected_drug_name}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: paperTheme.colors.onSurfaceVariant }]}>
                      Dosage:
                    </Text>
                    <Text style={[styles.detailValue, { color: paperTheme.colors.onSurface }]}>
                      {verificationResult.detected_dosage}
                    </Text>
                  </View>
                </View>

                {/* Quality Metrics */}
                <View style={styles.qualityContainer}>
                  <Text style={[styles.qualityTitle, { color: paperTheme.colors.onSurface }]}>
                    Quality Assessment:
                  </Text>
                  <View style={styles.qualityRow}>
                    <Text style={[styles.qualityLabel, { color: paperTheme.colors.onSurfaceVariant }]}>
                      Label Quality:
                    </Text>
                    <View style={[styles.qualityBadge, { backgroundColor: getQualityColor(verificationResult.label_quality) }]}>
                      <Text style={styles.qualityBadgeText}>{verificationResult.label_quality}</Text>
                    </View>
                  </View>
                  <View style={styles.qualityRow}>
                    <Text style={[styles.qualityLabel, { color: paperTheme.colors.onSurfaceVariant }]}>
                      Color Match:
                    </Text>
                    <View style={[styles.qualityBadge, { backgroundColor: getQualityColor(verificationResult.color_match) }]}>
                      <Text style={styles.qualityBadgeText}>{verificationResult.color_match}</Text>
                    </View>
                  </View>
                  <View style={styles.qualityRow}>
                    <Text style={[styles.qualityLabel, { color: paperTheme.colors.onSurfaceVariant }]}>
                      Shape Match:
                    </Text>
                    <View style={[styles.qualityBadge, { backgroundColor: getQualityColor(verificationResult.shape_match) }]}>
                      <Text style={styles.qualityBadgeText}>{verificationResult.shape_match}</Text>
                    </View>
                  </View>
                </View>

                {/* Recommendations */}
                <View style={styles.recommendationsContainer}>
                  <Text style={[styles.recommendationsTitle, { color: paperTheme.colors.onSurface }]}>
                    Recommendations:
                  </Text>
                  {verificationResult.recommendations.map((rec, index) => (
                    <View key={index} style={styles.recommendationItem}>
                      <CheckCircle size={16} color="#10B981" />
                      <Text style={[styles.recommendationText, { color: paperTheme.colors.onSurfaceVariant }]}>
                        {rec}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Info size={48} color={paperTheme.colors.onSurfaceVariant} />
                <Text style={[styles.emptyStateText, { color: paperTheme.colors.onSurfaceVariant }]}>
                  Upload or capture an image to verify
                </Text>
              </View>
            )}
          </View>
        </ModernCard>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: -20,
  },
  banner: {
    marginBottom: 16,
    borderRadius: 12,
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
  },
  cardContent: {
    padding: 20,
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
    marginBottom: 20,
    gap: 12,
  },
  gradientButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  button: {
    margin: 0,
    borderRadius: 0,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 8,
  },
  verifyButtonGradient: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  verifyButton: {
    margin: 0,
    borderRadius: 0,
    paddingVertical: 12,
  },
  verifyButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadgeGradient: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  qualityBadgeText: {
    color: 'white',
    fontSize: 12,
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
