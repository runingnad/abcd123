import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, DefaultTheme, MD3DarkTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import * as Device from 'expo-device';

// Import screens
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ClinicalTrialsScreen from './src/screens/ClinicalTrialsScreen';
import ColdChainScreen from './src/screens/ColdChainScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AIDrugVerificationScreen from './src/screens/AIDrugVerificationScreen';
import PatientAdherenceScreen from './src/screens/PatientAdherenceScreen';

// Import contexts
import { AuthContext } from './src/context/AuthContext';
import { ThemeContext } from './src/context/ThemeContext';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  const { isDarkMode } = React.useContext(ThemeContext);
  
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
          } else if (route.name === 'Patient Care') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: isDarkMode ? '#8B5CF6' : '#3B82F6',
        tabBarInactiveTintColor: isDarkMode ? '#6B7280' : '#9CA3AF',
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
          borderTopColor: isDarkMode ? '#374151' : '#E5E7EB',
        },
        headerStyle: {
          backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
        },
        headerTintColor: isDarkMode ? '#F9FAFB' : '#111827',
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Clinical Trials" component={ClinicalTrialsScreen} />
      <Tab.Screen name="Cold Chain" component={ColdChainScreen} />
      <Tab.Screen name="AI Verification" component={AIDrugVerificationScreen} />
      <Tab.Screen name="Patient Care" component={PatientAdherenceScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
  }, []);

  const theme = isDarkMode ? MD3DarkTheme : DefaultTheme;

  return (
  <PaperProvider
    theme={theme}
    settings={{
      icon: (props) => <MaterialCommunityIcons {...props} />,
    }}
  >
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
        <NavigationContainer theme={theme}>
          <StatusBar style={isDarkMode ? 'light' : 'dark'} />
          {isAuthenticated ? <TabNavigator /> : <LoginScreen />}
        </NavigationContainer>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  </PaperProvider>
);
}

async function registerForPushNotificationsAsync() {
  let token;
  
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}
