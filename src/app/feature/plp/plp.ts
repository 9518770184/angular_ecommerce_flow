import {
  Component,
  ChangeDetectionStrategy,
  signal,
  effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Product } from '../../models/product.model';

@Component({
  standalone: true,
  selector: 'app-plp',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './plp.html'
})
export class Plp {
  products = signal<Product[]>([]);
  loading = signal(false);

  filters = signal({
    search: '',
    sort: 'newest',
    page: 1
  });

  private search$ = new Subject<string>();

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe(params => {
      this.filters.update(f => ({ ...f, ...params }));
      this.loadProducts();
    });

    this.search$
      .pipe(
        debounceTime(300),
        switchMap(term =>
          this.productService.getProducts({
            ...this.filters(),
            search: term
          })
        )
      )
      .subscribe(res => this.products.set(res));

    effect(() => {
      this.router.navigate([], {
        queryParams: this.filters(),
        queryParamsHandling: 'merge'
      });
    });
  }

  loadProducts() {
    this.loading.set(true);

    this.productService
      .getProducts(this.filters())
      .subscribe(res => {
        this.products.set(res);
        this.loading.set(false);
      });
  }

  onSearch(value: string) {
    this.search$.next(value);
  }

  getProductDetails(p: any){
    this.router?.navigate(['/products', p.id])
  }
}
