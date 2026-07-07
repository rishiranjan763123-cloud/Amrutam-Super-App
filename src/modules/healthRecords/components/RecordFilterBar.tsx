import React, { memo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Chip } from '../../../shared/design-system/components/Chip';
import { Input } from '../../../shared/design-system/components/Input';
import { RecordType } from '../mocks/generateRecords';

const TYPES: RecordType[] = ['LAB_REPORT', 'PRESCRIPTION', 'CONSULTATION', 'VACCINATION', 'ALLERGY'];
const TYPE_LABELS: Record<RecordType, string> = {
  LAB_REPORT: 'Lab Report',
  PRESCRIPTION: 'Prescription',
  CONSULTATION: 'Consultation',
  VACCINATION: 'Vaccination',
  ALLERGY: 'Allergy',
};

interface RecordFilterBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  selectedTypes: RecordType[];
  onToggleType: (type: RecordType) => void;
}

function RecordFilterBarInner({ query, onQueryChange, selectedTypes, onToggleType }: RecordFilterBarProps) {
  return (
    <View style={styles.container}>
      <Input
        placeholder="Search records..."
        value={query}
        onChangeText={onQueryChange}
        accessibilityLabel="Search health records"
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
        {TYPES.map((type) => (
          <Chip
            key={type}
            label={TYPE_LABELS[type]}
            selected={selectedTypes.includes(type)}
            onPress={() => onToggleType(type)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

export const RecordFilterBar = memo(RecordFilterBarInner);

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingTop: 8 },
  chipRow: { marginTop: 8 },
});