import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html'
})
export class Cart {
  constructor(public cartService: CartService) {}
}
