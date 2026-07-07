import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ title = 'Something went wrong', message, onRetry }: ErrorStateProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container} accessibilityRole="alert">
      <Text style={[styles.title, { color: theme.colors.error }]}>{title}</Text>
      <Text style={[styles.message, { color: theme.colors.textSecondary }]}>{message}</Text>
      {onRetry && (
        <Button label="Retry" onPress={onRetry} variant="secondary" style={styles.retryBtn} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  title: { fontSize: 16, fontWeight: '600', textAlign: 'center' },
  message: { fontSize: 14, marginTop: 4, textAlign: 'center' },
  retryBtn: { marginTop: 16 },
});