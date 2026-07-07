const SLOT_HOLD_BUFFER_MS = 5 * 60 * 1000; // 5 min grace period before slot start

/**
 * A slot is expired if its start time has already passed
 * (with a small grace buffer to avoid rejecting slots that
 * start "now" due to clock skew).
 */
export function isSlotExpired(slotStartTime: string): boolean {
  const slotStart = new Date(slotStartTime).getTime();
  return Date.now() > slotStart - SLOT_HOLD_BUFFER_MS;
}

/**
 * Filters a list of slots down to only those that are still bookable.
 */
export function filterExpiredSlots<T extends { startTime: string }>(slots: T[]): T[] {
  return slots.filter((slot) => !isSlotExpired(slot.startTime));
}

/**
 * Returns milliseconds remaining before a slot expires.
 * Useful for showing a countdown on a "held" slot during checkout.
 */
export function getTimeUntilExpiry(slotStartTime: string): number {
  const slotStart = new Date(slotStartTime).getTime();
  return Math.max(0, slotStart - SLOT_HOLD_BUFFER_MS - Date.now());
}