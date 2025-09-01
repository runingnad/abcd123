import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

// Modern Color Schemes
export const COLOR_SCHEMES = {
  default: {
    name: 'Ocean Blue',
    light: {
      primary: '#0066CC',
      primaryContainer: '#E3F2FD',
      secondary: '#03DAC6',
      secondaryContainer: '#E0F7FA',
      tertiary: '#FF6B35',
      surface: '#FFFFFF',
      surfaceVariant: '#F5F7FA',
      background: '#FAFBFC',
      error: '#FF5252',
      success: '#4CAF50',
      warning: '#FF9800',
      info: '#2196F3',
    },
    dark: {
      primary: '#4FC3F7',
      primaryContainer: '#0D47A1',
      secondary: '#26C6DA',
      secondaryContainer: '#00695C',
      tertiary: '#FFB74D',
      surface: '#1E1E1E',
      surfaceVariant: '#2D2D2D',
      background: '#121212',
      error: '#FF6B6B',
      success: '#66BB6A',
      warning: '#FFB74D',
      info: '#64B5F6',
    }
  },
  purple: {
    name: 'Purple Gradient',
    light: {
      primary: '#7C3AED',
      primaryContainer: '#F3E8FF',
      secondary: '#EC4899',
      secondaryContainer: '#FCE7F3',
      tertiary: '#F59E0B',
      surface: '#FFFFFF',
      surfaceVariant: '#F8FAFC',
      background: '#FEFEFE',
      error: '#EF4444',
      success: '#10B981',
      warning: '#F59E0B',
      info: '#3B82F6',
    },
    dark: {
      primary: '#A78BFA',
      primaryContainer: '#5B21B6',
      secondary: '#F472B6',
      secondaryContainer: '#BE185D',
      tertiary: '#FBBF24',
      surface: '#1F1B24',
      surfaceVariant: '#2D2438',
      background: '#0F0D15',
      error: '#F87171',
      success: '#34D399',
      warning: '#FBBF24',
      info: '#60A5FA',
    }
  },
  green: {
    name: 'Nature Green',
    light: {
      primary: '#059669',
      primaryContainer: '#ECFDF5',
      secondary: '#0891B2',
      secondaryContainer: '#E0F7FF',
      tertiary: '#DC2626',
      surface: '#FFFFFF',
      surfaceVariant: '#F0FDF4',
      background: '#FAFFFE',
      error: '#DC2626',
      success: '#16A34A',
      warning: '#EA580C',
      info: '#0284C7',
    },
    dark: {
      primary: '#34D399',
      primaryContainer: '#064E3B',
      secondary: '#22D3EE',
      secondaryContainer: '#164E63',
      tertiary: '#F87171',
      surface: '#0F1B0F',
      surfaceVariant: '#1A2E1A',
      background: '#0A0F0A',
      error: '#F87171',
      success: '#4ADE80',
      warning: '#FB923C',
      info: '#38BDF8',
    }
  },
  sunset: {
    name: 'Sunset Orange',
    light: {
      primary: '#EA580C',
      primaryContainer: '#FFF7ED',
      secondary: '#DC2626',
      secondaryContainer: '#FEF2F2',
      tertiary: '#7C2D12',
      surface: '#FFFFFF',
      surfaceVariant: '#FEF7F0',
      background: '#FFFBFA',
      error: '#DC2626',
      success: '#16A34A',
      warning: '#D97706',
      info: '#2563EB',
    },
    dark: {
      primary: '#FB923C',
      primaryContainer: '#9A3412',
      secondary: '#F87171',
      secondaryContainer: '#991B1B',
      tertiary: '#A16207',
      surface: '#1C1917',
      surfaceVariant: '#292524',
      background: '#0C0A09',
      error: '#F87171',
      success: '#4ADE80',
      warning: '#FBBF24',
      info: '#60A5FA',
    }
  }
};

export const createTheme = (colorScheme, isDark) => {
  const colors = isDark ? colorScheme.dark : colorScheme.light;
  const baseTheme = isDark ? MD3DarkTheme : MD3LightTheme;
  
  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      ...colors,
      onPrimary: isDark ? '#000000' : '#FFFFFF',
      onSecondary: isDark ? '#000000' : '#FFFFFF',
      onSurface: isDark ? '#FFFFFF' : '#000000',
      onSurfaceVariant: isDark ? '#E0E0E0' : '#424242',
      onBackground: isDark ? '#FFFFFF' : '#000000',
      outline: isDark ? '#424242' : '#E0E0E0',
      shadow: isDark ? '#000000' : '#000000',
      inverseSurface: isDark ? '#FFFFFF' : '#000000',
      inverseOnSurface: isDark ? '#000000' : '#FFFFFF',
      inversePrimary: isDark ? colors.primary : colors.primary,
    },
    roundness: 16,
  };
};

export const GRADIENTS = {
  primary: ['#667eea', '#764ba2'],
  secondary: ['#f093fb', '#f5576c'],
  success: ['#4facfe', '#00f2fe'],
  warning: ['#ffecd2', '#fcb69f'],
  error: ['#ff9a9e', '#fecfef'],
  info: ['#a8edea', '#fed6e3'],
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6.27,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10.32,
    elevation: 8,
  },
};
