import React, { memo, forwardRef } from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input = memo(
  forwardRef<TextInput, InputProps>(({ label, error, style, ...rest }, ref) => {
    const { theme } = useTheme();

    return (
      <View style={styles.container}>
        {label && (
          <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
        )}
        <TextInput
          ref={ref}
          style={[
            styles.input,
            {
              borderColor: error ? theme.colors.error : theme.colors.border,
              color: theme.colors.text,
              backgroundColor: theme.colors.surface,
            },
            style,
          ]}
          placeholderTextColor={theme.colors.textSecondary}
          accessibilityLabel={label}
          {...rest}
        />
        {error && <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text>}
      </View>
    );
  })
);

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 44,
  },
  error: { fontSize: 12, marginTop: 4 },
});