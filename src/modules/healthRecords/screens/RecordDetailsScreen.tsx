import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { healthRecordsApi } from '../api/healthRecords.api';
import { RecordTypeTag } from '../components/RecordTypeTag';
import { AttachmentThumbnail } from '../components/AttachmentThumbnail';
import { ErrorState } from '../../../shared/design-system/components/ErrorState';
import { Skeleton } from '../../../shared/design-system/components/Skeleton';
import { useTheme } from '../../../shared/design-system/theme/ThemeProvider';
import { HealthRecordsStackParamList } from '../../../app/navigation/types';

type RouteProps = RouteProp<HealthRecordsStackParamList, 'RecordDetails'>;

export function RecordDetailsScreen() {
  const route = useRoute<RouteProps>();
  const { theme } = useTheme();
  const { recordId } = route.params;

  const { data: record, isLoading, isError, refetch } = useQuery({
    queryKey: ['record', recordId],
    queryFn: () => healthRecordsApi.getRecordById(recordId),
  });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Skeleton height={40} style={{ marginBottom: 16 }} />
        <Skeleton height={120} />
      </View>
    );
  }

  if (isError || !record) {
    return <ErrorState message="Could not load record." onRetry={refetch} />;
  }

  return (
    <ScrollView style={styles.container}>
      <RecordTypeTag type={record.type} />
      <Text style={[styles.title, { color: theme.colors.text }]}>{record.title}</Text>
      <Text style={[styles.date, { color: theme.colors.textSecondary }]}>
        {new Date(record.date).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}
      </Text>
      {record.doctorName && (
        <Text style={[styles.doctor, { color: theme.colors.text }]}>By {record.doctorName}</Text>
      )}
      <Text style={[styles.summary, { color: theme.colors.text }]}>{record.summary}</Text>
      <View style={styles.tagRow}>
        {record.tags.map((tag) => (
          <Text key={tag} style={[styles.tag, { color: theme.colors.primary }]}>
            #{tag}
          </Text>
        ))}
      </View>
      {record.hasAttachment && record.attachmentType && (
        <View style={styles.attachmentSection}>
          <Text style={[styles.attachmentLabel, { color: theme.colors.textSecondary }]}>Attachment</Text>
          <AttachmentThumbnail attachmentType={record.attachmentType} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginTop: 12 },
  date: { fontSize: 13, marginTop: 4 },
  doctor: { fontSize: 15, fontWeight: '600', marginTop: 12 },
  summary: { fontSize: 14, marginTop: 12, lineHeight: 20 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  tag: { fontSize: 12, fontWeight: '600' },
  attachmentSection: { marginTop: 24 },
  attachmentLabel: { fontSize: 13, marginBottom: 8 },
});