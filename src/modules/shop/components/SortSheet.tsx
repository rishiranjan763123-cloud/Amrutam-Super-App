import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomSheet } from '../../../shared/design-system/components/BottomSheet';
import { useTheme } from '../../../shared/design-system/theme/ThemeProvider';
import { ProductSearchParams } from '../api/shop.types';

interface SortSheetProps {
  visible: boolean;
  onClose: () => void;
  selectedSort?: ProductSearchParams['sortBy'];
  onSelectSort: (sort: ProductSearchParams['sortBy']) => void;
}

const OPTIONS: { label: string; value: ProductSearchParams['sortBy'] }[] = [
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Top Rated', value: 'rating' },
  { label: 'Newest First', value: 'newest' },
];

function SortSheetInner({ visible, onClose, selectedSort, onSelectSort }: SortSheetProps) {
  const { theme } = useTheme();

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Sort By</Text>
      {OPTIONS.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={styles.option}
          onPress={() => {
            onSelectSort(opt.value);
            onClose();
          }}
          accessibilityRole="radio"
          accessibilityState={{ checked: selectedSort === opt.value }}
        >
          <Text style={{ color: selectedSort === opt.value ? theme.colors.primary : theme.colors.text }}>
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </BottomSheet>
  );
}

export const SortSheet = memo(SortSheetInner);

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  option: { paddingVertical: 14 },
});