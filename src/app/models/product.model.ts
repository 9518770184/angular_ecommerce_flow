export interface Variant {
  id: string;
  color: string;
  size: string;
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  basePrice: number;
  createdAt: string;
  inStock: boolean;
  variants: Variant[];
}
