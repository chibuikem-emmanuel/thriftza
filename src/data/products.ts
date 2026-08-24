// src/data/products.ts

export interface Product {
  id: string;
  name: string;
  category: 'polos' | 'trousers';
  price: number;
  condition: string;
  size: string;
  images: string[];
  videoUrl?: string;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'polo-1',
    name: 'Vintage Oversized Round Neck',
    category: 'polos',
    price: 4500,
    condition: 'Grade A',
    size: 'L',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    ],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-holding-a-black-t-shirt-41584-large.mp4',
  },
  {
    id: 'polo-2',
    name: 'Heavyweight Cotton Graphic Tee',
    category: 'polos',
    price: 4500,
    condition: 'Grade A',
    size: 'XL',
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80',
    ],
  },
  {
    id: 'polo-3',
    name: 'Minimalist Plain Round Neck',
    category: 'polos',
    price: 4500,
    condition: 'Grade A',
    size: 'M',
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
    ],
  },
  {
    id: 'trouser-1',
    name: 'Pleated Smart Tailored Trouser',
    category: 'trousers',
    price: 4500,
    condition: 'Grade A',
    size: '32',
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop&q=80',
    ],
  },
  {
    id: 'trouser-2',
    name: 'Relaxed Fit Plain Chino Trouser',
    category: 'trousers',
    price: 4500,
    condition: 'Grade A',
    size: '34',
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80',
    ],
  },
  {
    id: 'trouser-3',
    name: 'Wide Leg Straight Cut Trouser',
    category: 'trousers',
    price: 4500,
    condition: 'Grade A',
    size: '30',
    images: [
      'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&auto=format&fit=crop&q=80',
    ],
  },
];