import { Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { StorageService } from './storage.service';
import { of, throwError, Observable } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { CartItem } from '../../models/cart.model';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly STORAGE_KEY = 'guest_cart';

  cart = signal<CartItem[]>([]);

  constructor(private storage: StorageService, private auth: AuthService) {
    const stored = this.storage.get<CartItem[]>(this.STORAGE_KEY); // get value from localStorage
    // initialize from guest storage
    if (stored) this.cart.set(stored);

    // Optionally, if user is already logged in on init, we could fetch server cart here
    // if (this.auth.loggedIn()) { this.fetchServerCart().subscribe(c => this.cart.set(c)); }
  }

  addItem(item: CartItem) {
    // merge with existing item if same product+variant
    const existing = this.cart().find(i => i.productId === item.productId && i.variantId === item.variantId);
    if (existing) {
      this.updateQuantity(item.productId, existing.quantity + item.quantity).subscribe({
        next: () => {},
        error: () => {}
      });
      return;
    }

    this.cart.update(items => [...items, item]);
    this.persist();
  }

  /**
   * Merge guest cart into backend cart (simulation).
   * Call this when the user logs in. This returns an observable so caller can wait
   * for completion and then clear any guest storage (simulated here).
   */
  mergeGuestCart(): Observable<boolean> {
    const guest = this.storage.get<CartItem[]>(this.STORAGE_KEY) || this.cart();

    // Simulate server merge: assume server returns merged cart (we'll just echo guest for demo)
    return of(true).pipe(
      delay(300),
      tap(() => {
        // simulate clearing guest cart from storage after merge
        this.storage.remove(this.STORAGE_KEY);
        // set cart to server version (here, same as guest)
        this.cart.set(guest);
        // After merging, don't persist to localStorage since user is logged in
      })
    );
  }

  updateQuantity(productId: string, quantity: number): Observable<boolean> {
    const snapshot = this.cart();

    // optimistic update
    this.cart.update(items =>
      items.map(i =>
        i.productId === productId ? { ...i, quantity } : i
      )
    );

    const obs = this.fakeBackend(quantity).pipe(
      tap({
        error: () => {
          // rollback
          this.cart.set(snapshot);
        }
      })
    );

    // persist locally only if guest
    this.persist();
    return obs;
  }

  private persist() {
    // only persist guest cart to localStorage
    if (!this.auth.loggedIn()) {
      this.storage.set(this.STORAGE_KEY, this.cart());
    }
  }

  private fakeBackend(qty: number) {
    return qty > 5
      ? throwError(() => new Error('Out of stock'))
      : of(true).pipe(delay(400));
  }
}
