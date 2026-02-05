import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly api = '/api/products';

  constructor(private http: HttpClient) {}

  getProducts(params: any): Observable<Product[]> {
    return this.http.get<Product[]>(this.api, { params });
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.api}/${id}`);
  }
}
