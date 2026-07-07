import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DoctorListScreen } from '../../modules/consultation/screens/DoctorListScreen';
import { DoctorDetailsScreen } from '../../modules/consultation/screens/DoctorDetailsScreen';
import { BookingScreen } from '../../modules/consultation/screens/BookingScreen';
import { UpcomingConsultationsScreen } from '../../modules/consultation/screens/UpcomingConsultationsScreen';
import { ConsultationStackParamList } from './types';

const Stack = createNativeStackNavigator<ConsultationStackParamList>();

export function ConsultationStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="DoctorList" component={DoctorListScreen} options={{ title: 'Find a Doctor' }} />
      <Stack.Screen name="DoctorDetails" component={DoctorDetailsScreen} options={{ title: 'Doctor Details' }} />
      <Stack.Screen name="Booking" component={BookingScreen} options={{ title: 'Confirm Booking' }} />
      <Stack.Screen
        name="UpcomingConsultations"
        component={UpcomingConsultationsScreen}
        options={{ title: 'My Consultations' }}
      />
    </Stack.Navigator>
  );
}