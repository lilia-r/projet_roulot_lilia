import { CanDeactivateFn } from '@angular/router';

// Contrat (interface) que doit respecter tout composant protégé par ce guard :
// il doit fournir une méthode hasUnsavedChanges() qui indique si le formulaire est en cours de saisie.
export interface CanComponentDeactivate {
  hasUnsavedChanges: () => boolean;
}

// Guard fonctionnel (CanDeactivateFn) : exécuté AVANT de quitter une route.
// Utile pour éviter de perdre un formulaire à moitié rempli (ex: clic accidentel sur Déconnexion).
export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (component) => {
  // Si le composant signale des modifications non enregistrées, on demande confirmation à l'utilisateur
  if (component.hasUnsavedChanges && component.hasUnsavedChanges()) {
    return confirm(
      'Vous avez un signalement en cours de saisie. Voulez-vous vraiment quitter la page ?',
    );
  }
  // Sinon, on laisse quitter la page sans bloquer
  return true;
};
