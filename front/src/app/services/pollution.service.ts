import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pollution } from '../models/pollution.model';

// CE FICHIER SERT À :
// Faire le lien entre notre page web et internet.
// C'est lui qui s'occupe de demander des données (GET), d'en envoyer des nouvelles (POST),
// de modifier (PUT) ou de supprimer (DELETE).
// Comme ça, la page d'affichage n'a pas besoin de savoir comment fonctionne le réseau.

@Injectable({
  providedIn: 'root', // tous accés à la meme instance du service
})
export class PollutionService {
  // HttpClient envoie les requêtes vers l'adresse de l'API.
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/pollutions`;

  // GET récupère la liste complète des signalements.
  getPollutions(): Observable<Pollution[]> {
    return this.http.get<Pollution[]>(this.apiUrl);
  }

  // GET avec un identifiant récupère un seul signalement.
  getPollutionById(id: number): Observable<Pollution> {
    return this.http.get<Pollution>(`${this.apiUrl}/${id}`);
  }

  // POST envoie un nouveau signalement ; son identifiant est créé par l'API.
  addPollution(pollution: Omit<Pollution, 'id'>): Observable<Pollution> {
    return this.http.post<Pollution>(this.apiUrl, pollution);
  }

  // PUT envoie les changements à appliquer au signalement indiqué.
  updatePollution(id: number, pollution: Partial<Pollution>): Observable<Pollution> {
    return this.http.put<Pollution>(`${this.apiUrl}/${id}`, pollution);
  }

  // DELETE demande à l'API de supprimer le signalement indiqué.
  deletePollution(id: number): Observable<{ success: boolean; id: number }> {
    return this.http.delete<{ success: boolean; id: number }>(`${this.apiUrl}/${id}`);
  }
}
