import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  TextInput,
  DataTable,
  Chip,
  FAB,
  Modal,
  Portal,
  useTheme,
  Divider,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { clinicalTrialsAPI } from '../services/api';

const ClinicalTrialsScreen = () => {
  const [trials, setTrials] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isApprovalModalVisible, setIsApprovalModalVisible] = useState(false);
  const [selectedTrial, setSelectedTrial] = useState(null);
  const [formData, setFormData] = useState({
    batchID: '',
    drugName: '',
    expiry: '',
    sender: '',
    receiver: '',
  });
  const [approvalData, setApprovalData] = useState({
    approverID: '',
    approvalNotes: '',
  });
  
  const theme = useTheme();

  useEffect(() => {
    loadTrials();
  }, []);

  const loadTrials = async () => {
    try {
      // Mock data - replace with actual API call
      const mockTrials = [
        {
          batchID: 'BATCH001',
          drugName: 'COVID-19 Vaccine (Moderna)',
          expiry: '2024-12-31',
          sender: 'Moderna Pharmaceuticals',
          receiver: 'City General Hospital',
          status: 'approved',
          timestamp: '2024-01-15T10:30:00Z',
          approved_by: 'Regulator_001',
          approval_timestamp: '2024-01-15T11:45:00Z',
        },
        {
          batchID: 'BATCH002',
          drugName: 'Cancer Treatment Drug (Keytruda)',
          expiry: '2025-06-30',
          sender: 'Merck & Co.',
          receiver: 'Oncology Center',
          status: 'approved',
          timestamp: '2024-01-14T14:20:00Z',
          approved_by: 'Regulator_002',
          approval_timestamp: '2024-01-14T16:10:00Z',
        },
        {
          batchID: 'BATCH003',
          drugName: 'Diabetes Medication (Ozempic)',
          expiry: '2024-11-15',
          sender: 'Novo Nordisk',
          receiver: 'Regional Medical Center',
          status: 'pending',
          timestamp: '2024-01-16T09:15:00Z',
        },
      ];
      setTrials(mockTrials);
    } catch (error) {
      console.error('Error loading trials:', error);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadTrials();
    setIsRefreshing(false);
  };

  const handleSubmit = async () => {
    if (!formData.batchID || !formData.drugName || !formData.expiry || !formData.sender || !formData.receiver) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const newTrial = {
        ...formData,
        status: 'pending',
        timestamp: new Date().toISOString(),
      };
      
      // Add to local state (in real app, this would be an API call)
      setTrials([newTrial, ...trials]);
      setFormData({
        batchID: '',
        drugName: '',
        expiry: '',
        sender: '',
        receiver: '',
      });
      setIsModalVisible(false);
      Alert.alert('Success', 'New batch logged successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to log new batch');
    }
  };

  const handleApprove = async () => {
    if (!approvalData.approverID) {
      Alert.alert('Error', 'Please enter approver ID');
      return;
    }

    try {
      const updatedTrials = trials.map(trial => {
        if (trial.batchID === selectedTrial.batchID) {
          return {
            ...trial,
            status: 'approved',
            approved_by: approvalData.approverID,
            approval_timestamp: new Date().toISOString(),
          };
        }
        return trial;
      });
      
      setTrials(updatedTrials);
      setApprovalData({ approverID: '', approvalNotes: '' });
      setIsApprovalModalVisible(false);
      setSelectedTrial(null);
      Alert.alert('Success', 'Batch approved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to approve batch');
    }
  };

  const getStatusColor = (status) => {
    return status === 'approved' ? 'green' : 'orange';
  };

  const getStatusIcon = (status) => {
    return status === 'approved' ? 'checkmark-circle' : 'time';
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: 20,
      paddingTop: 40,
      backgroundColor: theme.colors.primary,
    },
    headerTitle: {
      color: 'white',
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    headerSubtitle: {
      color: 'white',
      fontSize: 16,
      opacity: 0.9,
    },
    content: {
      padding: 20,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 15,
      color: theme.colors.onSurface,
    },
    trialCard: {
      marginBottom: 15,
    },
    trialHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    trialInfo: {
      marginBottom: 8,
    },
    trialLabel: {
      fontSize: 12,
      color: theme.colors.onSurface,
      opacity: 0.6,
    },
    trialValue: {
      fontSize: 14,
      fontWeight: '500',
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.primary,
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      margin: 20,
      borderRadius: 8,
    },
    inputField: {
      marginBottom: 15,
    },
    modalActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    approvalButton: {
      marginTop: 10,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Clinical Trials</Text>
        <Text style={styles.headerSubtitle}>Drug Batch Management & Approval</Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.sectionTitle}>Blockchain-Verified Batch Approvals</Text>
        
        {trials.map((trial) => (
          <Card key={trial.batchID} style={styles.trialCard}>
            <Card.Content>
              <View style={styles.trialHeader}>
                <Title style={{ fontSize: 18 }}>{trial.batchID}</Title>
                <View style={styles.statusContainer}>
                  <Ionicons
                    name={getStatusIcon(trial.status)}
                    size={20}
                    color={getStatusColor(trial.status)}
                    style={{ marginRight: 5 }}
                  />
                  <Chip
                    mode="outlined"
                    textStyle={{ color: getStatusColor(trial.status) }}
                    style={{ borderColor: getStatusColor(trial.status) }}
                  >
                    {trial.status.toUpperCase()}
                  </Chip>
                </View>
              </View>

              <View style={styles.trialInfo}>
                <Text style={styles.trialLabel}>Drug Name</Text>
                <Text style={styles.trialValue}>{trial.drugName}</Text>
              </View>

              <View style={styles.trialInfo}>
                <Text style={styles.trialLabel}>Expiry Date</Text>
                <Text style={styles.trialValue}>{trial.expiry}</Text>
              </View>

              <View style={styles.trialInfo}>
                <Text style={styles.trialLabel}>Sender</Text>
                <Text style={styles.trialValue}>{trial.sender}</Text>
              </View>

              <View style={styles.trialInfo}>
                <Text style={styles.trialLabel}>Receiver</Text>
                <Text style={styles.trialValue}>{trial.receiver}</Text>
              </View>

              <View style={styles.trialInfo}>
                <Text style={styles.trialLabel}>Timestamp</Text>
                <Text style={styles.trialValue}>
                  {new Date(trial.timestamp).toLocaleString()}
                </Text>
              </View>

              {trial.status === 'approved' && (
                <>
                  <Divider style={{ marginVertical: 10 }} />
                  <View style={styles.trialInfo}>
                    <Text style={styles.trialLabel}>Approved By</Text>
                    <Text style={styles.trialValue}>{trial.approved_by}</Text>
                  </View>
                  <View style={styles.trialInfo}>
                    <Text style={styles.trialLabel}>Approval Time</Text>
                    <Text style={styles.trialValue}>
                      {new Date(trial.approval_timestamp).toLocaleString()}
                    </Text>
                  </View>
                </>
              )}

              {trial.status === 'pending' && (
                <Button
                  mode="contained"
                  icon="check"
                  style={styles.approvalButton}
                  onPress={() => {
                    setSelectedTrial(trial);
                    setIsApprovalModalVisible(true);
                  }}
                >
                  Approve Batch
                </Button>
              )}
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      {/* Add New Batch FAB */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setIsModalVisible(true)}
      />

      {/* Add New Batch Modal */}
      <Portal>
        <Modal
          visible={isModalVisible}
          onDismiss={() => setIsModalVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Title style={{ marginBottom: 20 }}>Log New Drug Batch</Title>
          
          <TextInput
            label="Batch ID"
            value={formData.batchID}
            onChangeText={(text) => setFormData({ ...formData, batchID: text })}
            style={styles.inputField}
          />
          
          <TextInput
            label="Drug Name"
            value={formData.drugName}
            onChangeText={(text) => setFormData({ ...formData, drugName: text })}
            style={styles.inputField}
          />
          
          <TextInput
            label="Expiry Date (YYYY-MM-DD)"
            value={formData.expiry}
            onChangeText={(text) => setFormData({ ...formData, expiry: text })}
            style={styles.inputField}
            placeholder="2024-12-31"
          />
          
          <TextInput
            label="Sender"
            value={formData.sender}
            onChangeText={(text) => setFormData({ ...formData, sender: text })}
            style={styles.inputField}
          />
          
          <TextInput
            label="Receiver"
            value={formData.receiver}
            onChangeText={(text) => setFormData({ ...formData, receiver: text })}
            style={styles.inputField}
          />

          <View style={styles.modalActions}>
            <Button onPress={() => setIsModalVisible(false)}>Cancel</Button>
            <Button mode="contained" onPress={handleSubmit}>Submit</Button>
          </View>
        </Modal>
      </Portal>

      {/* Approval Modal */}
      <Portal>
        <Modal
          visible={isApprovalModalVisible}
          onDismiss={() => setIsApprovalModalVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Title style={{ marginBottom: 20 }}>Approve Batch</Title>
          
          <Text style={{ marginBottom: 15 }}>
            Approving: {selectedTrial?.batchID} - {selectedTrial?.drugName}
          </Text>
          
          <TextInput
            label="Approver ID"
            value={approvalData.approverID}
            onChangeText={(text) => setApprovalData({ ...approvalData, approverID: text })}
            style={styles.inputField}
            placeholder="Regulator_001"
          />
          
          <TextInput
            label="Approval Notes (Optional)"
            value={approvalData.approvalNotes}
            onChangeText={(text) => setApprovalData({ ...approvalData, approvalNotes: text })}
            style={styles.inputField}
            multiline
            numberOfLines={3}
          />

          <View style={styles.modalActions}>
            <Button onPress={() => setIsApprovalModalVisible(false)}>Cancel</Button>
            <Button mode="contained" onPress={handleApprove}>Approve</Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

export default ClinicalTrialsScreen;
