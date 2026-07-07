import { groupByMonthYear, flattenTimelineSections } from '../utils/groupByMonthYear';
import { HealthRecord } from '../mocks/generateRecords';

function makeRecord(overrides: Partial<HealthRecord>): HealthRecord {
  return {
    id: 'rec_1',
    type: 'LAB_REPORT',
    title: 'Test',
    date: '2026-03-15T00:00:00.000Z',
    tags: [],
    hasAttachment: false,
    summary: 'Test summary',
    ...overrides,
  };
}

describe('groupByMonthYear', () => {
  it('groups records into the correct month/year sections', () => {
    const records = [
      makeRecord({ id: 'r1', date: '2026-03-15T00:00:00.000Z' }),
      makeRecord({ id: 'r2', date: '2026-03-20T00:00:00.000Z' }),
      makeRecord({ id: 'r3', date: '2026-02-10T00:00:00.000Z' }),
    ];

    const sections = groupByMonthYear(records);

    expect(sections).toHaveLength(2);
    expect(sections[0].title).toBe('March 2026');
    expect(sections[0].data).toHaveLength(2);
    expect(sections[1].title).toBe('February 2026');
    expect(sections[1].data).toHaveLength(1);
  });

  it('sorts sections newest first', () => {
    const records = [
      makeRecord({ id: 'r1', date: '2025-01-01T00:00:00.000Z' }),
      makeRecord({ id: 'r2', date: '2026-06-01T00:00:00.000Z' }),
    ];

    const sections = groupByMonthYear(records);
    expect(sections[0].title).toBe('June 2026');
  });
});

describe('flattenTimelineSections', () => {
  it('interleaves header and record items', () => {
    const sections = [
      { title: 'March 2026', sortKey: 1, data: [makeRecord({ id: 'r1' })] },
    ];

    const flattened = flattenTimelineSections(sections);

    expect(flattened[0]).toEqual({ type: 'header', title: 'March 2026' });
    expect(flattened[1].type).toBe('record');
  });
});