import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { Sidebar } from './shared/components/sidebar/sidebar';
import { BottomNav } from './shared/components/bottom-nav/bottom-nav';
import { MobileDrawer } from './shared/components/mobile-drawer/mobile-drawer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Navbar,
    Sidebar,
    BottomNav,
    MobileDrawer
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // حالة التحكم في طي السايدبار للديسكتوب
  isCollapsed = signal<boolean>(false);

  // حالة فتح قائمة الموبايل
  isMobileDrawerOpen = signal<boolean>(false);

  toggleMobileDrawer() {
    this.isMobileDrawerOpen.update(v => !v);
  }
}