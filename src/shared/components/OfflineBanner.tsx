import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNetwork } from '../offline/NetworkProvider';
import { useTheme } from '../design-system/theme/ThemeProvider';

export function OfflineBanner() {
  const { isConnected, isInternetReachable } = useNetwork();
  const { theme } = useTheme();

  if (isConnected && isInternetReachable) return null;

  return (
    <View style={[styles.banner, { backgroundColor: theme.colors.warning }]} accessibilityLiveRegion="polite">
      <Text style={styles.text}>You're offline. Changes will sync once reconnected.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { padding: 8, alignItems: 'center' },
  text: { color: '#1A1A1A', fontSize: 13, fontWeight: '600' },
});