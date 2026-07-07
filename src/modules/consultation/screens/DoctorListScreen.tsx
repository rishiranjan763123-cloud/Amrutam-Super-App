import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDoctors } from '../hooks/useDoctors';
import { DoctorCard } from '../components/DoctorCard';
import { DoctorFilters } from '../components/DoctorFilters';
import { VirtualizedList } from '../../../shared/design-system/components/VirtualizedList';
import { ErrorState } from '../../../shared/design-system/components/ErrorState';
import { useDebouncedSearch } from '../../../shared/hooks/useDebouncedSearch';
import { ConsultationStackParamList } from '../../../app/navigation/types';
import { Doctor } from '../mocks/generateDoctors';

type NavProp = NativeStackNavigationProp<ConsultationStackParamList, 'DoctorList'>;

export function DoctorListScreen() {
  const navigation = useNavigation<NavProp>();
  const { query, setQuery, debouncedQuery } = useDebouncedSearch(300);
  const [specialty, setSpecialty] = useState<string | undefined>();
  const [city, setCity] = useState<string | undefined>();

  const filters = useMemo(
    () => ({ query: debouncedQuery || undefined, specialty, city }),
    [debouncedQuery, specialty, city]
  );

  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useDoctors(filters);

  const doctors = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data]);

  const handleDoctorPress = useCallback(
    (doctorId: string) => {
      navigation.navigate('DoctorDetails', { doctorId });
    },
    [navigation]
  );

  const renderItem = useCallback(
    (doctor: Doctor) => <DoctorCard doctor={doctor} onPress={handleDoctorPress} />,
    [handleDoctorPress]
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isError) {
    return <ErrorState message="Could not load doctors. Check your connection." onRetry={refetch} />;
  }

  return (
    <View style={styles.container}>
      <DoctorFilters
        query={query}
        onQueryChange={setQuery}
        selectedSpecialty={specialty}
        onSpecialtyChange={setSpecialty}
        selectedCity={city}
        onCityChange={setCity}
      />
      <VirtualizedList
        data={doctors}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        estimatedItemSize={88}
        isLoading={isLoading}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
        emptyTitle="No doctors found"
        emptyMessage="Try adjusting your search or filters"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: 16 },
});