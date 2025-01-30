import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthResponse } from '../../models/types';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL =`${environment.API_URL}` + 'auth';
  private http = inject(HttpClient);
  private router = inject(Router);
  private storageKey = 'access_token';
  private authStatus = new BehaviorSubject<boolean>(this.hasToken());

  constructor() {
    this.loadUserFromSession();
  }

  isAuthenticated(): boolean {
    return this.authStatus.value;
  }

  private hasToken(): boolean {
    return !!sessionStorage.getItem(this.storageKey);
  }

  getAuthStatus(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.storageKey);
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // 🔑 Login user (FIXED)
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, { email, password }).pipe(
      tap(response => {
        if (response.access_token) {
          sessionStorage.setItem('access_token', response.access_token);
          this.authStatus.next(true);
          this.router.navigate(['/home']);
        }
      })
    );
  }

  // 📌 Register new user (FIXED)
  register(userData: { firstName: string; lastName: string; email: string; password: string; gradeId: string }): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, userData).pipe(
      tap((response: AuthResponse) => {
        if (response.access_token) {
          sessionStorage.setItem('access_token', response.access_token);
          this.authStatus.next(true);
          this.router.navigate(['/home']);
        }
      })
    );
  }

  // 🏠 Logout user
  logout(): void {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('user');
    this.authStatus.next(false);
    this.router.navigate(['/login']);
  }

  // ✅ Load user session on app start
  private loadUserFromSession() {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      this.authStatus.next(true);
    }
  }
}
