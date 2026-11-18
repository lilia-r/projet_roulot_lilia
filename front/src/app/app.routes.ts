import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { unsavedChangesGuard } from './core/guards/unsaved-changes.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'pollutions', pathMatch: 'full' },
  {
    path: 'pollutions',
    canActivate: [authGuard],
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () =>
      import('./components/pollution/pollution').then((m) => m.PollutionComponent),
  },
  {
    path: 'signup',
    loadComponent: () => import('./signup/signup').then((m) => m.SignupComponent),
  },
  { path: '**', redirectTo: 'pollutions' },
];
