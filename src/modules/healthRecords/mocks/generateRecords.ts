export type RecordType = 'LAB_REPORT' | 'PRESCRIPTION' | 'CONSULTATION' | 'VACCINATION' | 'ALLERGY';

export interface HealthRecord {
  id: string;
  type: RecordType;
  title: string;
  date: string; // ISO string
  doctorName?: string;
  tags: string[];
  hasAttachment: boolean;
  attachmentType?: 'image' | 'pdf';
  summary: string;
}

const TYPES: RecordType[] = ['LAB_REPORT', 'PRESCRIPTION', 'CONSULTATION', 'VACCINATION', 'ALLERGY'];
const DOCTORS = ['Dr. Anil Sharma', 'Dr. Priya Patel', 'Dr. Rajesh Iyer', 'Dr. Sunita Verma', 'Dr. Vikram Nair'];
const TAGS = ['routine', 'urgent', 'follow-up', 'chronic', 'seasonal', 'first-visit'];
const LAB_TESTS = ['Blood Sugar', 'Lipid Profile', 'Thyroid Panel', 'CBC', 'Vitamin D', 'Liver Function'];
const PRESCRIPTIONS = ['Ashwagandha Course', 'Triphala Regimen', 'Digestive Support', 'Immunity Booster'];
const VACCINES = ['Flu Shot', 'Hepatitis B', 'Tetanus Booster', 'COVID Booster'];
const ALLERGIES = ['Pollen Allergy', 'Dust Mite Reaction', 'Food Sensitivity - Dairy', 'Seasonal Rhinitis'];

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function titleForType(type: RecordType, rand: (offset: number) => number): string {
  switch (type) {
    case 'LAB_REPORT':
      return LAB_TESTS[Math.floor(rand(10) * LAB_TESTS.length)];
    case 'PRESCRIPTION':
      return PRESCRIPTIONS[Math.floor(rand(10) * PRESCRIPTIONS.length)];
    case 'CONSULTATION':
      return 'General Consultation';
    case 'VACCINATION':
      return VACCINES[Math.floor(rand(10) * VACCINES.length)];
    case 'ALLERGY':
      return ALLERGIES[Math.floor(rand(10) * ALLERGIES.length)];
  }
}

export function generateHealthRecords(count: number = 10000): HealthRecord[] {
  const records: HealthRecord[] = [];
  const now = Date.now();
  const fourYearsMs = 4 * 365 * 24 * 60 * 60 * 1000;

  for (let i = 0; i < count; i++) {
    const rand = (offset: number) => seededRandom(i * 13 + offset);
    const type = TYPES[Math.floor(rand(1) * TYPES.length)];
    const timestamp = now - Math.floor(rand(2) * fourYearsMs);
    const numTags = 1 + Math.floor(rand(3) * 2);
    const tags = Array.from(
      new Set(Array.from({ length: numTags }, (_, j) => TAGS[Math.floor(rand(4 + j) * TAGS.length)]))
    );
    const hasAttachment = rand(8) > 0.4;

    records.push({
      id: `rec_${i}`,
      type,
      title: titleForType(type, rand),
      date: new Date(timestamp).toISOString(),
      doctorName: type !== 'ALLERGY' ? DOCTORS[Math.floor(rand(9) * DOCTORS.length)] : undefined,
      tags,
      hasAttachment,
      attachmentType: hasAttachment ? (rand(10) > 0.5 ? 'image' : 'pdf') : undefined,
      summary: `${titleForType(type, rand)} recorded on ${new Date(timestamp).toLocaleDateString()}`,
    });
  }

  // Sort newest first — timeline expects chronological order
  return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}