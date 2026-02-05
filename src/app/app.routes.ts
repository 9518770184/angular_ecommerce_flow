import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },

  {
    path: 'products',
    loadComponent: () =>
      import('./feature/plp/plp').then(m => m.Plp)
  },

  {
    path: 'products/:id',
    loadComponent: () =>
      import('./feature/pdp/pdp').then(m => m.Pdp)
  },

  {
    path: 'cart',
    loadComponent: () =>
      import('./feature/cart/cart').then(m => m.Cart)
  }
];
