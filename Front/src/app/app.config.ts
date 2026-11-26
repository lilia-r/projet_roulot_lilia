import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngxs/store';
import { withNgxsStoragePlugin } from '@ngxs/storage-plugin';
import { routes } from './app.routes';
import { AuthState } from './store/auth.state';

// Configuration globale de l'application Angular (services accessibles partout)
export const appConfig: ApplicationConfig = {
  providers: [
    // Mode "zoneless" : Angular ne surveille plus tous les événements du navigateur via Zone.js.
    // L'écran ne se rafraîchit que quand un signal change ou qu'un composant OnPush le demande -> meilleures performances.
    provideZonelessChangeDetection(),
    // Active le routeur Angular avec les routes définies dans app.routes.ts
    provideRouter(routes),
    // Permet d'injecter HttpClient dans les services pour appeler l'API backend
    provideHttpClient(),
    // Enregistre le Store NGXS (AuthState) et persiste automatiquement la clé "auth" dans le localStorage (survit à F5)
    provideStore([AuthState], withNgxsStoragePlugin({ keys: ['auth'] })),
  ],
};
