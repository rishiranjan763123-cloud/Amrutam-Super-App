export interface TimeSlot {
  doctorId: string;
  startTime: string; // ISO string
  endTime: string;
}

export interface BookedSlot extends TimeSlot {
  patientId: string;
  bookingId: string;
}

/**
 * Checks whether a requested slot overlaps with any already-booked slot
 * for the same doctor. Returns the conflicting booking if found, else null.
 */
export function findSlotConflict(
  requestedSlot: TimeSlot,
  existingBookings: BookedSlot[]
): BookedSlot | null {
  const reqStart = new Date(requestedSlot.startTime).getTime();
  const reqEnd = new Date(requestedSlot.endTime).getTime();

  const conflict = existingBookings.find((booking) => {
    if (booking.doctorId !== requestedSlot.doctorId) return false;

    const bookedStart = new Date(booking.startTime).getTime();
    const bookedEnd = new Date(booking.endTime).getTime();

    // Overlap exists if requested range intersects booked range
    return reqStart < bookedEnd && reqEnd > bookedStart;
  });

  return conflict ?? null;
}

/**
 * Detects a double-booking attempt: same patient trying to book
 * the exact same doctor+slot combination they already hold.
 */
export function isDoubleBooking(
  requestedSlot: TimeSlot,
  patientId: string,
  existingBookings: BookedSlot[]
): boolean {
  return existingBookings.some(
    (booking) =>
      booking.patientId === patientId &&
      booking.doctorId === requestedSlot.doctorId &&
      booking.startTime === requestedSlot.startTime
  );
}