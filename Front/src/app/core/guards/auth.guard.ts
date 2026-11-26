import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from '../../store/auth.state';

// Guard fonctionnel (CanActivateFn) : exécuté par le routeur AVANT d'ouvrir une route protégée.
// Il lit l'état d'authentification directement dans le Store NGXS.
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const store = inject(Store);

  // Lecture synchrone (snapshot) du sélecteur isAuthenticated dans le Store NGXS
  const isAuthenticated = store.selectSnapshot(AuthState.isAuthenticated);

  if (isAuthenticated) {
    return true; // Accès autorisé
  }

  // Retourner un UrlTree est la façon propre en Angular de rediriger depuis un guard
  // (évite les navigations concurrentes et annule l'accès à /pollutions)
  return router.createUrlTree(['/signup']);
};
