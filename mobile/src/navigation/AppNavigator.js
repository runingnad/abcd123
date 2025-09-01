import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { CustomDrawerContent } from '../components/CustomDrawerContent';

// Import screens
import DashboardScreen from '../screens/DashboardScreen';
import ClinicalTrialsScreen from '../screens/ClinicalTrialsScreen';
import ColdChainScreen from '../screens/ColdChainScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AIDrugVerificationScreen from '../screens/AIDrugVerificationScreen';
import PatientAdherenceScreen from '../screens/PatientAdherenceScreen';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main Tab Navigator for core features
function MainTabNavigator() {
  const { isDarkMode } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Clinical Trials') {
            iconName = focused ? 'flask' : 'flask-outline';
          } else if (route.name === 'Cold Chain') {
            iconName = focused ? 'thermometer' : 'thermometer-outline';
          } else if (route.name === 'AI Verification') {
            iconName = focused ? 'camera' : 'camera-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: isDarkMode ? '#8B5CF6' : '#3B82F6',
        tabBarInactiveTintColor: isDarkMode ? '#6B7280' : '#9CA3AF',
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
          borderTopColor: isDarkMode ? '#374151' : '#E5E7EB',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="Clinical Trials" 
        component={ClinicalTrialsScreen}
        options={{ title: 'Trials' }}
      />
      <Tab.Screen 
        name="Cold Chain" 
        component={ColdChainScreen}
        options={{ title: 'Cold Chain' }}
      />
      <Tab.Screen 
        name="AI Verification" 
        component={AIDrugVerificationScreen}
        options={{ title: 'AI Verify' }}
      />
    </Tab.Navigator>
  );
}

// Drawer Navigator for additional features
function AppNavigator() {
  const { isDarkMode } = useTheme();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
          width: 280,
        },
        drawerActiveTintColor: isDarkMode ? '#8B5CF6' : '#3B82F6',
        drawerInactiveTintColor: isDarkMode ? '#9CA3AF' : '#6B7280',
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: isDarkMode ? '#F9FAFB' : '#111827',
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: 'bold',
        },
      }}
    >
      <Drawer.Screen 
        name="MainTabs" 
        component={MainTabNavigator}
        options={{
          title: 'MedCare',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Patient Care" 
        component={PatientAdherenceScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default AppNavigator;
