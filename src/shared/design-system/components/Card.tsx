import React, { memo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Card = memo(function Card({ children, style }: CardProps) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.base,
        { backgroundColor: theme.colors.surface, shadowColor: theme.isDark ? '#000' : '#00000030' },
        style,
      ]}
    >
      {children}
    </View>
  );
});

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});