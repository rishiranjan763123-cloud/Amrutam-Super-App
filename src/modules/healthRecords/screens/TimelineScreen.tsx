import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useGroupedTimeline } from '../hooks/useGroupedTimeline';
import { useRecordFilters } from '../hooks/useRecordFilters';
import { RecordCard } from '../components/RecordCard';
import { RecordFilterBar } from '../components/RecordFilterBar';
import { TimelineSectionHeader } from '../components/TimelineSectionHeader';
import { VirtualizedList } from '../../../shared/design-system/components/VirtualizedList';
import { ErrorState } from '../../../shared/design-system/components/ErrorState';
import { HealthRecordsStackParamList } from '../../../app/navigation/types';
import { FlattenedTimelineItem } from '../utils/groupByMonthYear';

type NavProp = NativeStackNavigationProp<HealthRecordsStackParamList, 'Timeline'>;

export function TimelineScreen() {
  const navigation = useNavigation<NavProp>();
  const { query, setQuery, types, toggleType, filters } = useRecordFilters();
  const { flattenedItems, isLoading, error, refetch } = useGroupedTimeline(filters);

  const handleRecordPress = useCallback(
    (recordId: string) => navigation.navigate('RecordDetails', { recordId }),
    [navigation]
  );

  const renderItem = useCallback(
    (item: FlattenedTimelineItem) => {
      if (item.type === 'header') {
        return <TimelineSectionHeader title={item.title} />;
      }
      return <RecordCard record={item.record} onPress={handleRecordPress} />;
    },
    [handleRecordPress]
  );

  // getItemType tells FlashList to recycle header vs record views separately —
  // critical for smooth scrolling with mixed item heights at 10k scale.
  const getItemType = useCallback((item: FlattenedTimelineItem) => item.type, []);

  const keyExtractor = useCallback(
    (item: FlattenedTimelineItem, index: number) =>
      item.type === 'header' ? `header-${item.title}` : item.record.id,
    []
  );

  if (error) {
    return <ErrorState message="Could not load health records." onRetry={refetch} />;
  }

  return (
    <View style={styles.container}>
      <RecordFilterBar
        query={query}
        onQueryChange={setQuery}
        selectedTypes={types}
        onToggleType={toggleType}
      />
      <VirtualizedList
        data={flattenedItems}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemType={getItemType}
        estimatedItemSize={100}
        isLoading={isLoading}
        contentContainerStyle={styles.listContent}
        emptyTitle="No health records found"
        emptyMessage="Try adjusting your filters"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { paddingVertical: 8 },
});