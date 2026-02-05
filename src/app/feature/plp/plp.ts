import {
  Component,
  ChangeDetectionStrategy,
  signal,
  effect,
  computed,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { Subject, fromEvent, Subscription } from 'rxjs';
import { Product } from '../../models/product.model';
import { PRODUCTS } from '../../constants/product';

interface Filters {
  search: string;
  sort: 'newest' | 'price_asc' | 'price_desc';
  limit: number;
  page: number;
  priceMin: number | null;
  priceMax: number | null;
  brands: string[];
  inStock: boolean;
}

@Component({
  standalone: true,
  selector: 'app-plp',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './plp.html',
  styleUrls: ['./plp.scss']
})
export class Plp implements OnDestroy {
  // Products to render
  products = signal<Product[]>(PRODUCTS);
  loading = signal(false);

  filters = signal<Filters>({
    search: '',
    sort: 'newest',
    limit: 12,
    page: 1,
    priceMin: null,
    priceMax: null,
    brands: [],
    inStock: false
  });

  // available brands derived from static PRODUCTS (used for UI)
  brandsList = computed(() => Array.from(new Set(PRODUCTS.map(p => p.brand))));

  private filters$ = new Subject<Filters>();
  private scrollSub?: Subscription;
  private subs = new Subscription();

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Restore filters from URL (and normalize types)
    // this.route.queryParams.subscribe(params => {
    //   const normalized: any = { ...params };
    //   if (params['page']) normalized.page = Number(params['page']);
    //   if (params['limit']) normalized.limit = Number(params['limit']);
    //   if (params['inStock']) normalized.inStock = params['inStock'] === 'true' || params['inStock'] === true;
    //   if (params['brands']) {
    //     normalized.brands = Array.isArray(params['brands']) ? params['brands'] : String(params['brands']).split(',').filter(Boolean);
    //   }
    //   if (params['priceMin']) normalized.priceMin = Number(params['priceMin']);
    //   if (params['priceMax']) normalized.priceMax = Number(params['priceMax']);

    //   this.filters.update(f => ({ ...f, ...normalized } as any));

    //   // trigger load with restored filters
    //   // set loading immediately so UI shows loading state prior to debounced fetch
    //   this.loading.set(true);
    //   console.debug('PLP: restored filters', this.filters());
    //   this.filters$.next({ ...this.filters() });
    // });

    // Listen to filter changes and run debounced, cancellable requests
    this.subs.add(
      this.filters$
        .pipe(
          debounceTime(250),
          tap(() => this.loading.set(true)),
          switchMap(f => this.productService.getProducts(f).pipe(tap(() => this.loading.set(false))))
        )
        .subscribe(res => {
          console.debug('PLP: products fetched', res);
          // replace when page === 1, append otherwise (infinite scroll)
          if (this.filters().page > 1) {
            this.products.update(curr => [...curr, ...res]);
          } else {
            this.products.set(res);
          }
          // ensure loading is cleared after results
          this.loading.set(false);
        })
    );

    // Keep URL in sync with filters
    effect(() => {
      this.router.navigate([], {
        queryParams: this.filters(),
        queryParamsHandling: 'merge'
      });
    });

    // // infinite scroll (only in browser)
    // if (typeof window !== 'undefined') {
    //   this.scrollSub = fromEvent(window, 'scroll').subscribe(() => {
    //     const threshold = 120;
    //     if (window.innerHeight + window.scrollY >= document.body.offsetHeight - threshold && !this.loading()) {
    //       this.loadMore();
    //     }
    //   });
    //   this.subs.add(this.scrollSub);
    // }

    // initial load if no query params
    if (!Object.keys(this.route.snapshot.queryParams).length) {
      // ensure immediate loading indicator
      this.loading.set(true);
      console.debug('PLP: initial load with default filters', this.filters());
      this.filters$.next({ ...this.filters() });
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  // Called from UI when a filter changes. Reset page to 1 to initiate fresh query
  applyFilters(partial: Partial<Filters>) {

    console.log(partial);
    
    this.filters.update(f => ({ ...f, ...partial, page: 1 } as any));
    this.filters$.next({ ...this.filters() });
  }

  onBrandToggle(brand: string, checked: boolean) {
    const current = this.filters().brands || [];
    const next = checked ? [...current, brand] : current.filter(b => b !== brand);
    this.applyFilters({ brands: next });
  }

  loadMore() {
    this.filters.update(f => ({ ...f, page: (f.page || 1) + 1 } as any));
    this.filters$.next({ ...this.filters() });
  }

  onSearch(value: string) {
    this.applyFilters({ search: value });
  }

  productHasStock(p: Product) {
    return p.inStock || (p.variants?.some(v => v.stock > 0) ?? false);
  }

  // Open PDP
  getProductDetails(p: any){
    this.router?.navigate(['/products', p.id]);
  }
}
