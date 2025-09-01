import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
  Animated,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Text,
  Button,
  useTheme,
  Chip,
  Surface,
  IconButton,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme as useAppTheme } from '../context/ThemeContext';
import { inventoryAPI } from '../services/api';
import { ModernCard } from '../components/ModernCard';
import { SHADOWS, GRADIENTS } from '../utils/themes';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const [stats, setStats] = useState({
    totalItems: 1389,
    lowStockAlerts: 12,
    inventoryValue: 312450,
    monthlyUsage: 54320,
  });
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  
  const theme = useTheme();
  const { isDarkMode } = useAppTheme();

  useEffect(() => {
    loadDashboardData();
    startAnimations();
  }, []);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  };

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
      paddingTop: 60,
      paddingBottom: 30,
      paddingHorizontal: 20,
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
    },
    headerSubtitle: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: 16,
      fontWeight: '400',
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
      marginTop: -20,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    statCard: {
      width: (width - 48) / 2,
      marginBottom: 16,
      borderRadius: 20,
      overflow: 'hidden',
    },
    statCardContent: {
      padding: 20,
      alignItems: 'center',
    },
    statIcon: {
      marginBottom: 12,
    },
    statValue: {
      fontSize: 28,
      fontWeight: '700',
      color: 'white',
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 14,
      color: 'rgba(255, 255, 255, 0.9)',
      fontWeight: '500',
      textAlign: 'center',
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      marginTop: 8,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: theme.colors.onSurface,
    },
    seeAllButton: {
      paddingHorizontal: 0,
    },
    alertCard: {
      marginBottom: 12,
      borderRadius: 16,
      overflow: 'hidden',
    },
    alertContent: {
      padding: 16,
    },
    alertHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    alertIcon: {
      marginRight: 12,
    },
    alertBadge: {
      marginLeft: 'auto',
    },
    alertMessage: {
      fontSize: 15,
      fontWeight: '500',
      color: theme.colors.onSurface,
      marginBottom: 6,
    },
    alertTimestamp: {
      fontSize: 13,
      color: theme.colors.onSurfaceVariant,
    },
    quickActionsContainer: {
      marginBottom: 24,
    },
    quickActionsGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    actionCard: {
      flex: 1,
      marginHorizontal: 6,
      borderRadius: 16,
      overflow: 'hidden',
    },
    actionContent: {
      padding: 20,
      alignItems: 'center',
    },
    actionIcon: {
      marginBottom: 12,
    },
    actionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: 'white',
      textAlign: 'center',
    },
    systemStatusCard: {
      marginBottom: 20,
      borderRadius: 16,
    },
    statusItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    statusText: {
      marginLeft: 12,
      fontSize: 15,
      fontWeight: '500',
      color: theme.colors.onSurface,
    },
  });

  return (
    <View style={styles.container}>
      {/* Modern Header with Gradient */}
      <LinearGradient
        colors={GRADIENTS.primary}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.headerTitle}>MedCare Dashboard</Text>
          <Text style={styles.headerSubtitle}>Healthcare Inventory Management</Text>
        </Animated.View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        {/* Modern Statistics Grid */}
        <Animated.View 
          style={[
            styles.statsGrid,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.statCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.statCardContent}>
              <Ionicons name="cube-outline" size={32} color="white" style={styles.statIcon} />
              <Text style={styles.statValue}>{stats.totalItems.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Total Items</Text>
            </View>
          </LinearGradient>

          <LinearGradient
            colors={['#f093fb', '#f5576c']}
            style={styles.statCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.statCardContent}>
              <Ionicons name="warning-outline" size={32} color="white" style={styles.statIcon} />
              <Text style={styles.statValue}>{stats.lowStockAlerts}</Text>
              <Text style={styles.statLabel}>Low Stock Alerts</Text>
            </View>
          </LinearGradient>

          <LinearGradient
            colors={['#4facfe', '#00f2fe']}
            style={styles.statCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.statCardContent}>
              <Ionicons name="cash-outline" size={32} color="white" style={styles.statIcon} />
              <Text style={styles.statValue}>${(stats.inventoryValue / 1000).toFixed(0)}K</Text>
              <Text style={styles.statLabel}>Inventory Value</Text>
            </View>
          </LinearGradient>

          <LinearGradient
            colors={['#a8edea', '#fed6e3']}
            style={styles.statCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.statCardContent}>
              <Ionicons name="trending-up-outline" size={32} color="white" style={styles.statIcon} />
              <Text style={styles.statValue}>${(stats.monthlyUsage / 1000).toFixed(0)}K</Text>
              <Text style={styles.statLabel}>Monthly Usage</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>
          <View style={styles.quickActionsGrid}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.actionCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Surface 
                style={styles.actionContent}
                onTouchEnd={() => navigation.navigate('Clinical Trials')}
              >
                <Ionicons name="flask-outline" size={28} color="white" style={styles.actionIcon} />
                <Text style={styles.actionTitle}>Clinical Trials</Text>
              </Surface>
            </LinearGradient>

            <LinearGradient
              colors={['#4facfe', '#00f2fe']}
              style={styles.actionCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Surface 
                style={styles.actionContent}
                onTouchEnd={() => navigation.navigate('Cold Chain')}
              >
                <Ionicons name="thermometer-outline" size={28} color="white" style={styles.actionIcon} />
                <Text style={styles.actionTitle}>Cold Chain</Text>
              </Surface>
            </LinearGradient>

            <LinearGradient
              colors={['#f093fb', '#f5576c']}
              style={styles.actionCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Surface 
                style={styles.actionContent}
                onTouchEnd={() => navigation.navigate('AI Verification')}
              >
                <Ionicons name="camera-outline" size={28} color="white" style={styles.actionIcon} />
                <Text style={styles.actionTitle}>AI Verify</Text>
              </Surface>
            </LinearGradient>
          </View>
        </View>

        {/* Recent Alerts */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Alerts</Text>
          <Button mode="text" style={styles.seeAllButton}>See All</Button>
        </View>
        {recentAlerts.map((alert) => (
          <ModernCard key={alert.id} style={styles.alertCard} shadow="small">
            <View style={styles.alertContent}>
              <View style={styles.alertHeader}>
                <Ionicons
                  name={getSeverityIcon(alert.severity)}
                  size={24}
                  color={getSeverityColor(alert.severity)}
                  style={styles.alertIcon}
                />
                <Chip
                  mode="flat"
                  textStyle={{ 
                    color: getSeverityColor(alert.severity),
                    fontSize: 12,
                    fontWeight: '600'
                  }}
                  style={{ 
                    backgroundColor: `${getSeverityColor(alert.severity)}20`,
                    ...styles.alertBadge
                  }}
                >
                  {alert.severity.toUpperCase()}
                </Chip>
              </View>
              <Text style={styles.alertMessage}>{alert.message}</Text>
              <Text style={styles.alertTimestamp}>
                {new Date(alert.timestamp).toLocaleString()}
              </Text>
            </View>
          </ModernCard>
        ))}

        {/* System Status */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>System Status</Text>
        </View>
        <ModernCard style={styles.systemStatusCard}>
          <View style={styles.statusItem}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />
            <Text style={styles.statusText}>Backend API: Connected</Text>
          </View>
          <View style={styles.statusItem}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />
            <Text style={styles.statusText}>ML Model: Active</Text>
          </View>
          <View style={styles.statusItem}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />
            <Text style={styles.statusText}>Blockchain: Synced</Text>
          </View>
          <View style={styles.statusItem}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />
            <Text style={styles.statusText}>Notifications: Enabled</Text>
          </View>
        </ModernCard>
      </ScrollView>
    </View>
  );
};

export default DashboardScreen;
