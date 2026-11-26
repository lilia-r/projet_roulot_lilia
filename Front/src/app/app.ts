import {
  Component,
  inject,
  HostListener,
  ChangeDetectionStrategy,
  signal,
  computed,
} from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from './store/auth.state';
import { Logout } from './store/auth.actions';

// Composant racine (shell global) : contient la barre du haut, le fond interactif et le <router-outlet>
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  // Stratégie OnPush : évite de revérifier toute l'application à chaque événement (notamment les mouvements de souris).
  // L'affichage ne se met à jour que quand un signal utilisé dans le HTML change.
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private router = inject(Router);
  // Injection du Store NGXS pour lire l'état d'authentification et dispatcher Logout
  private store = inject(Store);
  title = 'projet_roulot_lilia';

  // Signaux pour la position de la souris (utilisés par les variables CSS du fond laser).
  // Avec des signaux + OnPush, seul le style CSS concerné est mis à jour, pas les composants enfants.
  mouseX = signal(50);
  mouseY = signal(50);
  cursorPxX = signal(-500);
  cursorPxY = signal(-500);

  // Sélecteurs NGXS exposés en signaux : la topbar réagit automatiquement à Login / Logout et au rechargement (F5)
  readonly isLoggedIn = this.store.selectSignal(AuthState.isAuthenticated);
  private readonly username = this.store.selectSignal(AuthState.username);

  // Signal dérivé (computed) : met en majuscules le nom de l'utilisateur lu depuis le Store NGXS
  readonly operatorName = computed(() => {
    const name = this.username();
    return (name || 'INVITÉ').toUpperCase();
  });

  // Écoute les déplacements de la souris sur la fenêtre pour piloter l'effet laser du fond
  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.cursorPxX.set(event.clientX);
    this.cursorPxY.set(event.clientY);
    this.mouseX.set((event.clientX / window.innerWidth) * 100);
    this.mouseY.set((event.clientY / window.innerHeight) * 100);
  }

  // Déconnexion sécurisée : on tente d'abord de naviguer vers /signup.
  // Si unsavedChangesGuard bloque la sortie (l'utilisateur clique sur "Annuler"), on ne dispatche pas Logout !
  async logout(): Promise<void> {
    const navigated = await this.router.navigate(['/signup']);
    if (navigated) {
      this.store.dispatch(new Logout());
    }
  }
}
