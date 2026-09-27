import { Component, inject, OnInit, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStore } from '../../../core/store/user.store';


@Component({
  imports: [CommonModule],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar implements OnInit {
  readonly onMenuToggle = input<() => void>();

  protected store = inject(UserStore);

  ngOnInit(): void {
    this.store.load();
  }
}