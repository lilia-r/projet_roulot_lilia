export interface Pollution {
  // Informations principales affichées pour un signalement.
  id: number;
  titre: string;
  type: string;
  description?: string;
  lieu: string;
  // Informations complémentaires, présentes seulement si elles sont disponibles.
  dateObservation?: string;
  latitude?: number;
  longitude?: number;
  photoUrl?: string;
  level?: number;
  title?: string;
  location?: string;
  createdAt?: string;
  updatedAt?: string;
}
