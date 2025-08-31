import React, { useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Card,
  Title,
  Paragraph,
  useTheme,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { setIsAuthenticated } = useContext(AuthContext);
  const theme = useTheme();

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate API call delay
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        setIsAuthenticated(true);
      } else {
        setError('Invalid credentials. Use admin/admin123');
      }
      setIsLoading(false);
    }, 1000);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 40,
    },
    logo: {
      fontSize: 48,
      color: theme.colors.primary,
      marginBottom: 10,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.primary,
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.onSurface,
      textAlign: 'center',
      marginBottom: 30,
    },
    card: {
      padding: 20,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    inputContainer: {
      marginBottom: 20,
    },
    input: {
      backgroundColor: theme.colors.surface,
    },
    passwordContainer: {
      position: 'relative',
    },
    passwordIcon: {
      position: 'absolute',
      right: 12,
      top: 12,
      zIndex: 1,
    },
    loginButton: {
      marginTop: 10,
      paddingVertical: 8,
    },
    errorText: {
      color: theme.colors.error,
      textAlign: 'center',
      marginTop: 10,
    },
    demoCredentials: {
      marginTop: 20,
      padding: 15,
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: 8,
    },
    demoTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    demoText: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.logoContainer}>
          <Ionicons name="medical" style={styles.logo} />
          <Title style={styles.title}>MedChain</Title>
          <Paragraph style={styles.subtitle}>
            Healthcare Inventory Management System
          </Paragraph>
        </View>

        <Card style={styles.card}>
          <Title style={{ textAlign: 'center', marginBottom: 20 }}>
            Sign In
          </Title>

          <View style={styles.inputContainer}>
            <TextInput
              label="Username"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              left={<TextInput.Icon icon="account" />}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.passwordContainer}>
              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={styles.input}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />
            </View>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
            style={styles.loginButton}
            contentStyle={{ paddingVertical: 8 }}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>

          <View style={styles.demoCredentials}>
            <Text style={styles.demoTitle}>Demo Credentials:</Text>
            <Text style={styles.demoText}>Username: admin</Text>
            <Text style={styles.demoText}>Password: admin123</Text>
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
