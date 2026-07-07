import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { HealthRecord } from '../mocks/generateRecords';
import { RecordTypeTag } from './RecordTypeTag';
import { AttachmentThumbnail } from './AttachmentThumbnail';
import { Card } from '../../../shared/design-system/components/Card';
import { useTheme } from '../../../shared/design-system/theme/ThemeProvider';

interface RecordCardProps {
  record: HealthRecord;
  onPress: (recordId: string) => void;
}

function RecordCardInner({ record, onPress }: RecordCardProps) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={() => onPress(record.id)}
      accessibilityRole="button"
      accessibilityLabel={`${record.title}, ${new Date(record.date).toLocaleDateString()}`}
    >
      <Card style={styles.card}>
        <View style={styles.header}>
          <RecordTypeTag type={record.type} />
          <Text style={[styles.date, { color: theme.colors.textSecondary }]}>
            {new Date(record.date).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.body}>
          <View style={styles.textContent}>
            <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
              {record.title}
            </Text>
            {record.doctorName && (
              <Text style={[styles.doctor, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                {record.doctorName}
              </Text>
            )}
            <View style={styles.tagRow}>
              {record.tags.map((tag) => (
                <Text key={tag} style={[styles.tag, { color: theme.colors.primary }]}>
                  #{tag}
                </Text>
              ))}
            </View>
          </View>
          {record.hasAttachment && record.attachmentType && (
            <AttachmentThumbnail attachmentType={record.attachmentType} />
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
}

export const RecordCard = memo(RecordCardInner, (prev, next) => {
  return prev.record.id === next.record.id && prev.onPress === next.onPress;
});

const styles = StyleSheet.create({
  card: { marginBottom: 10, marginHorizontal: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  date: { fontSize: 12 },
  body: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  textContent: { flex: 1, marginRight: 8 },
  title: { fontSize: 15, fontWeight: '600' },
  doctor: { fontSize: 13, marginTop: 2 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  tag: { fontSize: 11, fontWeight: '600' },
});