import React, { memo } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

function ButtonInner({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  style,
  accessibilityLabel,
}: ButtonProps) {
  const { theme } = useTheme();

  const bgColor = {
    primary: theme.colors.primary,
    secondary: theme.colors.surface,
    outline: 'transparent',
    danger: theme.colors.error,
  }[variant];

  const textColor = variant === 'secondary' || variant === 'outline'
    ? theme.colors.text
    : '#FFFFFF';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        { backgroundColor: bgColor, opacity: disabled ? 0.5 : 1 },
        variant === 'outline' && { borderWidth: 1, borderColor: theme.colors.border },
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

export const Button = memo(ButtonInner);

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44, // accessibility min touch target
  },
  label: { fontSize: 16, fontWeight: '600' },
});