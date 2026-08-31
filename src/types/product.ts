export interface Product {
  id: string;
  name?: string;
  title?: string;
  price: number;
  category?: string;
  condition?: string;
  size?: string;
  image?: string;
  images?: string[];
  video?: string;
  videoUrl?: string;
  video_url?: string;
}

export interface CartItem extends Product {
  quantity: number;
}