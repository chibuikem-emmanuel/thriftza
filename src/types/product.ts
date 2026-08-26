export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  condition: string;
  size: string;
  images: string[];
  videoUrl?: string;
}

export interface CartItem extends Product {
  quantity: number;
}