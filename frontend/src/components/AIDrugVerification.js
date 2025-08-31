import React, { useState, useRef } from 'react';
import { 
  Card, 
  Button, 
  Text, 
  Badge, 
  Progress, 
  Box, 
  VStack, 
  HStack, 
  Image, 
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import { Camera, Upload, CheckCircle, AlertTriangle, Info } from 'lucide-react';

const AIDrugVerification = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef();
  const cameraRef = useRef();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setImagePreview(e.target.result);
        setVerificationResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    // Simulate camera capture
    onOpen();
  };

  const simulateVerification = async () => {
    if (!selectedImage) {
      toast({
        title: "No Image Selected",
        description: "Please upload or capture an image first",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
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
      
      toast({
        title: "Verification Complete",
        description: `Drug verified with ${(mockResult.confidence_score * 100).toFixed(0)}% confidence`,
        status: mockResult.verified ? "success" : "error",
        duration: 5000,
        isClosable: true,
      });
    }, 2000);
  };

  const getConfidenceColor = (score) => {
    if (score >= 0.9) return "green";
    if (score >= 0.7) return "yellow";
    return "red";
  };

  const getQualityColor = (quality) => {
    switch (quality) {
      case "Excellent": return "green";
      case "Good": return "blue";
      case "Fair": return "orange";
      default: return "gray";
    }
  };

  return (
    <Box p={6} bg="gray.50" minH="100vh">
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box textAlign="center" py={8}>
          <Text fontSize="3xl" fontWeight="bold" color="blue.600">
            AI Drug Verification
          </Text>
          <Text fontSize="lg" color="gray.600">
            Verify medications using advanced computer vision and AI
          </Text>
        </Box>

        <HStack spacing={8} align="flex-start">
          {/* Left Panel - Image Upload & Camera */}
          <Card p={6} flex={1} shadow="lg">
            <VStack spacing={4}>
              <Text fontSize="xl" fontWeight="semibold">
                Upload or Capture Image
              </Text>
              
              {/* Image Preview */}
              {imagePreview && (
                <Box position="relative">
                  <Image 
                    src={imagePreview} 
                    alt="Drug preview" 
                    borderRadius="lg"
                    maxH="300px"
                    objectFit="contain"
                  />
                  <Button
                    size="sm"
                    colorScheme="red"
                    position="absolute"
                    top={2}
                    right={2}
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                      setVerificationResult(null);
                    }}
                  >
                    Remove
                  </Button>
                </Box>
              )}

              {/* Upload Buttons */}
              <HStack spacing={4} w="full">
                <Button
                  leftIcon={<Upload />}
                  colorScheme="blue"
                  variant="outline"
                  flex={1}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload Image
                </Button>
                <Button
                  leftIcon={<Camera />}
                  colorScheme="green"
                  variant="outline"
                  flex={1}
                  onClick={handleCameraCapture}
                >
                  Take Photo
                </Button>
              </HStack>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />

              {/* Verify Button */}
              <Button
                colorScheme="purple"
                size="lg"
                w="full"
                onClick={simulateVerification}
                isLoading={isVerifying}
                loadingText="Verifying..."
                isDisabled={!selectedImage}
              >
                Verify Drug
              </Button>
            </VStack>
          </Card>

          {/* Right Panel - Results */}
          <Card p={6} flex={1} shadow="lg">
            <VStack spacing={4}>
              <Text fontSize="xl" fontWeight="semibold">
                Verification Results
              </Text>

              {verificationResult ? (
                <VStack spacing={4} w="full">
                  {/* Verification Status */}
                  <HStack w="full" justify="space-between">
                    <Text fontWeight="semibold">Status:</Text>
                    <Badge
                      colorScheme={verificationResult.verified ? "green" : "red"}
                      size="lg"
                      p={2}
                    >
                      {verificationResult.verified ? "VERIFIED" : "NOT VERIFIED"}
                    </Badge>
                  </HStack>

                  {/* Confidence Score */}
                  <Box w="full">
                    <HStack justify="space-between" mb={2}>
                      <Text fontWeight="semibold">Confidence:</Text>
                      <Text color={getConfidenceColor(verificationResult.confidence_score)}>
                        {(verificationResult.confidence_score * 100).toFixed(0)}%
                      </Text>
                    </HStack>
                    <Progress
                      value={verificationResult.confidence_score * 100}
                      colorScheme={getConfidenceColor(verificationResult.confidence_score)}
                      size="lg"
                      borderRadius="full"
                    />
                  </Box>

                  {/* Drug Details */}
                  <VStack spacing={3} w="full" align="stretch">
                    <HStack justify="space-between">
                      <Text fontWeight="semibold">Drug Name:</Text>
                      <Text>{verificationResult.detected_drug_name}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="semibold">Dosage:</Text>
                      <Text>{verificationResult.detected_dosage}</Text>
                    </HStack>
                  </VStack>

                  {/* Quality Metrics */}
                  <VStack spacing={3} w="full" align="stretch">
                    <Text fontWeight="semibold">Quality Assessment:</Text>
                    <HStack justify="space-between">
                      <Text>Label Quality:</Text>
                      <Badge colorScheme={getQualityColor(verificationResult.label_quality)}>
                        {verificationResult.label_quality}
                      </Badge>
                    </HStack>
                    <HStack justify="space-between">
                      <Text>Color Match:</Text>
                      <Badge colorScheme={getQualityColor(verificationResult.color_match)}>
                        {verificationResult.color_match}
                      </Badge>
                    </HStack>
                    <HStack justify="space-between">
                      <Text>Shape Match:</Text>
                      <Badge colorScheme={getQualityColor(verificationResult.shape_match)}>
                        {verificationResult.shape_match}
                      </Badge>
                    </HStack>
                  </VStack>

                  {/* Recommendations */}
                  <Box w="full">
                    <Text fontWeight="semibold" mb={2}>Recommendations:</Text>
                    <VStack spacing={2} align="stretch">
                      {verificationResult.recommendations.map((rec, index) => (
                        <HStack key={index} spacing={2}>
                          <CheckCircle size={16} color="green" />
                          <Text fontSize="sm">{rec}</Text>
                        </HStack>
                      ))}
                    </VStack>
                  </Box>
                </VStack>
              ) : (
                <Box textAlign="center" py={8}>
                  <Info size={48} color="gray.400" />
                  <Text color="gray.500" mt={4}>
                    Upload or capture an image to verify
                  </Text>
                </Box>
              )}
            </VStack>
          </Card>
        </HStack>
      </VStack>

      {/* Camera Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Camera Capture</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Box
              ref={cameraRef}
              bg="black"
              h="400px"
              borderRadius="lg"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
            >
              <VStack spacing={4}>
                <Camera size={64} />
                <Text>Camera simulation - Click to capture</Text>
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    // Simulate camera capture
                    const mockImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U2ltdWxhdGVkIENhbWVyYSBDYXB0dXJlPC90ZXh0Pjwvc3ZnPg==";
                    setSelectedImage(mockImage);
                    setImagePreview(mockImage);
                    setVerificationResult(null);
                    onClose();
                  }}
                >
                  Capture Photo
                </Button>
              </VStack>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AIDrugVerification;
