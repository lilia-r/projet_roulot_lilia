// Profil de l'utilisateur connecté stocké dans le Store NGXS
export interface UserProfile {
  id: number;
  email: string;
  nom: string;
  role: string;
}

// Modèle de l'état d'authentification géré par AuthState
export interface AuthStateModel {
  user: UserProfile | null;
  isAuthenticated: boolean;
}
