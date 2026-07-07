import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCart } from '../hooks/useCart';
import { shopApi } from '../api/shop.api';
import { mutationQueue } from '../../../shared/offline/mutationQueue';
import { useNetwork } from '../../../shared/offline/NetworkProvider';
import { useToast } from '../../../shared/components/Toast/useToast';
import { Button } from '../../../shared/design-system/components/Button';
import { useTheme } from '../../../shared/design-system/theme/ThemeProvider';
import { ShopStackParamList } from '../../../app/navigation/types';

type NavProp = NativeStackNavigationProp<ShopStackParamList, 'CheckoutSummary'>;

export function CheckoutSummaryScreen() {
  const navigation = useNavigation<NavProp>();
  const { theme } = useTheme();
  const { items, summary, clearCart } = useCart();
  const { isConnected } = useNetwork();
  const { show } = useToast();
  const [isPlacing, setIsPlacing] = useState(false);

  const handlePlaceOrder = useCallback(async () => {
    setIsPlacing(true);
    const payload = {
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity, price: i.price })),
      addressId: 'default-address',
    };

    try {
      if (!isConnected) {
        mutationQueue.enqueue({ type: 'CHECKOUT', payload });
        show('Order queued — will be placed once you reconnect.', 'info');
        clearCart();
        navigation.popToTop();
        return;
      }

      await shopApi.checkout(payload);
      show('Order placed successfully!', 'success');
      clearCart();
      navigation.popToTop();
    } catch (error) {
      show('Could not place order. Please try again.', 'error');
    } finally {
      setIsPlacing(false);
    }
  }, [items, isConnected, show, clearCart, navigation]);

  return (
    <ScrollView style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Order Summary</Text>

      {items.map((item) => (
        <View key={item.productId} style={styles.row}>
          <Text style={[styles.itemName, { color: theme.colors.text }]} numberOfLines={1}>
            {item.name} × {item.quantity}
          </Text>
          <Text style={[styles.itemPrice, { color: theme.colors.text }]}>
            ₹{Math.round(item.price * (1 - item.discountPercent / 100) * item.quantity)}
          </Text>
        </View>
      ))}

      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

      <View style={styles.row}>
        <Text style={{ color: theme.colors.textSecondary }}>Subtotal</Text>
        <Text style={{ color: theme.colors.text }}>₹{summary.subtotal}</Text>
      </View>
      <View style={styles.row}>
        <Text style={{ color: theme.colors.textSecondary }}>Discount</Text>
        <Text style={{ color: theme.colors.success }}>−₹{summary.discount}</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.totalLabel, { color: theme.colors.text }]}>Total</Text>
        <Text style={[styles.totalValue, { color: theme.colors.text }]}>₹{summary.total}</Text>
      </View>

      <Button
        label={isConnected ? 'Place Order' : 'Place Order (Offline)'}
        onPress={handlePlaceOrder}
        loading={isPlacing}
        style={styles.placeOrderButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  itemName: { flex: 1, marginRight: 8, fontSize: 14 },
  itemPrice: { fontSize: 14, fontWeight: '600' },
  divider: { height: 1, marginVertical: 12 },
  totalLabel: { fontSize: 16, fontWeight: '700' },
  totalValue: { fontSize: 16, fontWeight: '700' },
  placeOrderButton: { marginTop: 24, marginBottom: 32 },
});