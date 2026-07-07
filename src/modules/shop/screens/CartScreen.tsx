import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCart } from '../hooks/useCart';
import { CartLineItem } from '../components/CartLineItem';
import { VirtualizedList } from '../../../shared/design-system/components/VirtualizedList';
import { Button } from '../../../shared/design-system/components/Button';
import { useTheme } from '../../../shared/design-system/theme/ThemeProvider';
import { ShopStackParamList } from '../../../app/navigation/types';
import { CartItem } from '../store/cart.store';

type NavProp = NativeStackNavigationProp<ShopStackParamList, 'Cart'>;

export function CartScreen() {
  const navigation = useNavigation<NavProp>();
  const { theme } = useTheme();
  const { items, summary, incrementQuantity, decrementQuantity, removeItem, syncCart } = useCart();

  const renderItem = useCallback(
    (item: CartItem) => (
      <CartLineItem
        item={item}
        onIncrement={incrementQuantity}
        onDecrement={decrementQuantity}
        onRemove={removeItem}
      />
    ),
    [incrementQuantity, decrementQuantity, removeItem]
  );

  const handleCheckout = useCallback(() => {
    syncCart();
    navigation.navigate('CheckoutSummary');
  }, [syncCart, navigation]);

  return (
    <View style={styles.container}>
      <VirtualizedList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.productId}
        estimatedItemSize={100}
        contentContainerStyle={styles.listContent}
        emptyTitle="Your cart is empty"
        emptyMessage="Add some products to get started"
      />
      {items.length > 0 && (
        <View style={[styles.summaryBar, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
          <View>
            <Text style={[styles.totalLabel, { color: theme.colors.textSecondary }]}>
              {summary.itemCount} items
            </Text>
            <Text style={[styles.totalValue, { color: theme.colors.text }]}>₹{summary.total}</Text>
          </View>
          <Button label="Checkout" onPress={handleCheckout} style={styles.checkoutButton} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 100 },
  summaryBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
  },
  totalLabel: { fontSize: 12 },
  totalValue: { fontSize: 18, fontWeight: '700' },
  checkoutButton: { paddingHorizontal: 32 },
});