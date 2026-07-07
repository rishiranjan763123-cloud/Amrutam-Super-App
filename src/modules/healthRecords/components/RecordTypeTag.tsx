import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RecordType } from '../mocks/generateRecords';

const TYPE_CONFIG: Record<RecordType, { label: string; color: string }> = {
  LAB_REPORT: { label: 'Lab Report', color: '#2196F3' },
  PRESCRIPTION: { label: 'Prescription', color: '#2E7D5B' },
  CONSULTATION: { label: 'Consultation', color: '#9C27B0' },
  VACCINATION: { label: 'Vaccination', color: '#F5A623' },
  ALLERGY: { label: 'Allergy', color: '#D32F2F' },
};

interface RecordTypeTagProps {
  type: RecordType;
}

function RecordTypeTagInner({ type }: RecordTypeTagProps) {
  const config = TYPE_CONFIG[type];
  return (
    <View style={[styles.tag, { backgroundColor: `${config.color}20` }]}>
      <Text style={[styles.text, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

export const RecordTypeTag = memo(RecordTypeTagInner);

const styles = StyleSheet.create({
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start' },
  text: { fontSize: 11, fontWeight: '700' },
});