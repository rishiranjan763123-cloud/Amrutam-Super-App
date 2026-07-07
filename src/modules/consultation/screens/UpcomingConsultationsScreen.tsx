import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useUpcomingConsultations, useCancelBooking } from '../hooks/useUpcomingConsultations';
import { VirtualizedList } from '../../../shared/design-system/components/VirtualizedList';
import { Card } from '../../../shared/design-system/components/Card';
import { Button } from '../../../shared/design-system/components/Button';
import { ErrorState } from '../../../shared/design-system/components/ErrorState';
import { useTheme } from '../../../shared/design-system/theme/ThemeProvider';
import { Booking } from '../api/consultation.types';

export function UpcomingConsultationsScreen() {
  const { data: bookings, isLoading, isError, refetch } = useUpcomingConsultations();
  const cancelMutation = useCancelBooking();
  const { theme } = useTheme();

  const handleCancel = useCallback(
    (bookingId: string) => {
      Alert.alert('Cancel Booking', 'Are you sure you want to cancel this consultation?', [
        { text: 'No', style: 'cancel' },
        { text: 'Yes, Cancel', style: 'destructive', onPress: () => cancelMutation.mutate(bookingId) },
      ]);
    },
    [cancelMutation]
  );

  const renderItem = useCallback(
    (booking: Booking) => (
      <Card style={styles.card}>
        <Text style={[styles.dateText, { color: theme.colors.text }]}>
          {new Date(booking.startTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
        </Text>
        <Text style={[styles.statusText, { color: theme.colors.textSecondary }]}>
          Status: {booking.status}
        </Text>
        <Button
          label="Cancel"
          variant="danger"
          onPress={() => handleCancel(booking.id)}
          style={styles.cancelButton}
        />
      </Card>
    ),
    [handleCancel, theme]
  );

  if (isError) {
    return <ErrorState message="Could not load your bookings." onRetry={refetch} />;
  }

  return (
    <View style={styles.container}>
      <VirtualizedList
        data={bookings ?? []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        estimatedItemSize={120}
        isLoading={isLoading}
        contentContainerStyle={styles.listContent}
        emptyTitle="No upcoming consultations"
        emptyMessage="Book a consultation to see it here"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: 16 },
  card: { marginBottom: 12 },
  dateText: { fontSize: 15, fontWeight: '600' },
  statusText: { fontSize: 13, marginTop: 4, marginBottom: 8 },
  cancelButton: { marginTop: 4 },
});