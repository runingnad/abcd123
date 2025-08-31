import React, { useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  Switch,
  List,
  Divider,
  useTheme,
  Avatar,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useTheme as useAppTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  
  const theme = useTheme();
  const { isDarkMode, setIsDarkMode } = useAppTheme();
  const { setIsAuthenticated } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => setIsAuthenticated(false),
        },
      ]
    );
  };

  const openPrivacyPolicy = () => {
    Linking.openURL('https://medchain.com/privacy');
  };

  const openTermsOfService = () => {
    Linking.openURL('https://medchain.com/terms');
  };

  const openSupport = () => {
    Linking.openURL('mailto:support@medchain.com');
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
      alignItems: 'center',
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
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 15,
      color: theme.colors.onSurface,
    },
    settingCard: {
      marginBottom: 20,
    },
    settingItem: {
      paddingVertical: 8,
    },
    settingLabel: {
      fontSize: 16,
    },
    settingDescription: {
      fontSize: 12,
      opacity: 0.7,
      marginTop: 2,
    },
    profileCard: {
      marginBottom: 20,
      alignItems: 'center',
    },
    profileAvatar: {
      marginBottom: 15,
    },
    profileName: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    profileRole: {
      fontSize: 14,
      opacity: 0.7,
      marginBottom: 15,
    },
    logoutButton: {
      marginTop: 20,
    },
    infoCard: {
      marginBottom: 20,
    },
    infoItem: {
      paddingVertical: 12,
    },
    versionInfo: {
      textAlign: 'center',
      opacity: 0.6,
      marginTop: 20,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>App Configuration & Preferences</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Profile Section */}
        <Card style={styles.profileCard}>
          <Card.Content>
            <Avatar.Icon
              size={80}
              icon="account"
              style={[styles.profileAvatar, { backgroundColor: theme.colors.primary }]}
            />
            <Text style={styles.profileName}>Admin User</Text>
            <Text style={styles.profileRole}>System Administrator</Text>
            <Text style={{ fontSize: 12, opacity: 0.6 }}>
              MedChain Healthcare System
            </Text>
          </Card.Content>
        </Card>

        {/* Appearance Settings */}
        <Text style={styles.sectionTitle}>Appearance</Text>
        <Card style={styles.settingCard}>
          <Card.Content>
            <List.Item
              title="Dark Mode"
              description="Switch between light and dark themes"
              left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
              right={() => (
                <Switch
                  value={isDarkMode}
                  onValueChange={setIsDarkMode}
                  color={theme.colors.primary}
                />
              )}
              style={styles.settingItem}
            />
          </Card.Content>
        </Card>

        {/* Notification Settings */}
        <Text style={styles.sectionTitle}>Notifications</Text>
        <Card style={styles.settingCard}>
          <Card.Content>
            <List.Item
              title="Push Notifications"
              description="Receive alerts for critical events"
              left={(props) => <List.Icon {...props} icon="bell" />}
              right={() => (
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  color={theme.colors.primary}
                />
              )}
              style={styles.settingItem}
            />
            <Divider />
            <List.Item
              title="Low Stock Alerts"
              description="Get notified when inventory is low"
              left={(props) => <List.Icon {...props} icon="package-variant" />}
              style={styles.settingItem}
            />
            <Divider />
            <List.Item
              title="Expiry Warnings"
              description="Receive expiry date notifications"
              left={(props) => <List.Icon {...props} icon="calendar-clock" />}
              style={styles.settingItem}
            />
            <Divider />
            <List.Item
              title="Cold Chain Alerts"
              description="Temperature and humidity warnings"
              left={(props) => <List.Icon {...props} icon="thermometer" />}
              style={styles.settingItem}
            />
          </Card.Content>
        </Card>

        {/* Security Settings */}
        <Text style={styles.sectionTitle}>Security</Text>
        <Card style={styles.settingCard}>
          <Card.Content>
            <List.Item
              title="Biometric Authentication"
              description="Use fingerprint or face ID to login"
              left={(props) => <List.Icon {...props} icon="fingerprint" />}
              right={() => (
                <Switch
                  value={biometricEnabled}
                  onValueChange={setBiometricEnabled}
                  color={theme.colors.primary}
                />
              )}
              style={styles.settingItem}
            />
            <Divider />
            <List.Item
              title="Auto-Lock"
              description="Lock app after 5 minutes of inactivity"
              left={(props) => <List.Icon {...props} icon="lock-clock" />}
              style={styles.settingItem}
            />
          </Card.Content>
        </Card>

        {/* Data Settings */}
        <Text style={styles.sectionTitle}>Data & Sync</Text>
        <Card style={styles.settingCard}>
          <Card.Content>
            <List.Item
              title="Auto-Sync"
              description="Automatically sync data with server"
              left={(props) => <List.Icon {...props} icon="sync" />}
              right={() => (
                <Switch
                  value={autoSync}
                  onValueChange={setAutoSync}
                  color={theme.colors.primary}
                />
              )}
              style={styles.settingItem}
            />
            <Divider />
            <List.Item
              title="Data Backup"
              description="Backup data to cloud storage"
              left={(props) => <List.Icon {...props} icon="cloud-upload" />}
              style={styles.settingItem}
            />
            <Divider />
            <List.Item
              title="Clear Cache"
              description="Free up storage space"
              left={(props) => <List.Icon {...props} icon="delete-sweep" />}
              style={styles.settingItem}
            />
          </Card.Content>
        </Card>

        {/* Support & Legal */}
        <Text style={styles.sectionTitle}>Support & Legal</Text>
        <Card style={styles.settingCard}>
          <Card.Content>
            <List.Item
              title="Help & Support"
              description="Contact our support team"
              left={(props) => <List.Icon {...props} icon="help-circle" />}
              onPress={openSupport}
              style={styles.infoItem}
            />
            <Divider />
            <List.Item
              title="Privacy Policy"
              description="Read our privacy policy"
              left={(props) => <List.Icon {...props} icon="shield-account" />}
              onPress={openPrivacyPolicy}
              style={styles.infoItem}
            />
            <Divider />
            <List.Item
              title="Terms of Service"
              description="Read our terms of service"
              left={(props) => <List.Icon {...props} icon="file-document" />}
              onPress={openTermsOfService}
              style={styles.infoItem}
            />
            <Divider />
            <List.Item
              title="About MedChain"
              description="App version and information"
              left={(props) => <List.Icon {...props} icon="information" />}
              style={styles.infoItem}
            />
          </Card.Content>
        </Card>

        {/* Logout Button */}
        <Button
          mode="outlined"
          icon="logout"
          onPress={handleLogout}
          style={styles.logoutButton}
          textColor={theme.colors.error}
        >
          Logout
        </Button>

        {/* Version Info */}
        <Text style={styles.versionInfo}>
          MedChain Mobile v1.0.0
        </Text>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;
