import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProductListScreen } from '../../modules/shop/screens/ProductListScreen';
import { ProductDetailsScreen } from '../../modules/shop/screens/ProductDetailsScreen';
import { CartScreen } from '../../modules/shop/screens/CartScreen';
import { CheckoutSummaryScreen } from '../../modules/shop/screens/CheckoutSummaryScreen';
import { ShopStackParamList } from './types';

const Stack = createNativeStackNavigator<ShopStackParamList>();

export function ShopStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProductList" component={ProductListScreen} options={{ title: 'Shop' }} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} options={{ title: 'Product' }} />
      <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Cart' }} />
      <Stack.Screen name="CheckoutSummary" component={CheckoutSummaryScreen} options={{ title: 'Checkout' }} />
    </Stack.Navigator>
  );
}