import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions
} from 'react-native';
import { Card, Button, Title, Paragraph, Badge, ProgressBar, TextInput, SegmentedButtons } from 'react-native-paper';
import { Plus, TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, Mic, BarChart3, User } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { LineChart } from 'react-native-chart-kit';


const { width, height } = Dimensions.get('window');

const PatientAdherenceScreen = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [medicationLog, setMedicationLog] = useState([]);
  const [adherenceData, setAdherenceData] = useState([]);
  const [isLogging, setIsLogging] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [logForm, setLogForm] = useState({
    medication: '',
    dosage: '',
    method: 'manual'
  });
  const { isDarkMode } = useTheme();

  // Mock patient data
  const mockPatients = [
    { id: "P001", name: "John Smith", age: 65, medications: ["Metformin", "Lisinopril", "Atorvastatin"] },
    { id: "P002", name: "Sarah Johnson", age: 42, medications: ["Sertraline", "Bupropion"] },
    { id: "P003", name: "Michael Brown", age: 58, medications: ["Warfarin", "Metoprolol", "Furosemide"] },
    { id: "P004", name: "Emily Davis", age: 35, medications: ["Levothyroxine", "Iron Supplement"] },
    { id: "P005", name: "Robert Wilson", age: 71, medications: ["Donepezil", "Memantine", "Vitamin D"] }
  ];

  useEffect(() => {
    setPatients(mockPatients);
    if (mockPatients.length > 0) {
      setSelectedPatient(mockPatients[0]);
      generateAdherenceData(mockPatients[0].id);
    }
  }, []);

  const generateAdherenceData = (patientId) => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        adherence: Math.random() * 0.4 + 0.6, // 60-100% adherence
        medications: Math.floor(Math.random() * 3) + 1,
        total: 3
      });
    }
    setAdherenceData(data);
  };

  const handlePatientChange = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    setSelectedPatient(patient);
    generateAdherenceData(patientId);
  };

  const logMedication = async () => {
    if (!logForm.medication || !logForm.dosage) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    setIsLogging(true);
    
    // Simulate API call
    setTimeout(() => {
      const newLog = {
        id: Date.now(),
        patientId: selectedPatient.id,
        medication: logForm.medication,
        dosage: logForm.dosage,
        intakeTime: new Date().toISOString(),
        method: logForm.method,
        timestamp: new Date().toISOString()
      };
      
      setMedicationLog(prev => [newLog, ...prev]);
      
      // Simulate AI adherence analysis
      const adherenceScore = Math.random() * 0.4 + 0.6;
      const trend = adherenceScore > 0.8 ? "improving" : adherenceScore < 0.7 ? "declining" : "stable";
      
      Alert.alert(
        "Medication Logged",
        `Adherence: ${(adherenceScore * 100).toFixed(0)}% - Trend: ${trend}`,
        [{ text: "OK" }]
      );
      
      setIsLogging(false);
      setShowLogModal(false);
      setLogForm({ medication: '', dosage: '', method: 'manual' });
    }, 1500);
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "improving": return <TrendingUp color="#10B981" />;
      case "declining": return <TrendingDown color="#EF4444" />;
      default: return <Minus color="#6B7280" />;
    }
  };

  const getAdherenceColor = (score) => {
    if (score >= 0.9) return '#10B981';
    if (score >= 0.8) return '#3B82F6';
    if (score >= 0.7) return '#F59E0B';
    return '#EF4444';
  };

  const chartData = {
    labels: adherenceData.slice(-7).map(d => d.date.slice(-5)),
    datasets: [{
      data: adherenceData.slice(-7).map(d => d.adherence * 100)
    }]
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDarkMode ? '#1F2937' : '#F3F4F6' }]}>
      <View style={styles.header}>
        <Title style={[styles.headerTitle, { color: isDarkMode ? '#F9FAFB' : '#111827' }]}>
          AI Patient Adherence Tracker
        </Title>
        <Paragraph style={[styles.headerSubtitle, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
          Monitor medication compliance with machine learning insights
        </Paragraph>
      </View>

      <View style={styles.content}>
        {/* Patient Selection */}
        <Card style={[styles.card, { backgroundColor: isDarkMode ? '#374151' : '#FFFFFF' }]}>
          <Card.Content>
            <Title style={[styles.cardTitle, { color: isDarkMode ? '#F9FAFB' : '#111827' }]}>
              Select Patient
            </Title>
            
            <View style={styles.patientSelector}>
              {patients.map(patient => (
                <TouchableOpacity
                  key={patient.id}
                  style={[
                    styles.patientOption,
                    selectedPatient?.id === patient.id && styles.selectedPatient
                  ]}
                  onPress={() => handlePatientChange(patient.id)}
                >
                  <User size={20} color={selectedPatient?.id === patient.id ? '#FFFFFF' : '#6B7280'} />
                  <Text style={[
                    styles.patientName,
                    { color: selectedPatient?.id === patient.id ? '#FFFFFF' : isDarkMode ? '#D1D5DB' : '#374151' }
                  ]}>
                    {patient.name}
                  </Text>
                  <Text style={[
                    styles.patientAge,
                    { color: selectedPatient?.id === patient.id ? '#E5E7EB' : isDarkMode ? '#9CA3AF' : '#6B7280' }
                  ]}>
                    {patient.age} years
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Patient Info */}
        {selectedPatient && (
          <Card style={[styles.card, { backgroundColor: isDarkMode ? '#374151' : '#FFFFFF' }]}>
            <Card.Content>
              <Title style={[styles.cardTitle, { color: isDarkMode ? '#F9FAFB' : '#111827' }]}>
                Patient Information
              </Title>
              
              <View style={styles.patientInfo}>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: isDarkMode ? '#D1D5DB' : '#374151' }]}>
                    Name:
                  </Text>
                  <Text style={[styles.infoValue, { color: isDarkMode ? '#F9FAFB' : '#111827' }]}>
                    {selectedPatient.name}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: isDarkMode ? '#D1D5DB' : '#374151' }]}>
                    Age:
                  </Text>
                  <Text style={[styles.infoValue, { color: isDarkMode ? '#F9FAFB' : '#111827' }]}>
                    {selectedPatient.age} years
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: isDarkMode ? '#D1D5DB' : '#374151' }]}>
                    Medications:
                  </Text>
                  <Text style={[styles.infoValue, { color: isDarkMode ? '#F9FAFB' : '#111827' }]}>
                    {selectedPatient.medications.length}
                  </Text>
                </View>
                
                <View style={styles.medicationsList}>
                  {selectedPatient.medications.map((med, index) => (
                    <Badge key={index} style={styles.medicationBadge}>
                      {med}
                    </Badge>
                  ))}
                </View>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Log Medication Button */}
        <Button
          mode="contained"
          icon={() => <Plus size={20} color="#FFFFFF" />}
          onPress={() => setShowLogModal(true)}
          disabled={!selectedPatient}
          style={[styles.logButton, { backgroundColor: '#8B5CF6' }]}
          labelStyle={styles.logButtonLabel}
        >
          Log Medication Intake
        </Button>

        {/* Adherence Analytics */}
        <Card style={[styles.card, { backgroundColor: isDarkMode ? '#374151' : '#FFFFFF' }]}>
          <Card.Content>
            <Title style={[styles.cardTitle, { color: isDarkMode ? '#F9FAFB' : '#111827' }]}>
              Adherence Analytics
            </Title>
            
            {/* Overall Adherence Score */}
            <View style={styles.adherenceContainer}>
              <View style={styles.adherenceHeader}>
                <Text style={[styles.adherenceLabel, { color: isDarkMode ? '#D1D5DB' : '#374151' }]}>
                  Overall Adherence:
                </Text>
                <Text style={[styles.adherenceValue, { color: '#8B5CF6' }]}>
                  {adherenceData.length > 0 ? 
                    (adherenceData.reduce((sum, d) => sum + d.adherence, 0) / adherenceData.length * 100).toFixed(0) + '%' 
                    : '0%'
                  }
                </Text>
              </View>
              <ProgressBar
                progress={adherenceData.length > 0 ? 
                  adherenceData.reduce((sum, d) => sum + d.adherence, 0) / adherenceData.length 
                  : 0
                }
                color="#8B5CF6"
                style={styles.progressBar}
              />
            </View>

            {/* Adherence Trend Chart */}
            <View style={styles.chartContainer}>
              <Text style={[styles.chartTitle, { color: isDarkMode ? '#F9FAFB' : '#111827' }]}>
                7-Day Adherence Trend
              </Text>
              <LineChart
                data={chartData}
                width={width - 80}
                height={220}
                chartConfig={{
                  backgroundColor: isDarkMode ? '#374151' : '#FFFFFF',
                  backgroundGradientFrom: isDarkMode ? '#374151' : '#FFFFFF',
                  backgroundGradientTo: isDarkMode ? '#374151' : '#FFFFFF',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
                  labelColor: (opacity = 1) => isDarkMode ? `rgba(209, 213, 219, ${opacity})` : `rgba(55, 65, 81, ${opacity})`,
                  style: {
                    borderRadius: 16
                  },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#8B5CF6"
                  }
                }}
                bezier
                style={styles.chart}
              />
            </View>

            {/* AI Insights */}
            <View style={styles.insightsContainer}>
              <Text style={[styles.insightsTitle, { color: isDarkMode ? '#F9FAFB' : '#111827' }]}>
                AI Insights
              </Text>
              
              <View style={[styles.insightCard, { backgroundColor: isDarkMode ? '#1F2937' : '#F0F9FF' }]}>
                <View style={styles.insightHeader}>
                  <CheckCircle size={20} color="#10B981" />
                  <Text style={[styles.insightTitle, { color: '#10B981' }]}>
                    Adherence Trend: Improving
                  </Text>
                </View>
                <Text style={[styles.insightText, { color: isDarkMode ? '#D1D5DB' : '#1E40AF' }]}>
                  Patient shows consistent medication intake over the past week
                </Text>
              </View>
              
              <View style={[styles.insightCard, { backgroundColor: isDarkMode ? '#1F2937' : '#FEF3C7' }]}>
                <View style={styles.insightHeader}>
                  <AlertTriangle size={20} color="#F59E0B" />
                  <Text style={[styles.insightTitle, { color: '#F59E0B' }]}>
                    Risk Factor Detected
                  </Text>
                </View>
                <Text style={[styles.insightText, { color: isDarkMode ? '#D1D5DB' : '#92400E' }]}>
                  Evening doses occasionally missed - consider reminder system
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Recent Medication Logs */}
        <Card style={[styles.card, { backgroundColor: isDarkMode ? '#374151' : '#FFFFFF' }]}>
          <Card.Content>
            <Title style={[styles.cardTitle, { color: isDarkMode ? '#F9FAFB' : '#111827' }]}>
              Recent Medication Logs
            </Title>
            
            <View style={styles.logsContainer}>
              {medicationLog.slice(0, 5).map(log => (
                <View key={log.id} style={[styles.logItem, { backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB' }]}>
                  <View style={styles.logHeader}>
                    <Text style={[styles.logMedication, { color: isDarkMode ? '#F9FAFB' : '#111827' }]}>
                      {log.medication}
                    </Text>
                    <Badge style={styles.logMethod}>{log.method}</Badge>
                  </View>
                  <Text style={[styles.logDetails, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                    {log.dosage} • {new Date(log.intakeTime).toLocaleString()}
                  </Text>
                </View>
              ))}
              {medicationLog.length === 0 && (
                <View style={styles.emptyState}>
                  <Text style={[styles.emptyStateText, { color: isDarkMode ? '#9CA3AF' : '#6B7280' }]}>
                    No medication logs yet
                  </Text>
                </View>
              )}
            </View>
          </Card.Content>
        </Card>
      </View>

      {/* Log Medication Modal */}
      {showLogModal && (
        <View style={styles.modalOverlay}>
          <Card style={[styles.modalCard, { backgroundColor: isDarkMode ? '#374151' : '#FFFFFF' }]}>
            <Card.Content>
              <Title style={[styles.modalTitle, { color: isDarkMode ? '#F9FAFB' : '#111827' }]}>
                Log Medication Intake
              </Title>
              
              <TextInput
                label="Medication"
                value={logForm.medication}
                onChangeText={(text) => setLogForm({...logForm, medication: text})}
                style={styles.input}
                mode="outlined"
              />
              
              <TextInput
                label="Dosage"
                value={logForm.dosage}
                onChangeText={(text) => setLogForm({...logForm, dosage: text})}
                style={styles.input}
                mode="outlined"
                placeholder="e.g., 500mg"
              />
              
              <Text style={[styles.methodLabel, { color: isDarkMode ? '#D1D5DB' : '#374151' }]}>
                Input Method:
              </Text>
              
              <SegmentedButtons
                value={logForm.method}
                onValueChange={(value) => setLogForm({...logForm, method: value})}
                buttons={[
                  { value: 'manual', label: 'Manual', icon: BarChart3 },
                  { value: 'barcode', label: 'Barcode', icon: BarChart3 },
                  { value: 'voice', label: 'Voice', icon: Mic }
                ]}
                style={styles.segmentedButtons}
              />
              
              <View style={styles.modalButtons}>
                <Button
                  mode="outlined"
                  onPress={() => setShowLogModal(false)}
                  style={styles.modalButton}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={logMedication}
                  loading={isLogging}
                  style={[styles.modalButton, { backgroundColor: '#8B5CF6' }]}
                >
                  Log Intake
                </Button>
              </View>
            </Card.Content>
          </Card>
        </View>
      )}
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
    textAlign: 'center',
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
  patientSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  patientOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPatient: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  patientName: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  patientAge: {
    fontSize: 12,
    marginLeft: 4,
  },
  patientInfo: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 16,
  },
  medicationsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  medicationBadge: {
    backgroundColor: '#3B82F6',
  },
  logButton: {
    width: '100%',
    marginBottom: 16,
    paddingVertical: 8,
  },
  logButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  adherenceContainer: {
    marginBottom: 20,
  },
  adherenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  adherenceLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  adherenceValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  chartContainer: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  insightsContainer: {
    gap: 12,
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  insightCard: {
    padding: 12,
    borderRadius: 8,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  insightText: {
    fontSize: 12,
    marginLeft: 28,
  },
  logsContainer: {
    gap: 8,
  },
  logItem: {
    padding: 12,
    borderRadius: 8,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  logMedication: {
    fontSize: 14,
    fontWeight: '600',
  },
  logMethod: {
    backgroundColor: '#10B981',
  },
  logDetails: {
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalCard: {
    width: width - 32,
    maxHeight: height * 0.8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
  },
  methodLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  segmentedButtons: {
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
});

export default PatientAdherenceScreen;
