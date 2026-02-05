import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { Product } from '../../models/product.model';
import { PRODUCTS } from '../../constants/product';

@Injectable({ providedIn: 'root' })
export class ProductService {
  // the real API base (kept for future replacement)
  // private readonly api = '/api/products';

  constructor(private http: HttpClient) {}

  // NOTE: previous implementation used HTTP requests. We keep it commented for reference
  // getProducts(params: any): Observable<Product[]> {
  //   return this.http.get<Product[]>(this.api, { params });
  // }
  // getProductById(id: string): Observable<Product> {
  //   return this.http.get<Product>(`${this.api}/${id}`);
  // }

  // Mocked, SSR-safe server-like product fetcher using the local PRODUCTS constant.
  // Supports search, price range, brand multi-select, inStock, sorting and pagination.
  getProducts(params: any = {}): Observable<Product[]> {
    const {
      search = '',
      sort = 'newest',
      limit = 12,
      page = 1,
      priceMin,
      priceMax,
      brands,
      inStock
    } = params || {};

    const brandArr = Array.isArray(brands)
      ? brands
      : typeof brands === 'string' && brands
      ? (brands as string).split(',')
      : [];

    return of(PRODUCTS).pipe(
      map(products => {
        let list = products.slice();

        // search by name or brand
        if (search) {
          const term = (search as string).toLowerCase();
          list = list.filter(
            p => p.name.toLowerCase().includes(term) || p.brand.toLowerCase().includes(term)
          );
        }

        // price range (based on variant prices where available)
        if (priceMin != null || priceMax != null) {
          const min = priceMin != null ? Number(priceMin) : -Infinity;
          const max = priceMax != null ? Number(priceMax) : Infinity;
          list = list.filter(p => {
            const prices = p.variants?.map(v => v.price) ?? [p.basePrice];
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            return minPrice <= max && maxPrice >= min;
          });
        }

        // brands multi-select
        if (brandArr.length) {
          list = list.filter(p => brandArr.includes(p.brand));
        }

        // inStock
        if (inStock === 'true' || inStock === true) {
          list = list.filter(p => p.inStock || (p.variants?.some(v => v.stock > 0)));
        }

        // sorting
        if (sort === 'price_asc') {
          list.sort(
            (a, b) =>
              Math.min(...(a.variants?.map(v => v.price) ?? [a.basePrice])) -
              Math.min(...(b.variants?.map(v => v.price) ?? [b.basePrice]))
          );
        } else if (sort === 'price_desc') {
          list.sort(
            (a, b) =>
              Math.max(...(b.variants?.map(v => v.price) ?? [b.basePrice])) -
              Math.max(...(a.variants?.map(v => v.price) ?? [a.basePrice]))
          );
        } else {
          // newest
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        // pagination
        const start = (Number(page) - 1) * Number(limit);
        return list.slice(start, start + Number(limit));
      }),
      // simulate network latency so loading states and cancellation are observable
      delay(300)
    );
  }

  getProductById(id: string): Observable<Product | undefined> {
    console.log(PRODUCTS);
    
    const p = PRODUCTS.find(x => x.id == id);    
    return of(p);
  }
}
