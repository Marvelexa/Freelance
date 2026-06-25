import { Product } from './types';

const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
const businessName = searchParams ? (searchParams.get('name') || '').toLowerCase() : '';
const businessCategory = searchParams ? (searchParams.get('category') || '').toLowerCase() : '';
const combined = `${businessName} ${businessCategory}`;

export const isSareeOrEthnic = combined.includes('saree') || 
                               combined.includes('sari') || 
                               combined.includes('sadi') || 
                               combined.includes('vastra') || 
                               combined.includes('lehenga') || 
                               combined.includes('ethnic') || 
                               combined.includes('kurti') ||
                               combined.includes('ladies') ||
                               combined.includes('traditional') ||
                               combined.includes('fashion') ||
                               combined.includes('suit') ||
                               combined.includes('matching') ||
                               combined.includes('boutique') ||
                               combined.includes('wear') ||
                               combined.includes('collection') ||
                               combined.includes('readymade') ||
                               combined.includes('hosiery') ||
                               combined.includes('textile');

const phoneParam = searchParams ? (searchParams.get('phone') || '') : '';
const cleanPhone = phoneParam.replace(/[^0-9+]/g, '');

let isUSA = false;
let isIndia = false;

if (cleanPhone) {
  if (cleanPhone.startsWith('+1') || (cleanPhone.startsWith('1') && cleanPhone.length === 11)) {
    isUSA = true;
  } else if (cleanPhone.startsWith('+91') || (cleanPhone.startsWith('91') && cleanPhone.length === 12) || cleanPhone.length === 10) {
    isIndia = true;
  }
} else {
  // Always default to USA/USD unless India phone is explicitly provided
  isUSA = true;
  isIndia = false;
}

export const currencySymbol = isIndia ? '₹' : '$';

const standardProducts: Product[] = [
  {
    id: 'p1',
    name: 'Camel Cashmere Overcoat',
    price: 495,
    category: 'Outerwear',
    image: 'https://images.unsplash.com/photo-1601063476271-a159c71ab0b3?auto=format&fit=crop&w=1200&q=80',
    description: 'A timeless silhouette crafted from a luxurious cashmere-wool blend, designed to drape elegantly.',
    badge: 'Fall Collection',
  },
  {
    id: 'p2',
    name: 'Tailored Linen Blazer',
    price: 285,
    category: 'Blazers',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    description: 'Breathe easy in our structured linen blazer. The perfect balance of formal and casual for warm-weather tailoring.',
  },
  {
    id: 'p3',
    name: 'Pleated Wide-Leg Trousers',
    price: 165,
    category: 'Bottoms',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: 'Flowing silhouette with a tailored waist, offering exceptional comfort without compromising on elegance.',
  },
  {
    id: 'p4',
    name: 'Minimalist Leather Tote',
    price: 320,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: 'Handcrafted from full-grain Italian leather, featuring a spacious interior and timeless minimal design.',
    badge: 'Bestseller',
  },
];

const ethnicProducts: Product[] = [
  {
    id: 'p1',
    name: 'Banarasi Silk Saree',
    price: 4999,
    category: 'Sarees',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=80',
    description: 'Exquisite Banarasi silk saree woven with gold zari threads, perfect for weddings and festive occasions.',
    badge: 'Festive Special',
  },
  {
    id: 'p2',
    name: 'Designer Bridal Lehenga',
    price: 15999,
    category: 'Lehengas',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80',
    description: 'A heavily embroidered bridal lehenga choli set with premium details and double dupatta.',
    badge: 'Bridal Collection',
  },
  {
    id: 'p3',
    name: 'Royal Anarkali Suit',
    price: 3499,
    category: 'Salwar Kameez',
    image: 'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=1200&q=80',
    description: 'Flowing floor-length Anarkali suit with intricate embroidery and a georgette dupatta.',
  },
  {
    id: 'p4',
    name: 'Handloom Cotton Saree',
    price: 1899,
    category: 'Sarees',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=80',
    description: 'Lightweight and breathable pure cotton saree, hand-woven by local artisans for everyday elegance.',
    badge: 'Handmade',
  },
];

const getProducts = (): Product[] => {
  const baseProducts = isSareeOrEthnic ? ethnicProducts : standardProducts;
  if (currencySymbol === '₹') {
    // If it's standard products but in INR, scale prices up
    if (!isSareeOrEthnic) {
      return baseProducts.map(p => {
        let inrPrice = p.price;
        if (p.id === 'p1') inrPrice = 39999;
        else if (p.id === 'p2') inrPrice = 24999;
        else if (p.id === 'p3') inrPrice = 12999;
        else if (p.id === 'p4') inrPrice = 27999;
        return { ...p, price: inrPrice };
      });
    }
    return baseProducts;
  } else {
    // If it's ethnic products but in USD, scale prices down
    if (isSareeOrEthnic) {
      return baseProducts.map(p => {
        let usdPrice = p.price;
        if (p.id === 'p1') usdPrice = 75;
        else if (p.id === 'p2') usdPrice = 249;
        else if (p.id === 'p3') usdPrice = 55;
        else if (p.id === 'p4') usdPrice = 29;
        return { ...p, price: usdPrice };
      });
    }
    return baseProducts;
  }
};

export const featuredProducts: Product[] = getProducts();


