import { HealthRecord } from '../mocks/generateRecords';

export interface TimelineSection {
  title: string; // e.g. "March 2026"
  sortKey: number; // for sorting sections descending
  data: HealthRecord[];
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * Groups a chronologically-sorted list of records into Month/Year sections.
 * Assumes input is already sorted newest-first (as generateHealthRecords produces).
 */
export function groupByMonthYear(records: HealthRecord[]): TimelineSection[] {
  const sectionsMap = new Map<string, TimelineSection>();

  for (const record of records) {
    const date = new Date(record.date);
    const year = date.getFullYear();
    const month = date.getMonth();
    const key = `${year}-${month}`;

    if (!sectionsMap.has(key)) {
      sectionsMap.set(key, {
        title: `${MONTH_NAMES[month]} ${year}`,
        sortKey: year * 12 + month,
        data: [],
      });
    }

    sectionsMap.get(key)!.data.push(record);
  }

  return Array.from(sectionsMap.values()).sort((a, b) => b.sortKey - a.sortKey);
}

/**
 * Flattens grouped sections into a single array with section headers
 * interleaved — useful for feeding FlashList with getItemType for
 * sticky-header-style rendering without a SectionList perf penalty.
 */
export type FlattenedTimelineItem =
  | { type: 'header'; title: string }
  | { type: 'record'; record: HealthRecord };

export function flattenTimelineSections(sections: TimelineSection[]): FlattenedTimelineItem[] {
  const flattened: FlattenedTimelineItem[] = [];
  for (const section of sections) {
    flattened.push({ type: 'header', title: section.title });
    for (const record of section.data) {
      flattened.push({ type: 'record', record });
    }
  }
  return flattened;
}