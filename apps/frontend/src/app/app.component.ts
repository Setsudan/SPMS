import { AuthService } from './services/auth/auth.service';
import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'SPMS';

  constructor(private router: Router, private authService: AuthService) {}

    isLoginOrRegister(): boolean {
      return this.router.url === '/login' || this.router.url === '/register';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
