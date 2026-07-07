import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BottomSheet } from '../../../shared/design-system/components/BottomSheet';
import { Button } from '../../../shared/design-system/components/Button';
import { useTheme } from '../../../shared/design-system/theme/ThemeProvider';
import { Doctor } from '../mocks/generateDoctors';
import { Slot } from '../api/consultation.types';

interface BookingConfirmationSheetProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  doctor: Doctor | null;
  slot: Slot | null;
  isLoading: boolean;
}

function BookingConfirmationSheetInner({
  visible,
  onClose,
  onConfirm,
  doctor,
  slot,
  isLoading,
}: BookingConfirmationSheetProps) {
  const { theme } = useTheme();

  if (!doctor || !slot) return null;

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Confirm Booking</Text>
      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Doctor</Text>
        <Text style={[styles.value, { color: theme.colors.text }]}>{doctor.name}</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Date & Time</Text>
        <Text style={[styles.value, { color: theme.colors.text }]}>
          {new Date(slot.startTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Fee</Text>
        <Text style={[styles.value, { color: theme.colors.text }]}>₹{doctor.consultationFee}</Text>
      </View>
      <Button
        label="Confirm & Book"
        onPress={onConfirm}
        loading={isLoading}
        style={styles.confirmButton}
      />
    </BottomSheet>
  );
}

export const BookingConfirmationSheet = memo(BookingConfirmationSheetInner);

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  label: { fontSize: 14 },
  value: { fontSize: 14, fontWeight: '600' },
  confirmButton: { marginTop: 12 },
});