import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  showPassword = signal(false);
  isLoading = signal(false);
  apiError = signal('');

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    rememberMe: [false],
  });

  get f() {
    return this.form.controls;
  }

  togglePassword() {
    this.showPassword.update((v) => !v);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.apiError.set('');

    const { email, password, rememberMe } = this.form.value;

    this.authService.login({ email: email!, password: password! }).subscribe({
      next: (res: { access_token: string }) => {
        this.isLoading.set(false);

        if (rememberMe) {
          const expiry = Date.now() + 30 * 24 * 60 * 60 * 1000;
          localStorage.setItem('access_token', res.access_token);
          localStorage.setItem('token_expiry', expiry.toString());
        } else {
          sessionStorage.setItem('access_token', res.access_token);
        }

        this.router.navigate(['/projects']);
      },
      error: (err: { error?: { error_description?: string } }) => {
        this.isLoading.set(false);
        this.apiError.set(
          err?.error?.error_description ?? 'Invalid email or password.'
        );
      },
    });
  }
}