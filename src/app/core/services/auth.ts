import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      apikey: environment.supabaseKey,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.getToken()}`,
    });
  }

  private getToken(): string {
    return (
      localStorage.getItem('access_token') ??
      sessionStorage.getItem('access_token') ??
      ''
    );
  }

  private clearSession(): void {
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token');
  }

  signUp(data: {
    email: string;
    password: string;
    full_name: string;
    job_title: string;
  }): Observable<{ access_token: string }> {
    return this.http.post<{ access_token: string }>(
      `${environment.apiUrl}/auth/v1/signup`,
      {
        email: data.email,
        password: data.password,
        data: { full_name: data.full_name, job_title: data.job_title },
      },
      { headers: this.headers }
    );
  }

  login(data: {
    email: string;
    password: string;
  }): Observable<{ access_token: string }> {
    return this.http.post<{ access_token: string }>(
      `${environment.apiUrl}/auth/v1/token?grant_type=password`,
      { email: data.email, password: data.password },
      { headers: this.headers }
    );
  }

  getUser(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/auth/v1/user`, {
      headers: this.headers,
    });
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): Observable<void> {
    return this.http
      .post<void>(`${environment.apiUrl}/auth/v1/logout`, {}, { headers: this.headers })
      .pipe(tap(() => this.clearSession()));
  }
}