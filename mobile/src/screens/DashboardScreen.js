import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Text,
  Button,
  useTheme,
  Chip,
  Divider,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useTheme as useAppTheme } from '../context/ThemeContext';
import { inventoryAPI } from '../services/api';

const DashboardScreen = ({ navigation }) => {
  const [stats, setStats] = useState({
    totalItems: 1389,
    lowStockAlerts: 12,
    inventoryValue: 312450,
    monthlyUsage: 54320,
  });
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const theme = useTheme();
  const { isDarkMode } = useAppTheme();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // In a real app, you'd fetch this from the API
      setRecentAlerts([
        {
          id: 1,
          type: 'low_stock',
          message: 'COVID-19 Vaccine (Moderna) - Low stock alert',
          severity: 'warning',
          timestamp: new Date().toISOString(),
        },
        {
          id: 2,
          type: 'expiry',
          message: 'Amoxicillin batch expires in 30 days',
          severity: 'critical',
          timestamp: new Date().toISOString(),
        },
        {
          id: 3,
          type: 'cold_chain',
          message: 'Temperature anomaly detected in BATCH001',
          severity: 'critical',
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setIsRefreshing(false);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return theme.colors.error;
      case 'warning':
        return theme.colors.warning || '#FF9800';
      default:
        return theme.colors.primary;
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return 'alert-circle';
      case 'warning':
        return 'warning';
      default:
        return 'information-circle';
    }
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
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    statCard: {
      width: '48%',
      marginBottom: 15,
    },
    statValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    statLabel: {
      fontSize: 12,
      color: theme.colors.onSurface,
      opacity: 0.7,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 15,
      color: theme.colors.onSurface,
    },
    alertCard: {
      marginBottom: 15,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
    },
    alertHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    alertIcon: {
      marginRight: 8,
    },
    alertMessage: {
      fontSize: 14,
      marginBottom: 5,
    },
    alertTimestamp: {
      fontSize: 12,
      color: theme.colors.onSurface,
      opacity: 0.6,
    },
    quickActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    actionButton: {
      flex: 1,
      marginHorizontal: 5,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MedChain Dashboard</Text>
        <Text style={styles.headerSubtitle}>Healthcare Inventory Management</Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        {/* Statistics Grid */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Card.Content>
              <Text style={styles.statValue}>{stats.totalItems.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Total Items</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content>
              <Text style={styles.statValue}>{stats.lowStockAlerts}</Text>
              <Text style={styles.statLabel}>Low Stock Alerts</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content>
              <Text style={styles.statValue}>${(stats.inventoryValue / 1000).toFixed(0)}K</Text>
              <Text style={styles.statLabel}>Inventory Value</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content>
              <Text style={styles.statValue}>${(stats.monthlyUsage / 1000).toFixed(0)}K</Text>
              <Text style={styles.statLabel}>Monthly Usage</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <Button
            mode="contained"
            icon="flask"
            style={styles.actionButton}
            onPress={() => navigation.navigate('Clinical Trials')}
          >
            Clinical Trials
          </Button>
          <Button
            mode="contained"
            icon="thermometer"
            style={styles.actionButton}
            onPress={() => navigation.navigate('Cold Chain')}
          >
            Cold Chain
          </Button>
        </View>

        {/* Recent Alerts */}
        <Text style={styles.sectionTitle}>Recent Alerts</Text>
        {recentAlerts.map((alert) => (
          <Card key={alert.id} style={styles.alertCard}>
            <Card.Content>
              <View style={styles.alertHeader}>
                <Ionicons
                  name={getSeverityIcon(alert.severity)}
                  size={20}
                  color={getSeverityColor(alert.severity)}
                  style={styles.alertIcon}
                />
                <Chip
                  mode="outlined"
                  textStyle={{ color: getSeverityColor(alert.severity) }}
                  style={{ borderColor: getSeverityColor(alert.severity) }}
                >
                  {alert.severity.toUpperCase()}
                </Chip>
              </View>
              <Text style={styles.alertMessage}>{alert.message}</Text>
              <Text style={styles.alertTimestamp}>
                {new Date(alert.timestamp).toLocaleString()}
              </Text>
            </Card.Content>
          </Card>
        ))}

        {/* System Status */}
        <Text style={styles.sectionTitle}>System Status</Text>
        <Card>
          <Card.Content>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <Ionicons name="checkmark-circle" size={20} color="green" />
              <Text style={{ marginLeft: 10, fontSize: 16 }}>Backend API: Connected</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <Ionicons name="checkmark-circle" size={20} color="green" />
              <Text style={{ marginLeft: 10, fontSize: 16 }}>ML Model: Active</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <Ionicons name="checkmark-circle" size={20} color="green" />
              <Text style={{ marginLeft: 10, fontSize: 16 }}>Blockchain: Synced</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="checkmark-circle" size={20} color="green" />
              <Text style={{ marginLeft: 10, fontSize: 16 }}>Notifications: Enabled</Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

export default DashboardScreen;
