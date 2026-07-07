import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Doctor } from '../mocks/generateDoctors';
import { Card } from '../../../shared/design-system/components/Card';
import { useTheme } from '../../../shared/design-system/theme/ThemeProvider';

interface DoctorCardProps {
  doctor: Doctor;
  onPress: (doctorId: string) => void;
}

function DoctorCardInner({ doctor, onPress }: DoctorCardProps) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={() => onPress(doctor.id)}
      accessibilityRole="button"
      accessibilityLabel={`${doctor.name}, ${doctor.specialty}, rated ${doctor.rating} stars`}
    >
      <Card style={styles.card}>
        <Image
          source={{ uri: `https://i.pravatar.cc/150?img=${doctor.avatarSeed % 70}` }}
          style={styles.avatar}
        />
        <View style={styles.details}>
          <Text style={[styles.name, { color: theme.colors.text }]} numberOfLines={1}>
            {doctor.name}
          </Text>
          <Text style={[styles.specialty, { color: theme.colors.textSecondary }]} numberOfLines={1}>
            {doctor.specialty} • {doctor.experience} yrs exp
          </Text>
          <View style={styles.row}>
            <Text style={[styles.rating, { color: theme.colors.primary }]}>★ {doctor.rating}</Text>
            <Text style={[styles.city, { color: theme.colors.textSecondary }]}>{doctor.city}</Text>
          </View>
        </View>
        <Text style={[styles.fee, { color: theme.colors.text }]}>₹{doctor.consultationFee}</Text>
      </Card>
    </TouchableOpacity>
  );
}

// Custom comparator: only re-render if doctor data or callback identity changes
export const DoctorCard = memo(DoctorCardInner, (prev, next) => {
  return prev.doctor.id === next.doctor.id && prev.onPress === next.onPress;
});

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 56, height: 56, borderRadius: 28, marginRight: 12 },
  details: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600' },
  specialty: { fontSize: 13, marginTop: 2 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 8 },
  rating: { fontSize: 13, fontWeight: '600' },
  city: { fontSize: 12 },
  fee: { fontSize: 15, fontWeight: '700' },
});