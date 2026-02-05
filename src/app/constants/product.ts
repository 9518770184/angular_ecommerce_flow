import { Product } from '../models/product.model';

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Nike Air T-Shirt',
    brand: 'Nike',
    basePrice: 999,
    createdAt: '2024-12-10',
    inStock: true,
    variants: [
      { id: 'p1v1', color: 'Black', size: 'M', price: 999, stock: 5 },
      { id: 'p1v2', color: 'Black', size: 'L', price: 1099, stock: 2 },
      { id: 'p1v3', color: 'White', size: 'M', price: 999, stock: 0 }
    ]
  },
  {
    id: 'p2',
    name: 'Adidas Running Shoes',
    brand: 'Adidas',
    basePrice: 3499,
    createdAt: '2025-01-05',
    inStock: true,
    variants: [
      { id: 'p2v1', color: 'Blue', size: '8', price: 3499, stock: 4 },
      { id: 'p2v2', color: 'Blue', size: '9', price: 3499, stock: 0 },
      { id: 'p2v3', color: 'Black', size: '8', price: 3699, stock: 3 }
    ]
  },
  {
    id: 'p3',
    name: 'Puma Casual Hoodie',
    brand: 'Puma',
    basePrice: 1999,
    createdAt: '2024-11-20',
    inStock: false,
    variants: [
      { id: 'p3v1', color: 'Grey', size: 'M', price: 1999, stock: 0 },
      { id: 'p3v2', color: 'Grey', size: 'L', price: 2099, stock: 0 }
    ]
  },
  {
    id: 'p4',
    name: 'Levi’s Slim Fit Jeans',
    brand: 'Levi’s',
    basePrice: 2799,
    createdAt: '2025-01-15',
    inStock: true,
    variants: [
      { id: 'p4v1', color: 'Blue', size: '32', price: 2799, stock: 6 },
      { id: 'p4v2', color: 'Black', size: '34', price: 2899, stock: 1 }
    ]
  },
  {
    id: 'p5',
    name: 'HRX Training Shorts',
    brand: 'HRX',
    basePrice: 799,
    createdAt: '2025-02-01',
    inStock: true,
    variants: [
      { id: 'p5v1', color: 'Navy', size: 'M', price: 799, stock: 10 },
      { id: 'p5v2', color: 'Navy', size: 'L', price: 849, stock: 7 }
    ]
  },
  {
    id: 'p6',
    name: 'Reebok Sports Cap',
    brand: 'Reebok',
    basePrice: 599,
    createdAt: '2024-10-05',
    inStock: true,
    variants: [
      { id: 'p6v1', color: 'Red', size: 'Free', price: 599, stock: 12 },
      { id: 'p6v2', color: 'Black', size: 'Free', price: 599, stock: 0 }
    ]
  }
];
