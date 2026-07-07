import React, { useCallback, memo } from 'react';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import { View, StyleSheet } from 'react-native';
import { EmptyState } from './EmptyState';
import { Skeleton } from './Skeleton';

interface VirtualizedListProps<T> extends Omit<FlashListProps<T>, 'renderItem'> {
  renderItem: (item: T, index: number) => React.ReactElement;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  skeletonCount?: number;
  estimatedItemSize: number;
}

function VirtualizedListInner<T>({
  data,
  renderItem,
  isLoading,
  emptyTitle = 'No items found',
  emptyMessage = 'Try adjusting your filters',
  skeletonCount = 6,
  estimatedItemSize,
  keyExtractor,
  ...rest
}: VirtualizedListProps<T>) {
  const wrappedRenderItem = useCallback(
    ({ item, index }: { item: T; index: number }) => renderItem(item, index),
    [renderItem]
  );

  if (isLoading) {
    return (
      <View style={styles.skeletonContainer}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <Skeleton key={i} height={estimatedItemSize} style={styles.skeletonItem} />
        ))}
      </View>
    );
  }

  if (!data || data.length === 0) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />;
  }

  return (
    <FlashList
      data={data}
      renderItem={wrappedRenderItem}
      estimatedItemSize={estimatedItemSize}
      keyExtractor={keyExtractor}
      removeClippedSubviews
      // FlashList perf tuning for large datasets (5k-20k items)
      drawDistance={estimatedItemSize * 10}
      {...rest}
    />
  );
}

// Memoize generic component — prevents re-render when parent re-renders with same props
export const VirtualizedList = memo(VirtualizedListInner) as typeof VirtualizedListInner;

const styles = StyleSheet.create({
  skeletonContainer: { padding: 16, gap: 12 },
  skeletonItem: { borderRadius: 12 },
});