import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../shared/design-system/theme/ThemeProvider';

interface TimelineSectionHeaderProps {
  title: string;
}

function TimelineSectionHeaderInner({ title }: TimelineSectionHeaderProps) {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
    </View>
  );
}

export const TimelineSectionHeader = memo(TimelineSectionHeaderInner);

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingVertical: 10 },
  title: { fontSize: 15, fontWeight: '700' },
});