import { Component, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product, Variant } from '../../models/product.model';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pdp.html'
})
export class Pdp {
  product!: Product;

  selectedVariant = signal<Variant | null>(null);
  adding = signal(false);

  price = computed(() =>
    this.selectedVariant()?.price ?? this.product.basePrice
  );

  inStock = computed(() =>
    (this.selectedVariant()?.stock ?? 0) > 0
  );

  constructor(
    route: ActivatedRoute,
    productService: ProductService,
    private cartService: CartService
  ) {
    productService
      .getProductById(route.snapshot.params['id'])
      .subscribe(p => (this.product = p));
  }

  addToCart() {
    if (!this.selectedVariant()) return;

    this.adding.set(true);

    setTimeout(() => {
      this.cartService.addItem({
        productId: this.product.id,
        variantId: this.selectedVariant()!.id,
        name: this.product.name,
        price: this.price(),
        quantity: 1
      });
      this.adding.set(false);
    }, 600);
  }
}
