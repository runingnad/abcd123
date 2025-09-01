import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const LoadingScreen = ({ message = 'Loading...' }) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      padding: 20,
    },
    logo: {
      fontSize: 48,
      color: theme.colors.primary,
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: 10,
    },
    message: {
      fontSize: 16,
      color: theme.colors.onSurface,
      marginBottom: 30,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <Ionicons name="medical" style={styles.logo} />
      <Text style={styles.title}>MedCare</Text>
      <Text style={styles.message}>{message}</Text>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
};

export default LoadingScreen;
