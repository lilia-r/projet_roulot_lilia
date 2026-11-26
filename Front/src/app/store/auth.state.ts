import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Login, Logout } from './auth.actions';
import { AuthStateModel, UserProfile } from './auth.model';

// État initial par défaut (utilisateur non connecté)
const DEFAULT_AUTH_STATE: AuthStateModel = {
  user: null,
  isAuthenticated: false,
};

// Store NGXS dédié à l'authentification : sauvegardé automatiquement dans localStorage sous la clé "auth"
@State<AuthStateModel>({
  name: 'auth',
  defaults: DEFAULT_AUTH_STATE,
})
@Injectable()
export class AuthState {
  // Sélecteur mémorisé : retourne le profil complet de l'utilisateur (ou null)
  @Selector()
  static user(state: AuthStateModel): UserProfile | null {
    return state.user;
  }

  // Sélecteur mémorisé : indique si une session est actuellement active
  @Selector()
  static isAuthenticated(state: AuthStateModel): boolean {
    return state.isAuthenticated;
  }

  // Sélecteur mémorisé : retourne uniquement le nom de l'utilisateur connecté (ou null)
  @Selector()
  static username(state: AuthStateModel): string | null {
    return state.user?.nom ?? null;
  }

  // Reducer pour [Auth] Login : crée le profil simulé et passe isAuthenticated à true
  @Action(Login)
  login(ctx: StateContext<AuthStateModel>, action: Login): void {
    const profile: UserProfile = {
      id: Date.now(),
      email: action.payload.email.trim(),
      nom: action.payload.nom.trim(),
      role: 'operator',
    };

    ctx.patchState({
      user: profile,
      isAuthenticated: true,
    });
  }

  // Reducer pour [Auth] Logout : réinitialise la session à son état par défaut
  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>): void {
    ctx.setState(DEFAULT_AUTH_STATE);
  }
}
