import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { AppProviders } from './AppProviders';
import { RootNavigator } from './navigation/RootNavigator';
import { initSentry } from './bootstrap/initSentry';
import { initFlags } from './bootstrap/initFlags';
import { initSync } from './bootstrap/initSync';
import { useTheme } from '../shared/design-system/theme/ThemeProvider';

function AppContent() {
  const { theme } = useTheme();

  return (
    <>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
      <RootNavigator />
    </>
  );
}

export default function App() {
  useEffect(() => {
    initSentry();
    initFlags();
    initSync();
  }, []);

  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}