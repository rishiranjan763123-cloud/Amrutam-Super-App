import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { consultationApi } from '../api/consultation.api';
import { useDoctorSlots } from '../hooks/useDoctorSlots';
import { SlotPicker } from '../components/SlotPicker';
import { Button } from '../../../shared/design-system/components/Button';
import { ErrorState } from '../../../shared/design-system/components/ErrorState';
import { Skeleton } from '../../../shared/design-system/components/Skeleton';
import { useTheme } from '../../../shared/design-system/theme/ThemeProvider';
import { useConsultationStore } from '../store/consultation.store';
import { ConsultationStackParamList } from '../../../app/navigation/types';
import { Slot } from '../api/consultation.types';

type RouteProps = RouteProp<ConsultationStackParamList, 'DoctorDetails'>;
type NavProp = NativeStackNavigationProp<ConsultationStackParamList, 'DoctorDetails'>;

export function DoctorDetailsScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavProp>();
  const { theme } = useTheme();
  const { doctorId } = route.params;
  const addRecentlyViewed = useConsultationStore((s) => s.addRecentlyViewed);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const { data: doctor, isLoading: doctorLoading, isError: doctorError } = useQuery({
    queryKey: ['doctor', doctorId],
    queryFn: () => consultationApi.getDoctorById(doctorId),
  });

  const { data: slots, isLoading: slotsLoading, isError: slotsError, refetch } = useDoctorSlots(doctorId);

  useEffect(() => {
    addRecentlyViewed(doctorId);
  }, [doctorId, addRecentlyViewed]);

  const handleSelectSlot = useCallback((slot: Slot) => setSelectedSlot(slot), []);

  const handleProceed = useCallback(() => {
    if (!selectedSlot) return;
    navigation.navigate('Booking', {
      doctorId,
      slotId: selectedSlot.id,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
    });
  }, [selectedSlot, doctorId, navigation]);

  if (doctorLoading) {
    return (
      <View style={styles.container}>
        <Skeleton height={80} style={{ marginBottom: 16 }} />
        <Skeleton height={200} />
      </View>
    );
  }

  if (doctorError || !doctor) {
    return <ErrorState message="Could not load doctor details." />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: `https://i.pravatar.cc/150?img=${doctor.avatarSeed % 70}` }}
          style={styles.avatar}
        />
        <Text style={[styles.name, { color: theme.colors.text }]}>{doctor.name}</Text>
        <Text style={[styles.specialty, { color: theme.colors.textSecondary }]}>
          {doctor.specialty} • {doctor.experience} years experience
        </Text>
        <Text style={[styles.meta, { color: theme.colors.textSecondary }]}>
          {doctor.city} • Speaks {doctor.languages.join(', ')}
        </Text>
        <Text style={[styles.fee, { color: theme.colors.primary }]}>
          ₹{doctor.consultationFee} per consultation
        </Text>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Available Slots</Text>

      {slotsError ? (
        <ErrorState message="Could not load slots." onRetry={refetch} />
      ) : slotsLoading ? (
        <Skeleton height={200} />
      ) : (
        <SlotPicker slots={slots ?? []} selectedSlotId={selectedSlot?.id ?? null} onSelectSlot={handleSelectSlot} />
      )}

      <Button
        label="Proceed to Book"
        onPress={handleProceed}
        disabled={!selectedSlot}
        style={styles.proceedButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 88, height: 88, borderRadius: 44, marginBottom: 12 },
  name: { fontSize: 20, fontWeight: '700' },
  specialty: { fontSize: 14, marginTop: 4 },
  meta: { fontSize: 13, marginTop: 4 },
  fee: { fontSize: 16, fontWeight: '700', marginTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  proceedButton: { marginTop: 20, marginBottom: 32 },
});