import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html'
})
export class Cart {
  error = signal<string | null>(null);
  subtotal = computed(() => this.cartService.cart().reduce((s, i) => s + i.price * i.quantity, 0));

  constructor(public cartService: CartService, private router: Router) { }

  updateQty(item: any, qty: number) {
    if (qty < 1) return;

    this.error.set(null);
    this.cartService.updateQuantity(item.productId, qty).subscribe({
      next: () => {
        // success
      },
      error: (err) => {
        this.error.set(err?.message || 'Failed to update quantity');
      }
    });
  }

  homePage() {
    this.router.navigate(['/products']);
  }
}
