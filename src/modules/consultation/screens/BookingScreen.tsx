import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { consultationApi } from '../api/consultation.api';
import { useBookConsultation } from '../hooks/useBookConsultation';
import { BookingConfirmationSheet } from '../components/BookingConfirmationSheet';
import { Button } from '../../../shared/design-system/components/Button';
import { ConsultationStackParamList } from '../../../app/navigation/types';

type RouteProps = RouteProp<ConsultationStackParamList, 'Booking'>;
type NavProp = NativeStackNavigationProp<ConsultationStackParamList, 'Booking'>;

export function BookingScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavProp>();
  const { doctorId, slotId, startTime, endTime } = route.params;
  const [sheetVisible, setSheetVisible] = useState(true);

  const { data: doctor } = useQuery({
    queryKey: ['doctor', doctorId],
    queryFn: () => consultationApi.getDoctorById(doctorId),
  });

  const bookMutation = useBookConsultation();

  const handleConfirm = useCallback(() => {
    bookMutation.mutate(
      { doctorId, slotId, startTime, endTime },
      {
        onSuccess: () => {
          setSheetVisible(false);
          navigation.navigate('UpcomingConsultations');
        },
      }
    );
  }, [bookMutation, doctorId, slotId, startTime, endTime, navigation]);

  const handleClose = useCallback(() => {
    setSheetVisible(false);
    navigation.goBack();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <BookingConfirmationSheet
        visible={sheetVisible}
        onClose={handleClose}
        onConfirm={handleConfirm}
        doctor={doctor ?? null}
        slot={{ id: slotId, doctorId, startTime, endTime, isBooked: false }}
        isLoading={bookMutation.isPending}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});