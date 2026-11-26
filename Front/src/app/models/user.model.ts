export interface User {
  // Données qui décrivent un utilisateur dans l'application.
  id?: number;
  username?: string;
  name?: string;
  email: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Données envoyées au serveur lors de la création d'un compte.
export interface SignUpPayload {
  name: string;
  email: string;
  password?: string;
}

// Forme de la réponse renvoyée après une inscription réussie.
export interface SignUpResponse {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}
