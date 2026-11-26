import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SignUpPayload, SignUpResponse } from '../models/user.model';

// Forme des données utilisateur enregistrées en session locale
export interface UserSession {
  id?: number;
  name: string;
  email: string;
}

const SESSION_STORAGE_KEY = 'user_session';

// Service partagé dans toute l'app (providedIn: 'root') :
// gère l'appel d'inscription à l'API et garde en mémoire l'état de connexion de l'utilisateur
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  // Pointe vers POST https://.../api/signup
  private apiUrl = `${environment.apiUrl}/signup`;

  // Signal privé contenant l'utilisateur connecté (initialisé depuis le localStorage au démarrage)
  private sessionSignal = signal<UserSession | null>(this.readStoredSession());

  // Version lecture seule exposée aux composants pour éviter des modifications sauvages hors du service
  readonly currentUser = this.sessionSignal.asReadonly();
  // Signal booléen calculé automatiquement : true si un utilisateur est connecté, false sinon
  readonly isLoggedIn = computed(() => this.sessionSignal() !== null);

  // Envoie le formulaire d'inscription au backend et retourne un Observable avec la réponse
  signUp(payload: SignUpPayload): Observable<SignUpResponse> {
    return this.http.post<SignUpResponse>(this.apiUrl, payload);
  }

  // Sauvegarde la session après une inscription validée par l'API et prévient tous les composants abonnés
  setSession(user: UserSession): void {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    this.sessionSignal.set(user);
  }

  // Supprime la session lors de la déconnexion et remet le signal à null
  clearSession(): void {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    this.sessionSignal.set(null);
  }

  // Utilisé par authGuard : revérifie le localStorage pour s'assurer que la session est toujours présente et valide
  hasValidSession(): boolean {
    const stored = this.readStoredSession();
    const current = this.sessionSignal();
    // Synchronise le signal si le localStorage a été vidé ou modifié manuellement
    if (!stored && current !== null) {
      this.sessionSignal.set(null);
    } else if (stored && (current?.email !== stored.email || current?.name !== stored.name)) {
      this.sessionSignal.set(stored);
    }
    return stored !== null;
  }

  // Lit et contrôle la structure JSON de la session (un texte vide ou invalide est rejeté et nettoyé)
  private readStoredSession(): UserSession | null {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (
        parsed &&
        typeof parsed === 'object' &&
        typeof parsed.email === 'string' &&
        parsed.email.trim().length > 0 &&
        typeof parsed.name === 'string' &&
        parsed.name.trim().length > 0
      ) {
        return parsed as UserSession;
      }
    } catch {
      // Si le JSON est corrompu, on supprime l'entrée invalide
    }
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}
