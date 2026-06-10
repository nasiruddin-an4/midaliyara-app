import { useEffect, useState } from 'react';
import { useColorScheme } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = '@app_theme_mode'; // 'light', 'dark', or 'system'

export function useThemeManager() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [themeMode, setThemeMode] = useState('system'); // Current preference setting
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved theme preference on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_KEY);
        if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
          setThemeMode(savedTheme);
          setColorScheme(savedTheme);
        } else {
          setThemeMode('system');
          setColorScheme('system');
        }
      } catch (e) {
        console.error('Failed to load theme preference', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadTheme();
  }, [setColorScheme]);

  // Update theme preference
  const updateThemeMode = async (newMode) => {
    try {
      await AsyncStorage.setItem(THEME_KEY, newMode);
      setThemeMode(newMode);
      setColorScheme(newMode);
    } catch (e) {
      console.error('Failed to save theme preference', e);
    }
  };

  return { themeMode, updateThemeMode, colorScheme, isLoaded };
}
