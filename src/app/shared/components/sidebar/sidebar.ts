import { Component, signal, inject, HostListener, ElementRef } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { ToastService } from '../../../core/services/toast';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

interface ProjectLink {
  label: string;
  icon: string;
  route: string;
}

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-sidebar',
  styleUrl: './sidebar.css',
  templateUrl: './sidebar.html',
})
export class Sidebar {
  private el = inject(ElementRef);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  readonly isCollapsed = signal(false);
  readonly isProjectOpen = signal(true);
  readonly isPopupOpen = signal(false);
  readonly isLoggingOut = signal(false);

  readonly navItems: NavItem[] = [
    { label: 'Projects', icon: 'icons/projects.svg', route: '/projects' },
    { label: 'My Statistics', icon: 'icons/statistics.svg', route: '/statistics' },
  ];

  readonly projectLinks: ProjectLink[] = [
    { label: 'Epics', icon: 'icons/epics.svg', route: '/project/epics' },
    { label: 'Tasks', icon: 'icons/tasks.svg', route: '/project/tasks' },
    { label: 'Members', icon: 'icons/members.svg', route: '/project/members' },
    { label: 'Details', icon: 'icons/details.svg', route: '/project/details' },
  ];

  toggle(): void {
    this.isCollapsed.update((v) => !v);
    if (this.isCollapsed()) this.isPopupOpen.set(false);
  }

  toggleProject(): void {
    this.isProjectOpen.update((v) => !v);
  }

  togglePopup(): void {
    this.isPopupOpen.update((v) => !v);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.isPopupOpen.set(false);
    }
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

//   performLogout(): void {
//   this.toastService.show('Logout failed, please try again.');
// }
}