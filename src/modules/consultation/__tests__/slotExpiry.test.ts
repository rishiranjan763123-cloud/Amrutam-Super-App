import { isSlotExpired, filterExpiredSlots, getTimeUntilExpiry } from '../utils/slotExpiry';

describe('isSlotExpired', () => {
  it('returns true for a slot in the past', () => {
    const pastTime = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    expect(isSlotExpired(pastTime)).toBe(true);
  });

  it('returns false for a slot well in the future', () => {
    const futureTime = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    expect(isSlotExpired(futureTime)).toBe(false);
  });

  it('returns true for a slot within the grace buffer', () => {
    const nearTime = new Date(Date.now() + 60 * 1000).toISOString(); // 1 min from now, buffer is 5 min
    expect(isSlotExpired(nearTime)).toBe(true);
  });
});

describe('filterExpiredSlots', () => {
  it('removes expired slots and keeps valid ones', () => {
    const slots = [
      { startTime: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
      { startTime: new Date(Date.now() + 60 * 60 * 1000).toISOString() },
    ];
    const result = filterExpiredSlots(slots);
    expect(result).toHaveLength(1);
  });
});

describe('getTimeUntilExpiry', () => {
  it('returns 0 for an already-expired slot', () => {
    const pastTime = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    expect(getTimeUntilExpiry(pastTime)).toBe(0);
  });

  it('returns a positive number for a future slot', () => {
    const futureTime = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    expect(getTimeUntilExpiry(futureTime)).toBeGreaterThan(0);
  });
});