import React, { memo, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Slot } from '../api/consultation.types';
import { useTheme } from '../../../shared/design-system/theme/ThemeProvider';

interface SlotPickerProps {
  slots: Slot[];
  selectedSlotId: string | null;
  onSelectSlot: (slot: Slot) => void;
}

function groupSlotsByDay(slots: Slot[]): Record<string, Slot[]> {
  return slots.reduce((acc, slot) => {
    const dayKey = new Date(slot.startTime).toDateString();
    if (!acc[dayKey]) acc[dayKey] = [];
    acc[dayKey].push(slot);
    return acc;
  }, {} as Record<string, Slot[]>);
}

function SlotPickerInner({ slots, selectedSlotId, onSelectSlot }: SlotPickerProps) {
  const { theme } = useTheme();
  const grouped = useMemo(() => groupSlotsByDay(slots), [slots]);

  return (
    <ScrollView style={styles.container}>
      {Object.entries(grouped).map(([day, daySlots]) => (
        <View key={day} style={styles.dayGroup}>
          <Text style={[styles.dayLabel, { color: theme.colors.text }]}>{day}</Text>
          <View style={styles.slotGrid}>
            {daySlots.map((slot) => {
              const isSelected = selectedSlotId === slot.id;
              return (
                <TouchableOpacity
                  key={slot.id}
                  onPress={() => onSelectSlot(slot)}
                  style={[
                    styles.slotButton,
                    {
                      backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
                      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={`Slot at ${new Date(slot.startTime).toLocaleTimeString()}`}
                >
                  <Text style={{ color: isSelected ? '#FFFFFF' : theme.colors.text, fontSize: 13 }}>
                    {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

export const SlotPicker = memo(SlotPickerInner);

const styles = StyleSheet.create({
  container: { maxHeight: 320 },
  dayGroup: { marginBottom: 16 },
  dayLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slotButton: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, borderWidth: 1 },
});