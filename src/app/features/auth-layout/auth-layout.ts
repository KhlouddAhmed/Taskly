import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../shared/components/navbar/navbar';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { MobileDrawer } from '../../shared/components/mobile-drawer/mobile-drawer';
import { BottomNav } from '../../shared/components/bottom-nav/bottom-nav';

@Component({
  imports: [RouterOutlet, Navbar, Sidebar, MobileDrawer, BottomNav],
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css',
})
export class AuthLayout {
  readonly isDrawerOpen = signal(false);

  openDrawer(): void {
    this.isDrawerOpen.set(true);
  }

  closeDrawer(): void {
    this.isDrawerOpen.set(false);
  }
}