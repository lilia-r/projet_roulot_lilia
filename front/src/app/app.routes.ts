import { Routes } from '@angular/router';

export const routes: Routes = [
  // Redirection par défaut vers la page des pollutions
  { path: '', redirectTo: 'pollutions', pathMatch: 'full' },

  // Lazy Loading : PollutionComponent n'est téléchargé qu'à l'accès à /pollutions
  {
    path: 'pollutions',
    loadComponent: () =>
      import('./components/pollution/pollution').then((m) => m.PollutionComponent),
  },

  // Lazy Loading : Signup n'est téléchargé que si l'utilisateur va sur /signup
  {
    path: 'signup',
    loadComponent: () => import('./components/signup/signup').then((m) => m.Signup),
  },

  // Route joker (Wildcard) : intercepte toute URL inconnue
  { path: '**', redirectTo: 'pollutions' },
];
