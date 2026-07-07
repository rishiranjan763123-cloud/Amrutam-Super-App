import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: React.ReactNode;
}

export function EmptyState({ title, message, icon }: EmptyStateProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container} accessibilityRole="text" accessibilityLabel={title}>
      {icon}
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      {message && (
        <Text style={[styles.message, { color: theme.colors.textSecondary }]}>{message}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  title: { fontSize: 16, fontWeight: '600', marginTop: 12, textAlign: 'center' },
  message: { fontSize: 14, marginTop: 4, textAlign: 'center' },
});