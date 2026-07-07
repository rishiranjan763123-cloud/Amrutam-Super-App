// Note: Full integration test requires MSW mock server setup (see mockServer.ts).
// This is a focused unit test of the conflict-detection logic path,
// which is the highest-risk part of the booking flow.
import { findSlotConflict, isDoubleBooking } from '../utils/slotConflict';

describe('booking conflict integration scenarios', () => {
  it('prevents booking when doctor slot is already taken by another patient', () => {
    const existing = [
      {
        doctorId: 'doc_1',
        patientId: 'patient_A',
        bookingId: 'b1',
        startTime: '2026-07-10T10:00:00.000Z',
        endTime: '2026-07-10T10:30:00.000Z',
      },
    ];
    const requested = {
      doctorId: 'doc_1',
      startTime: '2026-07-10T10:00:00.000Z',
      endTime: '2026-07-10T10:30:00.000Z',
    };

    expect(findSlotConflict(requested, existing)).not.toBeNull();
  });

  it('flags a double-booking attempt by the same patient', () => {
    const existing = [
      {
        doctorId: 'doc_1',
        patientId: 'patient_A',
        bookingId: 'b1',
        startTime: '2026-07-10T10:00:00.000Z',
        endTime: '2026-07-10T10:30:00.000Z',
      },
    ];
    const requested = {
      doctorId: 'doc_1',
      startTime: '2026-07-10T10:00:00.000Z',
      endTime: '2026-07-10T10:30:00.000Z',
    };

    expect(isDoubleBooking(requested, 'patient_A', existing)).toBe(true);
  });

  it('allows booking a different, non-conflicting slot', () => {
    const existing = [
      {
        doctorId: 'doc_1',
        patientId: 'patient_A',
        bookingId: 'b1',
        startTime: '2026-07-10T10:00:00.000Z',
        endTime: '2026-07-10T10:30:00.000Z',
      },
    ];
    const requested = {
      doctorId: 'doc_1',
      startTime: '2026-07-10T14:00:00.000Z',
      endTime: '2026-07-10T14:30:00.000Z',
    };

    expect(findSlotConflict(requested, existing)).toBeNull();
  });
});