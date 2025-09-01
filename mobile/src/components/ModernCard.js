import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { SHADOWS } from '../utils/themes';

export const ModernCard = ({ 
  children, 
  style, 
  gradient = false, 
  gradientColors, 
  shadow = 'medium',
  ...props 
}) => {
  const theme = useTheme();

  const cardStyle = [
    styles.card,
    SHADOWS[shadow],
    { backgroundColor: theme.colors.surface },
    style
  ];

  if (gradient && gradientColors) {
    return (
      <LinearGradient
        colors={gradientColors}
        style={[cardStyle, { backgroundColor: 'transparent' }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Card.Content {...props}>
          {children}
        </Card.Content>
      </LinearGradient>
    );
  }

  return (
    <Card style={cardStyle} {...props}>
      <Card.Content>
        {children}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginVertical: 8,
  },
});
