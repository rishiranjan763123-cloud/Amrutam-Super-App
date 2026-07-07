import { generateHealthRecords, HealthRecord } from '../mocks/generateRecords';
import { filterRecords } from '../utils/recordSearch';
import { RecordSearchParams } from './healthRecords.types';
import { logger } from '../../../shared/logging/logger';

let MOCK_RECORDS: HealthRecord[] | null = null;

function getMockRecords(): HealthRecord[] {
  if (!MOCK_RECORDS) {
    MOCK_RECORDS = generateHealthRecords(10000);
  }
  return MOCK_RECORDS;
}

function simulateNetworkDelay(min = 200, max = 700): Promise<void> {
  const delay = min + Math.random() * (max - min);
  return new Promise((resolve) => setTimeout(resolve, delay));
}

function simulateRandomFailure(failureRate = 0.05): void {
  if (Math.random() < failureRate) {
    throw { response: { status: 500 }, message: 'Simulated server error' };
  }
}

export const healthRecordsApi = {
  async searchRecords(params: RecordSearchParams): Promise<{ items: HealthRecord[]; hasMore: boolean; totalCount: number }> {
    await simulateNetworkDelay();
    simulateRandomFailure();

    const results = filterRecords(getMockRecords(), {
      query: params.query,
      types: params.types,
      tags: params.tags,
    });

    const start = params.page * params.pageSize;
    const end = start + params.pageSize;
    const items = results.slice(start, end);

    logger.debug(`searchRecords: page ${params.page}, ${items.length}/${results.length} returned`);

    return { items, hasMore: end < results.length, totalCount: results.length };
  },

  async getRecordById(recordId: string): Promise<HealthRecord | null> {
    await simulateNetworkDelay();
    return getMockRecords().find((r) => r.id === recordId) ?? null;
  },

  async getAllRecords(): Promise<HealthRecord[]> {
    // Used for month/year grouping which needs the full dataset client-side.
    // In a real backend this would be paginated server-side grouping instead.
    await simulateNetworkDelay(300, 900);
    simulateRandomFailure(0.03);
    return getMockRecords();
  },
};