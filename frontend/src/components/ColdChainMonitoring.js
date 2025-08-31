import React, { useState, useEffect } from 'react';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Card, 
  Badge, 
  Progress, 
  Button, 
  Select, 
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow
} from '@chakra-ui/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { AlertTriangle, Thermometer, Droplets, Shield, Zap } from 'lucide-react';

const ColdChainMonitoring = () => {
  const [sensorData, setSensorData] = useState([]);
  const [riskAnalysis, setRiskAnalysis] = useState({});
  const [selectedBatch, setSelectedBatch] = useState('BATCH001');
  const [anomalyAlerts, setAnomalyAlerts] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'sensor_data') {
        setSensorData(prev => [...prev, data.data]);
        fetchRiskAnalysis(data.data.batchID);
        detectAnomalies(data.data);
      }
    };

    return () => ws.close();
  }, []);

  const fetchRiskAnalysis = async (batchId) => {
    try {
      const response = await fetch(`http://localhost:8000/coldchain/risk?batch_id=${batchId}`);
      const data = await response.json();
      setRiskAnalysis(prev => ({...prev, [batchId]: data}));
    } catch (error) {
      console.error('Error fetching risk analysis:', error);
    }
  };

  const detectAnomalies = async (sensorData) => {
    try {
      const response = await fetch('http://localhost:8000/ai/anomaly-detection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          batch_id: sensorData.batchID,
          temperature: sensorData.temperature,
          humidity: sensorData.humidity,
          timestamp: sensorData.timestamp
        })
      });
      
      const anomalyData = await response.json();
      
      if (anomalyData.is_anomaly) {
        const newAlert = {
          id: Date.now(),
          batchId: sensorData.batchID,
          riskLevel: anomalyData.risk_level,
          factors: anomalyData.factors,
          recommendations: anomalyData.recommendations,
          timestamp: new Date().toISOString(),
          confidence: anomalyData.confidence
        };
        
        setAnomalyAlerts(prev => [newAlert, ...prev.slice(0, 4)]);
        
        // Show toast notification
        toast({
          title: `🚨 Anomaly Detected in ${sensorData.batchID}`,
          description: `Risk Level: ${anomalyData.risk_level} - ${anomalyData.factors.join(', ')}`,
          status: anomalyData.risk_level === 'CRITICAL' ? 'error' : 'warning',
          duration: 8000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error detecting anomalies:', error);
    }
  };

  const getBatchData = (batchId) => {
    return sensorData.filter(data => data.batchID === batchId).slice(-20);
  };

  const currentBatchData = getBatchData(selectedBatch);
  const currentRisk = riskAnalysis[selectedBatch];

  const getRiskColor = (status) => {
    switch (status) {
      case 'SAFE': return 'green';
      case 'WARNING': return 'yellow';
      case 'CRITICAL': return 'red';
      default: return 'gray';
    }
  };

  const getAnomalyColor = (riskLevel) => {
    switch (riskLevel) {
      case 'CRITICAL': return 'red';
      case 'HIGH': return 'orange';
      case 'MEDIUM': return 'yellow';
      case 'LOW': return 'green';
      default: return 'gray';
    }
  };

  return (
    <Box p={6} bg="gray.50" minH="100vh">
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box textAlign="center" py={8}>
          <Text fontSize="3xl" fontWeight="bold" color="blue.600">
            AI-Powered Cold Chain Monitoring
          </Text>
          <Text fontSize="lg" color="gray.600">
            Real-time temperature monitoring with intelligent anomaly detection
          </Text>
        </Box>

        {/* Batch Selection */}
        <Card p={4} shadow="md">
          <HStack justify="space-between">
            <Text fontSize="lg" fontWeight="semibold">
              Select Batch for Monitoring
            </Text>
            <Select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              w="200px"
              size="md"
            >
              <option value="BATCH001">BATCH001 - COVID-19 Vaccine</option>
              <option value="BATCH002">BATCH002 - Cancer Treatment</option>
              <option value="BATCH003">BATCH003 - Diabetes Medication</option>
            </Select>
          </HStack>
        </Card>

        {/* Real-time Status Cards */}
        <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6}>
          <GridItem>
            <Card p={6} bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" color="white" shadow="lg">
              <VStack spacing={3} align="center">
                <Thermometer size={32} />
                <Stat textAlign="center">
                  <StatLabel fontSize="lg">Current Temperature</StatLabel>
                  <StatNumber fontSize="3xl">
                    {currentBatchData.length > 0 ? `${currentBatchData[currentBatchData.length - 1].temperature}°C` : 'N/A'}
                  </StatNumber>
                  <StatHelpText>
                    {currentBatchData.length > 1 && (
                      <StatArrow 
                        type={currentBatchData[currentBatchData.length - 1].temperature > currentBatchData[currentBatchData.length - 2].temperature ? 'increase' : 'decrease'} 
                      />
                    )}
                  </StatHelpText>
                </Stat>
              </VStack>
            </Card>
          </GridItem>

          <GridItem>
            <Card p={6} bg="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" color="white" shadow="lg">
              <VStack spacing={3} align="center">
                <Droplets size={32} />
                <Stat textAlign="center">
                  <StatLabel fontSize="lg">Current Humidity</StatLabel>
                  <StatNumber fontSize="3xl">
                    {currentBatchData.length > 0 ? `${currentBatchData[currentBatchData.length - 1].humidity}%` : 'N/A'}
                  </StatNumber>
                  <StatHelpText>Optimal: 30-70%</StatHelpText>
                </Stat>
              </VStack>
            </Card>
          </GridItem>

          <GridItem>
            <Card p={6} bg={`linear-gradient(135deg, ${
              currentRisk?.status === 'SAFE' ? '#48bb78 0%, #38a169 100%' :
              currentRisk?.status === 'WARNING' ? '#ed8936 0%, #dd6b20 100%' :
              '#f56565 0%, #e53e3e 100%'
            })`} color="white" shadow="lg">
              <VStack spacing={3} align="center">
                <Shield size={32} />
                <Stat textAlign="center">
                  <StatLabel fontSize="lg">AI Status</StatLabel>
                  <StatNumber fontSize="3xl">{currentRisk?.status || 'UNKNOWN'}</StatNumber>
                  <StatHelpText>AI-Powered Analysis</StatHelpText>
                </Stat>
              </VStack>
            </Card>
          </GridItem>

          <GridItem>
            <Card p={6} bg="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" color="white" shadow="lg">
              <VStack spacing={3} align="center">
                <Zap size={32} />
                <Stat textAlign="center">
                  <StatLabel fontSize="lg">Risk Score</StatLabel>
                  <StatNumber fontSize="3xl">
                    {currentRisk?.risk_score ? `${currentRisk.risk_score}%` : 'N/A'}
                  </StatNumber>
                  <StatHelpText>Lower is Better</StatHelpText>
                </Stat>
              </VStack>
            </Card>
          </GridItem>
        </Grid>

        {/* Live Charts */}
        <Card p={6} shadow="lg">
          <VStack spacing={6}>
            <Text fontSize="2xl" fontWeight="bold">
              Live Temperature & Humidity Monitoring
            </Text>
            
            <Box w="full" h="400px">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentBatchData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                  />
                  <YAxis yAxisId="temp" />
                  <YAxis yAxisId="humidity" orientation="right" />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleString()}
                    formatter={(value, name) => [
                      name === 'temperature' ? `${value}°C` : `${value}%`,
                      name === 'temperature' ? 'Temperature' : 'Humidity'
                    ]}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.3}
                    yAxisId="temp"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="humidity" 
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.3}
                    yAxisId="humidity"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </VStack>
        </Card>

        {/* AI Anomaly Detection */}
        <Card p={6} shadow="lg">
          <VStack spacing={6}>
            <HStack spacing={4} align="center">
              <AlertTriangle size={24} color="#ED8936" />
              <Text fontSize="2xl" fontWeight="bold">
                AI Anomaly Detection
              </Text>
            </HStack>

            {anomalyAlerts.length > 0 ? (
              <VStack spacing={4} align="stretch" w="full">
                {anomalyAlerts.map(alert => (
                  <Alert
                    key={alert.id}
                    status={alert.riskLevel === 'CRITICAL' ? 'error' : 'warning'}
                    variant="left-accent"
                    borderRadius="md"
                  >
                    <AlertIcon />
                    <Box flex="1">
                      <AlertTitle>
                        {alert.riskLevel} Risk in {alert.batchId}
                      </AlertTitle>
                      <AlertDescription>
                        <VStack align="start" spacing={2} mt={2}>
                          <Text fontWeight="semibold">Factors:</Text>
                          <VStack align="start" spacing={1}>
                            {alert.factors.map((factor, index) => (
                              <Text key={index} fontSize="sm">• {factor}</Text>
                            ))}
                          </VStack>
                          <Text fontWeight="semibold" mt={2}>Recommendations:</Text>
                          <VStack align="start" spacing={1}>
                            {alert.recommendations.map((rec, index) => (
                              <Text key={index} fontSize="sm">• {rec}</Text>
                            ))}
                          </VStack>
                          <HStack spacing={4} mt={2}>
                            <Badge colorScheme={getAnomalyColor(alert.riskLevel)}>
                              Confidence: {(alert.confidence * 100).toFixed(0)}%
                            </Badge>
                            <Text fontSize="xs" color="gray.500">
                              {new Date(alert.timestamp).toLocaleString()}
                            </Text>
                          </HStack>
                        </VStack>
                      </AlertDescription>
                    </Box>
                  </Alert>
                ))}
              </VStack>
            ) : (
              <Box textAlign="center" py={8}>
                <Shield size={48} color="green" />
                <Text color="green.600" mt={4} fontSize="lg">
                  No anomalies detected - All systems operating normally
                </Text>
              </Box>
            )}
          </VStack>
        </Card>

        {/* AI Risk Analysis */}
        {currentRisk && (
          <Card p={6} shadow="lg">
            <VStack spacing={6}>
              <Text fontSize="2xl" fontWeight="bold">
                AI Risk Analysis
              </Text>
              
              <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6} w="full">
                <Box>
                  <Text fontSize="lg" fontWeight="semibold" mb={4}>Risk Assessment</Text>
                  <VStack spacing={4} align="stretch">
                    <HStack justify="space-between">
                      <Text>Risk Score:</Text>
                      <Badge colorScheme={getRiskColor(currentRisk.status)} size="lg">
                        {currentRisk.risk_score}%
                      </Badge>
                    </HStack>
                    <HStack justify="space-between">
                      <Text>Status:</Text>
                      <Badge colorScheme={getRiskColor(currentRisk.status)} size="lg">
                        {currentRisk.status}
                      </Badge>
                    </HStack>
                    <HStack justify="space-between">
                      <Text>Confidence:</Text>
                      <Text>{(currentRisk.confidence * 100).toFixed(0)}%</Text>
                    </HStack>
                  </VStack>
                </Box>

                <Box>
                  <Text fontSize="lg" fontWeight="semibold" mb={4}>Recommendations</Text>
                  <VStack spacing={2} align="stretch">
                    {currentRisk.recommendations?.map((rec, index) => (
                      <HStack key={index} spacing={2}>
                        <Box w={2} h={2} bg="blue.500" borderRadius="full" />
                        <Text fontSize="sm">{rec}</Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
              </Grid>
            </VStack>
          </Card>
        )}
      </VStack>
    </Box>
  );
};

export default ColdChainMonitoring;
