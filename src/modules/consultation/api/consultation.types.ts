import { Doctor } from '../mocks/generateDoctors';

export interface DoctorSearchParams {
  query?: string;
  specialty?: string;
  city?: string;
  minRating?: number;
  page: number;
  pageSize: number;
}

export interface Slot {
  id: string;
  doctorId: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface Booking {
  id: string;
  doctorId: string;
  patientId: string;
  slotId: string;
  startTime: string;
  endTime: string;
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
}

export interface BookConsultationPayload {
  doctorId: string;
  slotId: string;
  startTime: string;
  endTime: string;
}

export type { Doctor };