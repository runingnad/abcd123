import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
  Dimensions,
  Animated,
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
  Chip,
  Surface,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme as useAppTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { ModernCard } from '../components/ModernCard';
import { GRADIENTS, COLOR_SCHEMES } from '../utils/themes';

const { width } = Dimensions.get('window');

const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));
  
  const theme = useTheme();
  const { isDarkMode, toggleTheme, colorScheme, setColorScheme } = useAppTheme();
  const { logout } = useAuth();

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

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
          onPress: () => logout(),
        },
      ]
    );
  };

  const openPrivacyPolicy = () => {
    Linking.openURL('https://medcare.com/privacy');
  };

  const openTermsOfService = () => {
    Linking.openURL('https://medcare.com/terms');
  };

  const openSupport = () => {
    Linking.openURL('mailto:support@medcare.com');
  };

  const handleColorSchemeChange = (scheme) => {
    setColorScheme(scheme);
    Alert.alert(
      'Color Scheme Changed',
      `Switched to ${COLOR_SCHEMES[scheme].name} theme`,
      [{ text: 'OK' }]
    );
  };

  const renderColorSchemeSelector = () => {
    return (
      <View style={styles.colorSchemeContainer}>
        <Text style={[styles.colorSchemeTitle, { color: theme.colors.onSurface }]}>
          Choose Color Scheme
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorSchemeScroll}>
          {Object.entries(COLOR_SCHEMES).map(([key, scheme]) => (
            <Surface
              key={key}
              style={[
                styles.colorSchemeOption,
                colorScheme === key && styles.selectedColorScheme
              ]}
              onTouchEnd={() => handleColorSchemeChange(key)}
            >
              <LinearGradient
                colors={scheme.colors.primary}
                style={styles.colorPreview}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <Text style={[styles.colorSchemeName, { color: theme.colors.onSurface }]}>
                {scheme.name}
              </Text>
              {colorScheme === key && (
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={theme.colors.primary}
                  style={styles.selectedIcon}
                />
              )}
            </Surface>
          ))}
        </ScrollView>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
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
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      marginBottom: 16,
      marginTop: 8,
      color: theme.colors.onSurface,
    },
    settingCard: {
      marginBottom: 16,
      borderRadius: 16,
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
      borderRadius: 20,
      overflow: 'hidden',
    },
    profileGradient: {
      padding: 24,
      alignItems: 'center',
    },
    profileAvatar: {
      marginBottom: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    profileName: {
      fontSize: 22,
      fontWeight: '700',
      marginBottom: 6,
      color: 'white',
    },
    profileRole: {
      fontSize: 16,
      marginBottom: 16,
      color: 'rgba(255, 255, 255, 0.9)',
    },
    profileCompany: {
      fontSize: 14,
      color: 'rgba(255, 255, 255, 0.8)',
    },
    logoutButton: {
      marginTop: 24,
      marginBottom: 16,
      borderRadius: 12,
      borderColor: theme.colors.error,
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
      marginBottom: 40,
    },
    colorSchemeContainer: {
      marginBottom: 16,
    },
    colorSchemeTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 12,
      paddingHorizontal: 4,
    },
    colorSchemeScroll: {
      paddingVertical: 8,
    },
    colorSchemeOption: {
      alignItems: 'center',
      marginRight: 16,
      padding: 12,
      borderRadius: 12,
      minWidth: 80,
      elevation: 2,
    },
    selectedColorScheme: {
      elevation: 6,
      transform: [{ scale: 1.05 }],
    },
    colorPreview: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginBottom: 8,
    },
    colorSchemeName: {
      fontSize: 12,
      fontWeight: '600',
      textAlign: 'center',
    },
    selectedIcon: {
      position: 'absolute',
      top: 8,
      right: 8,
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
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>App Configuration & Preferences</Text>
        </Animated.View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileCard}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.profileGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Avatar.Icon
              size={80}
              icon="account"
              style={styles.profileAvatar}
            />
            <Text style={styles.profileName}>Admin User</Text>
            <Text style={styles.profileRole}>System Administrator</Text>
            <Text style={styles.profileCompany}>
              MedCare Healthcare System
            </Text>
          </LinearGradient>
        </View>

        {/* Appearance Settings */}
        <Text style={styles.sectionTitle}>Appearance</Text>
        <ModernCard style={styles.settingCard} shadow="small">
          <List.Item
            title="Dark Mode"
            description="Switch between light and dark themes"
            left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                color={theme.colors.primary}
              />
            )}
            style={styles.settingItem}
          />
          <Divider />
          {renderColorSchemeSelector()}
        </ModernCard>

        {/* Notification Settings */}
        <Text style={styles.sectionTitle}>Notifications</Text>
        <ModernCard style={styles.settingCard} shadow="small">
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
        </ModernCard>

        {/* Security Settings */}
        <Text style={styles.sectionTitle}>Security</Text>
        <ModernCard style={styles.settingCard} shadow="small">
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
        </ModernCard>

        {/* Data Settings */}
        <Text style={styles.sectionTitle}>Data & Sync</Text>
        <ModernCard style={styles.settingCard} shadow="small">
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
        </ModernCard>

        {/* Support & Legal */}
        <Text style={styles.sectionTitle}>Support & Legal</Text>
        <ModernCard style={styles.settingCard} shadow="small">
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
            title="About MedCare"
            description="App version and information"
            left={(props) => <List.Icon {...props} icon="information" />}
            style={styles.infoItem}
          />
        </ModernCard>

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
          MedCare Mobile v1.0.0
        </Text>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;
