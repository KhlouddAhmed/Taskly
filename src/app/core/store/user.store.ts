import { Injectable, signal, computed, inject } from '@angular/core';
import { AuthService } from '../services/auth';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserStore {
  private auth = inject(AuthService);

  // raw state
  readonly user = signal<User | null>(null);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  // derived state  (all user display values)
  readonly userMeta = computed(() => {
    const meta = this.user()?.user_metadata;
    const name = meta?.full_name ?? '';
    return {
      fullName: name,
      jobTitle: meta?.job_title ?? '',
      initials: getInitials(name),
    };
  });

  // shortcuts so the template stays clean
  readonly fullName = computed(() => this.userMeta().fullName);
  readonly jobTitle = computed(() => this.userMeta().jobTitle);
  readonly initials = computed(() => this.userMeta().initials);

  load(): void {
    if (this.isLoading()) return; // prevent duplicate calls
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

//helper function
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}