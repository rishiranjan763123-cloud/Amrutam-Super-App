import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ConsultationStack } from './ConsultationStack';
import { ShopStack } from './ShopStack';
import { HealthRecordsStack } from './HealthRecordsStack';
import { TabParamList } from './types';
import { useTheme } from '../../shared/design-system/theme/ThemeProvider';

const Tab = createBottomTabNavigator<TabParamList>();

export function TabNavigator() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: { backgroundColor: theme.colors.background, borderTopColor: theme.colors.border },
      }}
    >
      <Tab.Screen
        name="ConsultationTab"
        component={ConsultationStack}
        options={{ title: 'Consult' }}
      />
      <Tab.Screen name="ShopTab" component={ShopStack} options={{ title: 'Shop' }} />
      <Tab.Screen
        name="HealthRecordsTab"
        component={HealthRecordsStack}
        options={{ title: 'Records' }}
      />
    </Tab.Navigator>
  );
}