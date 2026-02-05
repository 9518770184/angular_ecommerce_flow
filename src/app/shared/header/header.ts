import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header {
  status = signal<string | null>(null);

  constructor(public cart: CartService, public auth: AuthService) {}

  login() {
    this.status.set('Logging in...');
    this.auth.login().subscribe(() => {
      // on login, merge guest cart into server
      this.cart.mergeGuestCart().subscribe(() => {
        this.status.set('Logged in, cart merged');
        setTimeout(() => this.status.set(null), 1200);
      });
    });
  }

  logout() {
    this.auth.logout();
    this.status.set('Logged out');
    setTimeout(() => this.status.set(null), 1000);
  }
}
