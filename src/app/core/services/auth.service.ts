import { Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // simple logged-in signal (false = guest)
  loggedIn = signal(false);

  // Simulate login process
  login() {
    return of(true).pipe(
      delay(500),
      tap(() => this.loggedIn.set(true))
    );
  }

  logout() {
    this.loggedIn.set(false);
  }
}
