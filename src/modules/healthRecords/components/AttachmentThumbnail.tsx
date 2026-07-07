import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../shared/design-system/theme/ThemeProvider';

interface AttachmentThumbnailProps {
  attachmentType: 'image' | 'pdf';
}

function AttachmentThumbnailInner({ attachmentType }: AttachmentThumbnailProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.primaryLight }]}
      accessibilityLabel={attachmentType === 'pdf' ? 'PDF attachment' : 'Image attachment'}
    >
      <Text style={{ fontSize: 18 }}>{attachmentType === 'pdf' ? '📄' : '🖼️'}</Text>
    </View>
  );
}

export const AttachmentThumbnail = memo(AttachmentThumbnailInner);

const styles = StyleSheet.create({
  container: { width: 40, height: 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
});