import { useQuery } from '@tanstack/react-query';
import { consultationApi } from '../api/consultation.api';
import { filterExpiredSlots } from '../utils/slotExpiry';

export function useDoctorSlots(doctorId: string) {
  return useQuery({
    queryKey: ['doctor-slots', doctorId],
    queryFn: async () => {
      const slots = await consultationApi.getAvailableSlots(doctorId);
      // Filter expired slots at read-time — slots list is time-sensitive
      // and can go stale between fetch and render on slow connections.
      return filterExpiredSlots(slots).filter((s) => !s.isBooked);
    },
    enabled: !!doctorId,
    staleTime: 60 * 1000, // 1 min — slots change frequently
  });
}