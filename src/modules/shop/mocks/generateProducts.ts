export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  discountPercent: number;
  rating: number;
  inStock: boolean;
  imageSeed: number;
  tags: string[];
}

const CATEGORIES = ['Herbs', 'Oils', 'Supplements', 'Skin Care', 'Hair Care', 'Digestive', 'Immunity', 'Personal Care'];
const PRODUCT_BASES = ['Ashwagandha', 'Triphala', 'Neem', 'Brahmi', 'Amla', 'Chyawanprash', 'Shilajit', 'Turmeric', 'Giloy', 'Tulsi'];
const FORMATS = ['Capsules', 'Powder', 'Oil', 'Tablets', 'Syrup', 'Cream'];
const TAGS = ['organic', 'vegan', 'gluten-free', 'ayush-certified', 'bestseller', 'new'];

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function generateProducts(count: number = 20000): Product[] {
  const products: Product[] = [];

  for (let i = 0; i < count; i++) {
    const rand = (offset: number) => seededRandom(i * 11 + offset);
    const base = PRODUCT_BASES[Math.floor(rand(1) * PRODUCT_BASES.length)];
    const format = FORMATS[Math.floor(rand(2) * FORMATS.length)];
    const numTags = Math.floor(rand(3) * 3);
    const tags = Array.from(
      new Set(Array.from({ length: numTags }, (_, j) => TAGS[Math.floor(rand(4 + j) * TAGS.length)]))
    );

    products.push({
      id: `prod_${i}`,
      name: `${base} ${format}`,
      category: CATEGORIES[Math.floor(rand(5) * CATEGORIES.length)],
      price: 99 + Math.floor(rand(6) * 40) * 25,
      discountPercent: Math.floor(rand(7) * 5) * 10,
      rating: Math.round((3 + rand(8) * 2) * 10) / 10,
      inStock: rand(9) > 0.1,
      imageSeed: i,
      tags,
    });
  }

  return products;
}