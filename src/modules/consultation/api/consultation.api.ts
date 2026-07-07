import { httpClient } from '../../../shared/network/httpClient';
import { generateDoctors, Doctor } from '../mocks/generateDoctors';
import { DoctorSearchParams, Slot, Booking, BookConsultationPayload } from './consultation.types';
import { logger } from '../../../shared/logging/logger';

// In-memory mock dataset — simulates a backend for this assignment.
// In production this file would only contain httpClient calls.
let MOCK_DOCTORS: Doctor[] | null = null;
let MOCK_BOOKINGS: Booking[] = [];

function getMockDoctors(): Doctor[] {
  if (!MOCK_DOCTORS) {
    MOCK_DOCTORS = generateDoctors(5000);
  }
  return MOCK_DOCTORS;
}

function simulateNetworkDelay(min = 200, max = 800): Promise<void> {
  const delay = min + Math.random() * (max - min);
  return new Promise((resolve) => setTimeout(resolve, delay));
}

function simulateRandomFailure(failureRate = 0.05): void {
  if (Math.random() < failureRate) {
    throw { response: { status: 500 }, message: 'Simulated server error' };
  }
}

export const consultationApi = {
  async searchDoctors(params: DoctorSearchParams): Promise<{ items: Doctor[]; hasMore: boolean; totalCount: number }> {
    await simulateNetworkDelay();
    simulateRandomFailure();

    let results = getMockDoctors();

    if (params.query) {
      const q = params.query.toLowerCase();
      results = results.filter((d) => d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q));
    }
    if (params.specialty) {
      results = results.filter((d) => d.specialty === params.specialty);
    }
    if (params.city) {
      results = results.filter((d) => d.city === params.city);
    }
    if (params.minRating) {
      results = results.filter((d) => d.rating >= params.minRating!);
    }

    const start = params.page * params.pageSize;
    const end = start + params.pageSize;
    const items = results.slice(start, end);

    logger.debug(`searchDoctors: ${items.length}/${results.length} returned`);

    return { items, hasMore: end < results.length, totalCount: results.length };
  },

  async getDoctorById(doctorId: string): Promise<Doctor | null> {
    await simulateNetworkDelay();
    const doctor = getMockDoctors().find((d) => d.id === doctorId);
    return doctor ?? null;
  },

  async getAvailableSlots(doctorId: string): Promise<Slot[]> {
    await simulateNetworkDelay();
    simulateRandomFailure(0.03);

    // Generate next 7 days of slots, 9am-5pm, 30-min intervals
    const slots: Slot[] = [];
    const now = new Date();

    for (let day = 0; day < 7; day++) {
      for (let hour = 9; hour < 17; hour++) {
        for (const minute of [0, 30]) {
          const start = new Date(now);
          start.setDate(now.getDate() + day);
          start.setHours(hour, minute, 0, 0);
          const end = new Date(start.getTime() + 30 * 60 * 1000);

          const alreadyBooked = MOCK_BOOKINGS.some(
            (b) => b.doctorId === doctorId && b.startTime === start.toISOString() && b.status === 'CONFIRMED'
          );

          slots.push({
            id: `slot_${doctorId}_${start.getTime()}`,
            doctorId,
            startTime: start.toISOString(),
            endTime: end.toISOString(),
            isBooked: alreadyBooked,
          });
        }
      }
    }

    return slots;
  },

  async bookConsultation(payload: BookConsultationPayload, patientId: string): Promise<Booking> {
    await simulateNetworkDelay(300, 1000);
    simulateRandomFailure(0.08);

    const conflict = MOCK_BOOKINGS.find(
      (b) =>
        b.doctorId === payload.doctorId &&
        b.status === 'CONFIRMED' &&
        b.startTime === payload.startTime
    );

    if (conflict) {
      throw { response: { status: 409, data: { code: 'SLOT_CONFLICT', message: 'This slot was just booked by someone else.' } } };
    }

    const booking: Booking = {
      id: `booking_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      doctorId: payload.doctorId,
      patientId,
      slotId: payload.slotId,
      startTime: payload.startTime,
      endTime: payload.endTime,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
    };

    MOCK_BOOKINGS.push(booking);
    return booking;
  },

  async cancelBooking(bookingId: string): Promise<void> {
    await simulateNetworkDelay();
    MOCK_BOOKINGS = MOCK_BOOKINGS.map((b) =>
      b.id === bookingId ? { ...b, status: 'CANCELLED' as const } : b
    );
  },

  async getUpcomingBookings(patientId: string): Promise<Booking[]> {
    await simulateNetworkDelay();
    return MOCK_BOOKINGS.filter(
      (b) => b.patientId === patientId && b.status === 'CONFIRMED' && new Date(b.startTime) > new Date()
    );
  },
};