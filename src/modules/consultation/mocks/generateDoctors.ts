export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  consultationFee: number;
  city: string;
  languages: string[];
  avatarSeed: number;
}

const SPECIALTIES = ['Panchakarma', 'Nutrition', 'Skin Care', 'Joint Care', 'Digestive Health', 'Women Health', 'General Ayurveda'];
const CITIES = ['Vadodara', 'Ahmedabad', 'Mumbai', 'Delhi', 'Pune', 'Bangalore', 'Jaipur'];
const LANGUAGES = ['English', 'Hindi', 'Gujarati', 'Marathi', 'Tamil'];
const FIRST_NAMES = ['Anil', 'Priya', 'Rajesh', 'Sunita', 'Vikram', 'Meera', 'Arjun', 'Kavita', 'Suresh', 'Neha'];
const LAST_NAMES = ['Sharma', 'Patel', 'Iyer', 'Reddy', 'Verma', 'Nair', 'Joshi', 'Mehta', 'Rao', 'Gupta'];

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function generateDoctors(count: number = 5000): Doctor[] {
  const doctors: Doctor[] = [];

  for (let i = 0; i < count; i++) {
    const rand = (offset: number) => seededRandom(i * 7 + offset);
    const firstName = FIRST_NAMES[Math.floor(rand(1) * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(rand(2) * LAST_NAMES.length)];
    const numLanguages = 1 + Math.floor(rand(3) * 3);
    const languages = Array.from(
      new Set(Array.from({ length: numLanguages }, (_, j) => LANGUAGES[Math.floor(rand(4 + j) * LANGUAGES.length)]))
    );

    doctors.push({
      id: `doc_${i}`,
      name: `Dr. ${firstName} ${lastName}`,
      specialty: SPECIALTIES[Math.floor(rand(5) * SPECIALTIES.length)],
      experience: 1 + Math.floor(rand(6) * 30),
      rating: Math.round((3 + rand(7) * 2) * 10) / 10,
      consultationFee: 200 + Math.floor(rand(8) * 20) * 50,
      city: CITIES[Math.floor(rand(9) * CITIES.length)],
      languages,
      avatarSeed: i,
    });
  }

  return doctors;
}