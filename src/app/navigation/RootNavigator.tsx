import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { TabNavigator } from './TabNavigator';
import { linking } from './linking';

export function RootNavigator() {
  return (
    <NavigationContainer linking={linking} fallback={null}>
      <TabNavigator />
    </NavigationContainer>
  );
}