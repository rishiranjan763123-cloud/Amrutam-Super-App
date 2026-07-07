import { useMutation, useQueryClient } from '@tanstack/react-query';
import { consultationApi } from '../api/consultation.api';
import { BookConsultationPayload } from '../api/consultation.types';
import { mutationQueue } from '../../../shared/offline/mutationQueue';
import { useNetwork } from '../../../shared/offline/NetworkProvider';
import { useToast } from '../../../shared/components/Toast/useToast';
import { useSession } from '../../../shared/auth/useSession';

export function useBookConsultation() {
  const queryClient = useQueryClient();
  const { isConnected } = useNetwork();
  const { show } = useToast();
  const { session } = useSession();

  return useMutation({
    mutationFn: async (payload: BookConsultationPayload) => {
      if (!isConnected) {
        // Queue for later sync instead of failing outright
        mutationQueue.enqueue({ type: 'BOOK_CONSULTATION', payload: { ...payload, patientId: session?.userId } });
        return { queued: true as const };
      }
      return consultationApi.bookConsultation(payload, session?.userId ?? 'guest');
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['doctor-slots'] });
      queryClient.invalidateQueries({ queryKey: ['upcoming-consultations'] });

      if ('queued' in result) {
        show('Booking saved offline — will confirm once you reconnect.', 'info');
      } else {
        show('Consultation booked successfully!', 'success');
      }
    },
    onError: (error: any) => {
      if (error?.response?.status === 409) {
        show('This slot was just taken. Please pick another.', 'error');
      } else {
        show('Could not complete booking. Please try again.', 'error');
      }
    },
  });
}