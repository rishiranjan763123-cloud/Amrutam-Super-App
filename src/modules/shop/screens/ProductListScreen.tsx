import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useProductList } from '../hooks/useProductList';
import { useProductFilters } from '../hooks/useProductFilters';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { ProductCard } from '../components/ProductCard';
import { ProductFilterBar } from '../components/ProductFilterBar';
import { VirtualizedList } from '../../../shared/design-system/components/VirtualizedList';
import { ErrorState } from '../../../shared/design-system/components/ErrorState';
import { ShopStackParamList } from '../../../app/navigation/types';
import { Product } from '../mocks/generateProducts';

type NavProp = NativeStackNavigationProp<ShopStackParamList, 'ProductList'>;

export function ProductListScreen() {
  const navigation = useNavigation<NavProp>();
  const { query, setQuery, filters, toggleCategory, setSortBy } = useProductFilters();
  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useProductList(filters);
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();

  const products = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data]);

  const handleProductPress = useCallback(
    (productId: string) => navigation.navigate('ProductDetails', { productId }),
    [navigation]
  );

  const handleToggleWishlist = useCallback((productId: string) => toggle(productId), [toggle]);

  const renderItem = useCallback(
    (product: Product) => (
      <ProductCard
        product={product}
        onPress={handleProductPress}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={isWishlisted(product.id)}
      />
    ),
    [handleProductPress, handleToggleWishlist, isWishlisted]
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isError) {
    return <ErrorState message="Could not load products." onRetry={refetch} />;
  }

  return (
    <View style={styles.container}>
      <ProductFilterBar
        query={query}
        onQueryChange={setQuery}
        selectedCategories={filters.categories ?? []}
        onToggleCategory={toggleCategory}
        sortBy={filters.sortBy}
        onSortChange={setSortBy}
      />
      <VirtualizedList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        estimatedItemSize={210}
        numColumns={2}
        isLoading={isLoading}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
        emptyTitle="No products found"
        emptyMessage="Try adjusting your filters"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: 10 },
});