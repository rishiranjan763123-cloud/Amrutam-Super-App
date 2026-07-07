import { filterRecords } from '../utils/recordSearch';
import { HealthRecord } from '../mocks/generateRecords';

const records: HealthRecord[] = [
  {
    id: 'r1',
    type: 'LAB_REPORT',
    title: 'Blood Sugar',
    date: '2026-03-15T00:00:00.000Z',
    doctorName: 'Dr. Anil Sharma',
    tags: ['routine'],
    hasAttachment: false,
    summary: 'Blood Sugar test result',
  },
  {
    id: 'r2',
    type: 'PRESCRIPTION',
    title: 'Ashwagandha Course',
    date: '2026-02-10T00:00:00.000Z',
    doctorName: 'Dr. Priya Patel',
    tags: ['chronic'],
    hasAttachment: true,
    attachmentType: 'pdf',
    summary: 'Ashwagandha course prescribed',
  },
];

describe('filterRecords', () => {
  it('returns all records with no filters', () => {
    expect(filterRecords(records, {})).toHaveLength(2);
  });

  it('filters by search query matching title', () => {
    expect(filterRecords(records, { query: 'blood' })).toHaveLength(1);
  });

  it('filters by search query matching doctor name', () => {
    expect(filterRecords(records, { query: 'priya' })).toHaveLength(1);
  });

  it('filters by record type', () => {
    expect(filterRecords(records, { types: ['PRESCRIPTION'] })).toHaveLength(1);
  });

  it('filters by tag', () => {
    expect(filterRecords(records, { tags: ['chronic'] })).toHaveLength(1);
  });

  it('combines multiple filters with AND logic', () => {
    expect(filterRecords(records, { types: ['LAB_REPORT'], tags: ['chronic'] })).toHaveLength(0);
  });
});