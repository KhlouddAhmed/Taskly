import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'sign-up',
    loadComponent: () =>
      import('./features/auth/sign-up/sign-up').then(
        (m) => m.SignUp
      ),
  },
  {
    path: '',
    redirectTo: 'sign-up',
    pathMatch: 'full',
  },
];