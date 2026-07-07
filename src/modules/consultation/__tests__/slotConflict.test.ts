import { findSlotConflict, isDoubleBooking, BookedSlot, TimeSlot } from '../utils/slotConflict';

describe('findSlotConflict', () => {
  const existingBookings: BookedSlot[] = [
    {
      doctorId: 'doc_1',
      patientId: 'patient_1',
      bookingId: 'booking_1',
      startTime: '2026-07-10T10:00:00.000Z',
      endTime: '2026-07-10T10:30:00.000Z',
    },
  ];

  it('detects an overlapping slot for the same doctor', () => {
    const requested: TimeSlot = {
      doctorId: 'doc_1',
      startTime: '2026-07-10T10:15:00.000Z',
      endTime: '2026-07-10T10:45:00.000Z',
    };
    expect(findSlotConflict(requested, existingBookings)).not.toBeNull();
  });

  it('returns null for a non-overlapping slot', () => {
    const requested: TimeSlot = {
      doctorId: 'doc_1',
      startTime: '2026-07-10T11:00:00.000Z',
      endTime: '2026-07-10T11:30:00.000Z',
    };
    expect(findSlotConflict(requested, existingBookings)).toBeNull();
  });

  it('ignores overlapping times for a different doctor', () => {
    const requested: TimeSlot = {
      doctorId: 'doc_2',
      startTime: '2026-07-10T10:15:00.000Z',
      endTime: '2026-07-10T10:45:00.000Z',
    };
    expect(findSlotConflict(requested, existingBookings)).toBeNull();
  });
});

describe('isDoubleBooking', () => {
  const existingBookings: BookedSlot[] = [
    {
      doctorId: 'doc_1',
      patientId: 'patient_1',
      bookingId: 'booking_1',
      startTime: '2026-07-10T10:00:00.000Z',
      endTime: '2026-07-10T10:30:00.000Z',
    },
  ];

  it('detects a double booking by the same patient for the same slot', () => {
    const requested: TimeSlot = {
      doctorId: 'doc_1',
      startTime: '2026-07-10T10:00:00.000Z',
      endTime: '2026-07-10T10:30:00.000Z',
    };
    expect(isDoubleBooking(requested, 'patient_1', existingBookings)).toBe(true);
  });

  it('allows a different patient to book the same slot (handled separately by conflict check)', () => {
    const requested: TimeSlot = {
      doctorId: 'doc_1',
      startTime: '2026-07-10T10:00:00.000Z',
      endTime: '2026-07-10T10:30:00.000Z',
    };
    expect(isDoubleBooking(requested, 'patient_2', existingBookings)).toBe(false);
  });
});