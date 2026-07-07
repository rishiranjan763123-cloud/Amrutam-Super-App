import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { consultationApi } from '../api/consultation.api';
import { useSession } from '../../../shared/auth/useSession';
import { useToast } from '../../../shared/components/Toast/useToast';

export function useUpcomingConsultations() {
  const { session } = useSession();

  return useQuery({
    queryKey: ['upcoming-consultations', session?.userId],
    queryFn: () => consultationApi.getUpcomingBookings(session?.userId ?? ''),
    enabled: !!session?.userId,
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  const { show } = useToast();

  return useMutation({
    mutationFn: (bookingId: string) => consultationApi.cancelBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['upcoming-consultations'] });
      show('Booking cancelled.', 'success');
    },
    onError: () => {
      show('Could not cancel booking. Please try again.', 'error');
    },
  });
}