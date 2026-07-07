import { HealthRecord, RecordType } from '../mocks/generateRecords';

export interface RecordSearchParams {
  query?: string;
  types?: RecordType[];
  tags?: string[];
  page: number;
  pageSize: number;
}

export type { HealthRecord, RecordType };