import { HealthRecord, RecordType } from '../mocks/generateRecords';

export interface RecordFilters {
  query?: string;
  types?: RecordType[];
  tags?: string[];
}

/**
 * Filters health records by free-text search + type/tag filters.
 * Designed to run client-side against up to 10k records —
 * kept O(n) single-pass, no repeated array allocations inside the loop.
 */
export function filterRecords(records: HealthRecord[], filters: RecordFilters): HealthRecord[] {
  const query = filters.query?.trim().toLowerCase();
  const typeSet = filters.types?.length ? new Set(filters.types) : null;
  const tagSet = filters.tags?.length ? new Set(filters.tags) : null;

  return records.filter((record) => {
    if (typeSet && !typeSet.has(record.type)) return false;

    if (tagSet && !record.tags.some((tag) => tagSet.has(tag))) return false;

    if (query) {
      const haystack = `${record.title} ${record.doctorName ?? ''} ${record.summary}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    return true;
  });
}