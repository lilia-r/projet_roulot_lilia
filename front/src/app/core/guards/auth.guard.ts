import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  // Vérifie si un utilisateur ou un token est enregistré en session
  const isAuthenticated = !!localStorage.getItem('user_session');

  if (isAuthenticated) {
    return true;
  }

  // Redirection propre vers la page de connexion/inscription si non connecté
  return router.createUrlTree(['/signup']);
};
