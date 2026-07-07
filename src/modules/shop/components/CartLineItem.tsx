import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { CartItem } from '../store/cart.store';
import { QuantityStepper } from './QuantityStepper';
import { getLineItemTotal } from '../utils/cartMath';
import { useTheme } from '../../../shared/design-system/theme/ThemeProvider';

interface CartLineItemProps {
  item: CartItem;
  onIncrement: (productId: string) => void;
  onDecrement: (productId: string) => void;
  onRemove: (productId: string) => void;
}

function CartLineItemInner({ item, onIncrement, onDecrement, onRemove }: CartLineItemProps) {
  const { theme } = useTheme();
  const total = getLineItemTotal(item);

  return (
    <View style={[styles.container, { borderBottomColor: theme.colors.border }]}>
      <Image
        source={{ uri: `https://picsum.photos/seed/${item.imageSeed}/100/100` }}
        style={styles.image}
      />
      <View style={styles.details}>
        <Text style={[styles.name, { color: theme.colors.text }]} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={[styles.price, { color: theme.colors.primary }]}>₹{total}</Text>
        <QuantityStepper
          quantity={item.quantity}
          onIncrement={() => onIncrement(item.productId)}
          onDecrement={() => onDecrement(item.productId)}
        />
      </View>
      <TouchableOpacity
        onPress={() => onRemove(item.productId)}
        accessibilityRole="button"
        accessibilityLabel={`Remove ${item.name} from cart`}
      >
        <Text style={{ color: theme.colors.error, fontSize: 13 }}>Remove</Text>
      </TouchableOpacity>
    </View>
  );
}

export const CartLineItem = memo(CartLineItemInner);

const styles = StyleSheet.create({
  container: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, alignItems: 'flex-start' },
  image: { width: 64, height: 64, borderRadius: 8, marginRight: 12 },
  details: { flex: 1, gap: 6 },
  name: { fontSize: 14, fontWeight: '500' },
  price: { fontSize: 15, fontWeight: '700' },
});