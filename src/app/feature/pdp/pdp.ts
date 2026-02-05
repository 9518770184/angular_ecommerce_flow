import { Component, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product, Variant } from '../../models/product.model';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pdp.html',
  styleUrls: ['./pdp.scss']
})
export class Pdp {
  product?: Product;

  selectedVariant = signal<Variant | null>(null);
  adding = signal(false);

  price = computed(() =>
    this.selectedVariant()?.price ?? this.product?.basePrice ?? 0
  );

  inStock = computed(() =>
    (this.selectedVariant()?.stock ?? 0) > 0
  );

  // show a simple offer/discount badge when variant price is lower than basePrice
  discount = computed(() => {
    const prod = this.product;
    if (!prod) return null;
    const price = this.selectedVariant()?.price ?? prod.basePrice ?? 0;
    const diff = (prod.basePrice ?? 0) - price;
    if (diff <= 0) return null;
    return Math.round((diff / (prod.basePrice ?? price)) * 100) + '% off';
  });

  // helper: list of distinct colors for product (for a future color swatch UI)
  availableColors = computed(() => {
    return Array.from(new Set(this.product?.variants?.map(v => v.color) ?? []));
  });


  constructor(
    route: ActivatedRoute,
    productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {
    // Previously we only set the product directly:
    // productService.getProductById(route.snapshot.params['id']).subscribe(p => (this.product = p));

    // Enhanced: set product, choose a sensible default variant (first in-stock or first),
    // and keep the UI reactive (so price & stock update immediately when product resolves).
    productService
      .getProductById(route.snapshot.params['id'])
      .subscribe(p => {
        this.product = p;

        // choose a default variant: prefer in-stock variant
        const defaultVariant = p?.variants?.find(v => v.stock > 0) ?? p?.variants?.[0] ?? null;
        this.selectedVariant.set(defaultVariant ?? null);
      });
  }

  addToCart() {
    // guard for missing product/variant
    if (!this.selectedVariant() || !this.product) return;

    this.adding.set(true);

    setTimeout(() => {
      this.cartService.addItem({
        productId: this.product!.id,
        variantId: this.selectedVariant()!.id,
        name: this.product!.name,
        price: this.price(),
        quantity: 1
      });
      this.adding.set(false);
    }, 600);
  }

  getProductVariantColor(product: any) {
    return new Set(product?.variants.map((v: any) => v.color));
  }

  homePage() {
    this.router.navigate(['/products']);
  }
}
