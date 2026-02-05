import { Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { StorageService } from './storage.service';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CartItem } from '../../models/cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly STORAGE_KEY = 'guest_cart';

  cart = signal<CartItem[]>([]);

  constructor(private storage: StorageService) {
    const stored = this.storage.get<CartItem[]>(this.STORAGE_KEY); // get value from loaclStorage
    // we can call api for get data here 
    if (stored) this.cart.set(stored);
  }

  addItem(item: CartItem) {
    this.cart.update(items => [...items, item]);
    this.persist();
  }

  updateQuantity(productId: string, quantity: number) {
    const snapshot = this.cart();

    this.cart.update(items =>
      items.map(i =>
        i.productId === productId ? { ...i, quantity } : i
      )
    );

    this.fakeBackend(quantity).subscribe({
      error: () => this.cart.set(snapshot)
    });

    this.persist();
  }

  private persist() {
    this.storage.set(this.STORAGE_KEY, this.cart());
  }

  private fakeBackend(qty: number) {
    return qty > 5
      ? throwError(() => new Error('Out of stock'))
      : of(true).pipe(delay(400));
  }
}
