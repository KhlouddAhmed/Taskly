import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';

// custom validator: checks that password and confirmPassword match
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirm = control.get('confirmPassword')?.value;
  return password && confirm && password !== confirm ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
  imports: [ReactiveFormsModule, RouterLink],
})
export class SignUp {
  // injected dependencies
  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private router = inject(Router);

  // ui state signals
  showPassword = signal(false);
  showConfirm = signal(false);
  isLoading = signal(false);
  apiError = signal('');

  // reactive form definition with validation rules per field
  form = this.fb.group(
    {
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          // allows letters (any language) and single spaces between words only
          Validators.pattern(/^[\p{L}]+(?:\s[\p{L}]+)*$/u),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      jobTitle: [''],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(64),
          // requires uppercase, lowercase, digit, special char, no whitespace
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])\S+$/),
        ],
      ],
      confirmPassword: ['', Validators.required],
    },
    // group-level validator to compare password fields
    { validators: passwordMatchValidator }
  );

  // shortcut to access form controls
  get f() {
    return this.form.controls;
  }

  // returns current password value for rule checking
  get passwordValue() {
    return this.f.password.value ?? '';
  }

  // live password strength rules shown in the ui
  get passwordRules() {
    const val = this.passwordValue;
    return {
      minLength: val.length >= 8,
      upperLower: /(?=.*[a-z])(?=.*[A-Z])/.test(val),
      digit: /\d/.test(val),
      special: /[!@#$%^&*]/.test(val),
    };
  }

  // toggles password visibility
  togglePassword() {
    this.showPassword.update((v) => !v);
  }

  // toggles confirm password visibility
  toggleConfirm() {
    this.showConfirm.update((v) => !v);
  }

  onSubmit() {
    // stop submission if form is invalid and highlight all errors
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.apiError.set('');

    const { name, email, password, jobTitle } = this.form.value;

    // build api payload — job_title is optional
   const payload = {
  email: email!,
  password: password!,
  data: {
    name: name!,
    ...(jobTitle ? { department: jobTitle } : {}),
  },
};

    this.authService.signUp(payload).subscribe({
      // on success: redirect to login
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/login']);
      },
      // on failure: show api error message
      error: (err) => {
        this.isLoading.set(false);
        this.apiError.set(
          err?.error?.message ?? 'Registration failed. Please try again.'
        );
      },
    });
  }
}