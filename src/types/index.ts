export interface Product {
  id: string | number;
  name?: string;
  title?: string;
  price: number;
  image?: string;
  images?: string[];
  category?: string;
  size?: string;
  selectedSize?: string;
  condition?: string;
  video?: string;
  video_url?: string;
  description?: string;
  quantity?: number;
}

export interface User {
  id?: string | number;
  email: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  phone_number?: string;
}