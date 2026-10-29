// CE FICHIER SERT À :
// Décrire à quoi ressemble une "Pollution" dans notre projet.
// On dit juste qu'une pollution doit obligatoirement avoir :
// un id, un titre, un type (eau, air...), un lieu, une date et un texte.
// Ça évite d'oublier des informations par erreur.
export interface Pollution {
  // Champs principaux nécessaires pour identifier et décrire un signalement.
  id: number;
  titre: string;
  type: string;
  description: string;
  dateObservation: string;
  lieu: string;
  // Le point GPS et la photo sont facultatifs.
  latitude?: number;
  longitude?: number;
  photoUrl?: string;
}
