import { Component, input, output, signal, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { ToastService } from '../../../core/services/toast';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-mobile-drawer',
  styleUrl: './mobile-drawer.css',
  templateUrl: './mobile-drawer.html',
})
export class MobileDrawer {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  readonly isOpen = input.required<boolean>();
  readonly close = output<void>();
  readonly isLoggingOut = signal(false);

  readonly navItems = [
    { label: 'Projects', icon: 'icons/projects.svg', route: '/projects' },
    { label: 'My Statistics', icon: 'icons/statistics.svg', route: '/statistics' },
  ];

  readonly projectLinks = [
    { label: 'Epics', icon: 'icons/epics.svg', route: '/project/epics' },
    { label: 'Tasks', icon: 'icons/tasks.svg', route: '/project/tasks' },
    { label: 'Members', icon: 'icons/members.svg', route: '/project/members' },
    { label: 'Details', icon: 'icons/details.svg', route: '/project/details' },
  ];

  isProjectOpen = true;

  toggleProject(): void {
    this.isProjectOpen = !this.isProjectOpen;
  }

  performLogout(): void {
    if (this.isLoggingOut()) return;
    this.isLoggingOut.set(true);
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        this.isLoggingOut.set(false);
        this.toastService.show('Logout failed, please try again.');
      },
    });
  }
}