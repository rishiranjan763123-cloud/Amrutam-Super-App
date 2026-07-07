import React, { memo, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Chip } from '../../../shared/design-system/components/Chip';
import { Input } from '../../../shared/design-system/components/Input';
import { Button } from '../../../shared/design-system/components/Button';
import { SortSheet } from './SortSheet';
import { ProductSearchParams } from '../api/shop.types';

const CATEGORIES = ['Herbs', 'Oils', 'Supplements', 'Skin Care', 'Hair Care', 'Digestive', 'Immunity', 'Personal Care'];

interface ProductFilterBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
  sortBy?: ProductSearchParams['sortBy'];
  onSortChange: (sort: ProductSearchParams['sortBy']) => void;
}

function ProductFilterBarInner({
  query,
  onQueryChange,
  selectedCategories,
  onToggleCategory,
  sortBy,
  onSortChange,
}: ProductFilterBarProps) {
  const [sortSheetVisible, setSortSheetVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Input
        placeholder="Search products..."
        value={query}
        onChangeText={onQueryChange}
        accessibilityLabel="Search products"
      />
      <View style={styles.row}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          {CATEGORIES.map((c) => (
            <Chip
              key={c}
              label={c}
              selected={selectedCategories.includes(c)}
              onPress={() => onToggleCategory(c)}
            />
          ))}
        </ScrollView>
        <Button label="Sort" variant="outline" onPress={() => setSortSheetVisible(true)} style={styles.sortButton} />
      </View>
      <SortSheet
        visible={sortSheetVisible}
        onClose={() => setSortSheetVisible(false)}
        selectedSort={sortBy}
        onSelectSort={onSortChange}
      />
    </View>
  );
}

export const ProductFilterBar = memo(ProductFilterBarInner);

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingTop: 8 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  chipScroll: { flex: 1 },
  sortButton: { marginLeft: 8, paddingHorizontal: 12 },
});