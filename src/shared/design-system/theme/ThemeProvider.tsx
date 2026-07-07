import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { buildTheme, Theme } from './darkTheme';
import { mmkvStorage } from '../../storage/mmkv';

const THEME_PREF_KEY = 'theme_preference';
type ThemePreference = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  preference: ThemePreference;
  setPreference: (pref: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>(
    () => mmkvStorage.getString(THEME_PREF_KEY) as ThemePreference || 'system'
  );

  const isDark = preference === 'system' ? systemScheme === 'dark' : preference === 'dark';
  const theme = buildTheme(isDark);

  const setPreference = (pref: ThemePreference) => {
    setPreferenceState(pref);
    mmkvStorage.setString(THEME_PREF_KEY, pref);
  };

  return (
    <ThemeContext.Provider value={{ theme, preference, setPreference }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}