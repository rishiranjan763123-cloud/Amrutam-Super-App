import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TimelineScreen } from '../../modules/healthRecords/screens/TimelineScreen';
import { RecordDetailsScreen } from '../../modules/healthRecords/screens/RecordDetailsScreen';
import { HealthRecordsStackParamList } from './types';

const Stack = createNativeStackNavigator<HealthRecordsStackParamList>();

export function HealthRecordsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Timeline" component={TimelineScreen} options={{ title: 'Health Records' }} />
      <Stack.Screen name="RecordDetails" component={RecordDetailsScreen} options={{ title: 'Record' }} />
    </Stack.Navigator>
  );
}