import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLOR_SCHEMES, createTheme } from '../utils/themes';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [colorScheme, setColorScheme] = useState('default');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadThemePreferences();
  }, []);

  const loadThemePreferences = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('themePreference');
      const savedColorScheme = await AsyncStorage.getItem('colorScheme');
      
      if (savedTheme !== null) {
        setIsDarkMode(JSON.parse(savedTheme));
      }
      if (savedColorScheme !== null) {
        setColorScheme(savedColorScheme);
      }
    } catch (error) {
      console.error('Error loading theme preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      await AsyncStorage.setItem('themePreference', JSON.stringify(newTheme));
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const changeColorScheme = async (newScheme) => {
    try {
      setColorScheme(newScheme);
      await AsyncStorage.setItem('colorScheme', newScheme);
    } catch (error) {
      console.error('Error saving color scheme:', error);
    }
  };

  const getCurrentTheme = () => {
    return createTheme(COLOR_SCHEMES[colorScheme], isDarkMode);
  };

  const value = {
    isDarkMode,
    setIsDarkMode,
    toggleTheme,
    colorScheme,
    changeColorScheme,
    getCurrentTheme,
    availableSchemes: COLOR_SCHEMES,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export { ThemeContext };
