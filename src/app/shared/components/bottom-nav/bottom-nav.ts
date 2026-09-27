import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './bottom-nav.html',
  styleUrl: './bottom-nav.css',
})
export class BottomNav {
  readonly items = [
    { label: 'Epics', icon: 'icons/epics.svg', route: '/project/epics' },
    { label: 'Tasks', icon: 'icons/tasks.svg', route: '/project/tasks' },
    { label: 'Projects', icon: 'icons/projects.svg', route: '/projects' },
    { label: 'Members', icon: 'icons/members.svg', route: '/project/members' },
    { label: 'Details', icon: 'icons/details.svg', route: '/project/details' },
  ];
}