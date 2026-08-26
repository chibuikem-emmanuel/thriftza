export interface Product {
  id: string | number;
  name: string;
  price: number;
  image?: string;
  category?: string;
  size?: string;
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