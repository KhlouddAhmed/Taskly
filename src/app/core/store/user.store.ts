import { Injectable, signal, computed, inject } from '@angular/core';
import { AuthService } from '../services/auth';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserStore {
  private auth = inject(AuthService);

  readonly user = signal<User | null>(null);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  readonly initials = computed(() => {
    const name = this.user()?.user_metadata?.full_name ?? '';
    return getInitials(name);
  });

  readonly fullName = computed(() => this.user()?.user_metadata?.full_name ?? '');
  readonly jobTitle = computed(() => this.user()?.user_metadata?.job_title ?? '');

  load(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.auth.getUser().subscribe({
      next: (u) => {
        this.user.set(u);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load user');
        this.isLoading.set(false);
      },
    });
  }
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}