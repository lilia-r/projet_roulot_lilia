import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { unsavedChangesGuard } from './core/guards/unsaved-changes.guard';

// Configuration des routes de l'application (navigation entre les pages)
export const routes: Routes = [
  // Par défaut, si l'URL est vide, on redirige vers /pollutions (qui sera vérifiée par authGuard)
  { path: '', redirectTo: 'pollutions', pathMatch: 'full' },
  {
    path: 'pollutions',
    // canActivate bloque l'accès à la page si l'utilisateur n'est pas connecté (redirige vers /signup)
    canActivate: [authGuard],
    // canDeactivate demande confirmation avant de quitter si un formulaire est en cours de saisie
    canDeactivate: [unsavedChangesGuard],
    // Lazy loading : le code de PollutionComponent n'est téléchargé par le navigateur
    // qu'au moment où l'utilisateur accède vraiment à /pollutions (démarrage plus rapide)
    loadComponent: () =>
      import('./components/pollution/pollution').then((m) => m.PollutionComponent),
  },
  {
    path: 'signup',
    // Lazy loading également pour la page d'inscription : séparée dans son propre fichier JS au build
    loadComponent: () => import('./signup/signup').then((m) => m.SignupComponent),
  },
  // Route joker : toute URL inconnue renvoie vers /pollutions au lieu d'afficher une page vide
  { path: '**', redirectTo: 'pollutions' },
];
