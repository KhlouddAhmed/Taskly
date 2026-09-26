import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SignUpPayload {
  email: string;
  password: string;
  data: {
    name: string;
    department?: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private apiKey = environment.apiKey;

  signUp(payload: SignUpPayload): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/auth/v1/signup`, payload, {
      headers: {
        'Content-Type': 'application/json',
        apikey: this.apiKey,
      },
    });
  }
}