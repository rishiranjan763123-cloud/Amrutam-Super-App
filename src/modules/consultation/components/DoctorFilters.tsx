import React, { memo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Chip } from '../../../shared/design-system/components/Chip';
import { Input } from '../../../shared/design-system/components/Input';

const SPECIALTIES = ['Panchakarma', 'Nutrition', 'Skin Care', 'Joint Care', 'Digestive Health', 'Women Health', 'General Ayurveda'];
const CITIES = ['Vadodara', 'Ahmedabad', 'Mumbai', 'Delhi', 'Pune', 'Bangalore', 'Jaipur'];

interface DoctorFiltersProps {
  query: string;
  onQueryChange: (q: string) => void;
  selectedSpecialty?: string;
  onSpecialtyChange: (specialty?: string) => void;
  selectedCity?: string;
  onCityChange: (city?: string) => void;
}

function DoctorFiltersInner({
  query,
  onQueryChange,
  selectedSpecialty,
  onSpecialtyChange,
  selectedCity,
  onCityChange,
}: DoctorFiltersProps) {
  return (
    <View style={styles.container}>
      <Input
        placeholder="Search doctors or specialty..."
        value={query}
        onChangeText={onQueryChange}
        accessibilityLabel="Search doctors"
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
        {SPECIALTIES.map((s) => (
          <Chip
            key={s}
            label={s}
            selected={selectedSpecialty === s}
            onPress={() => onSpecialtyChange(selectedSpecialty === s ? undefined : s)}
          />
        ))}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
        {CITIES.map((c) => (
          <Chip
            key={c}
            label={c}
            selected={selectedCity === c}
            onPress={() => onCityChange(selectedCity === c ? undefined : c)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

export const DoctorFilters = memo(DoctorFiltersInner);

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingTop: 8 },
  chipRow: { marginBottom: 8 },
});