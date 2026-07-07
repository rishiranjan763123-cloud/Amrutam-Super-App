import React, { useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { shopApi } from '../api/shop.api';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { Button } from '../../../shared/design-system/components/Button';
import { ErrorState } from '../../../shared/design-system/components/ErrorState';
import { Skeleton } from '../../../shared/design-system/components/Skeleton';
import { useTheme } from '../../../shared/design-system/theme/ThemeProvider';
import { useToast } from '../../../shared/components/Toast/useToast';
import { ShopStackParamList } from '../../../app/navigation/types';

type RouteProps = RouteProp<ShopStackParamList, 'ProductDetails'>;

export function ProductDetailsScreen() {
  const route = useRoute<RouteProps>();
  const { theme } = useTheme();
  const { productId } = route.params;
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { show } = useToast();

  const { data: product, isLoading, isError, refetch } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => shopApi.getProductById(productId),
  });

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      discountPercent: product.discountPercent,
      imageSeed: product.imageSeed,
    });
    show('Added to cart', 'success');
  }, [product, addItem, show]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Skeleton height={240} style={{ marginBottom: 16 }} />
        <Skeleton height={100} />
      </View>
    );
  }

  if (isError || !product) {
    return <ErrorState message="Could not load product." onRetry={refetch} />;
  }

  const discountedPrice = Math.round(product.price * (1 - product.discountPercent / 100));

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: `https://picsum.photos/seed/${product.imageSeed}/400/400` }}
        style={styles.image}
      />
      <Text style={[styles.name, { color: theme.colors.text }]}>{product.name}</Text>
      <Text style={[styles.category, { color: theme.colors.textSecondary }]}>{product.category}</Text>
      <View style={styles.priceRow}>
        <Text style={[styles.price, { color: theme.colors.text }]}>₹{discountedPrice}</Text>
        {product.discountPercent > 0 && (
          <Text style={[styles.originalPrice, { color: theme.colors.textSecondary }]}>
            ₹{product.price}
          </Text>
        )}
      </View>
      <Text style={[styles.rating, { color: theme.colors.primary }]}>★ {product.rating}</Text>
      {!product.inStock && (
        <Text style={[styles.outOfStock, { color: theme.colors.error }]}>Out of Stock</Text>
      )}
      <View style={styles.buttonRow}>
        <Button
          label="Add to Cart"
          onPress={handleAddToCart}
          disabled={!product.inStock}
          style={styles.addButton}
        />
        <Button
          label={isWishlisted(product.id) ? 'Wishlisted ♥' : 'Wishlist'}
          variant="outline"
          onPress={() => toggle(product.id)}
          style={styles.wishlistButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  image: { width: '100%', height: 280, borderRadius: 12, marginBottom: 16 },
  name: { fontSize: 20, fontWeight: '700' },
  category: { fontSize: 14, marginTop: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  price: { fontSize: 22, fontWeight: '700' },
  originalPrice: { fontSize: 15, textDecorationLine: 'line-through' },
  rating: { fontSize: 15, fontWeight: '600', marginTop: 8 },
  outOfStock: { fontSize: 14, fontWeight: '600', marginTop: 8 },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 24, marginBottom: 32 },
  addButton: { flex: 1 },
  wishlistButton: { flex: 1 },
});