import { Doctor } from '../modules/consultation/mocks/generateDoctors';
import { Product } from '../modules/shop/mocks/generateProducts';
import { HealthRecord } from '../modules/healthRecords/mocks/generateRecords';

export function mockDoctor(overrides: Partial<Doctor> = {}): Doctor {
  return {
    id: 'doc_test_1',
    name: 'Dr. Test Doctor',
    specialty: 'General Ayurveda',
    experience: 10,
    rating: 4.5,
    consultationFee: 500,
    city: 'Vadodara',
    languages: ['English', 'Hindi'],
    avatarSeed: 1,
    ...overrides,
  };
}

export function mockProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'prod_test_1',
    name: 'Test Ashwagandha Capsules',
    category: 'Supplements',
    price: 299,
    discountPercent: 10,
    rating: 4.2,
    inStock: true,
    imageSeed: 1,
    tags: ['organic'],
    ...overrides,
  };
}

export function mockHealthRecord(overrides: Partial<HealthRecord> = {}): HealthRecord {
  return {
    id: 'rec_test_1',
    type: 'LAB_REPORT',
    title: 'Test Lab Report',
    date: new Date().toISOString(),
    doctorName: 'Dr. Test Doctor',
    tags: ['routine'],
    hasAttachment: false,
    summary: 'Test summary',
    ...overrides,
  };
}