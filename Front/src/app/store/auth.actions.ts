// Action déclenchée lors de la connexion de l'utilisateur avec ses informations (profil simulé)
export class Login {
  static readonly type = '[Auth] Login';

  constructor(public payload: { email: string; nom: string }) {}
}

// Action déclenchée lors de la déconnexion pour remettre l'état de session à zéro
export class Logout {
  static readonly type = '[Auth] Logout';
}
