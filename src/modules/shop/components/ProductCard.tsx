import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Product } from '../mocks/generateProducts';
import { Card } from '../../../shared/design-system/components/Card';
import { useTheme } from '../../../shared/design-system/theme/ThemeProvider';

interface ProductCardProps {
  product: Product;
  onPress: (productId: string) => void;
  onToggleWishlist: (productId: string) => void;
  isWishlisted: boolean;
}

function ProductCardInner({ product, onPress, onToggleWishlist, isWishlisted }: ProductCardProps) {
  const { theme } = useTheme();
  const discountedPrice = Math.round(product.price * (1 - product.discountPercent / 100));

  return (
    <TouchableOpacity
      onPress={() => onPress(product.id)}
      style={styles.touchable}
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, price ₹${discountedPrice}`}
    >
      <Card style={styles.card}>
        <Image
          source={{ uri: `https://picsum.photos/seed/${product.imageSeed}/200/200` }}
          style={styles.image}
        />
        <TouchableOpacity
          style={styles.wishlistButton}
          onPress={() => onToggleWishlist(product.id)}
          accessibilityRole="button"
          accessibilityLabel={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Text style={{ fontSize: 18 }}>{isWishlisted ? '♥' : '♡'}</Text>
        </TouchableOpacity>
        <Text style={[styles.name, { color: theme.colors.text }]} numberOfLines={2}>
          {product.name}
        </Text>
        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: theme.colors.text }]}>₹{discountedPrice}</Text>
          {product.discountPercent > 0 && (
            <Text style={[styles.originalPrice, { color: theme.colors.textSecondary }]}>
              ₹{product.price}
            </Text>
          )}
        </View>
        {!product.inStock && (
          <Text style={[styles.outOfStock, { color: theme.colors.error }]}>Out of Stock</Text>
        )}
      </Card>
    </TouchableOpacity>
  );
}

export const ProductCard = memo(ProductCardInner, (prev, next) => {
  return (
    prev.product.id === next.product.id &&
    prev.isWishlisted === next.isWishlisted &&
    prev.onPress === next.onPress &&
    prev.onToggleWishlist === next.onToggleWishlist
  );
});

const styles = StyleSheet.create({
  touchable: { flex: 1, margin: 6 },
  card: { padding: 10 },
  image: { width: '100%', height: 120, borderRadius: 8, marginBottom: 8 },
  wishlistButton: { position: 'absolute', top: 14, right: 14 },
  name: { fontSize: 13, fontWeight: '500', minHeight: 34 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 6 },
  price: { fontSize: 15, fontWeight: '700' },
  originalPrice: { fontSize: 12, textDecorationLine: 'line-through' },
  outOfStock: { fontSize: 11, marginTop: 4, fontWeight: '600' },
});