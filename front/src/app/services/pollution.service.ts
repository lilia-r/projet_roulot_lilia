import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pollution } from '../models/pollution.model';

@Injectable({
  providedIn: 'root',
})
export class PollutionService {
  // Adresse de base des requêtes consacrées aux signalements.
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/pollutions`;

  // Demande au serveur la liste des signalements.
  getPollutions(): Observable<Pollution[]> {
    return this.http.get<Pollution[]>(this.apiUrl);
  }

  // Demande un signalement précis à partir de son identifiant.
  getPollutionById(id: number): Observable<Pollution> {
    return this.http.get<Pollution>(`${this.apiUrl}/${id}`);
  }

  // Envoie un nouveau signalement au serveur.
  addPollution(pollution: Omit<Pollution, 'id'>): Observable<Pollution> {
    return this.http.post<Pollution>(this.apiUrl, pollution);
  }

  // Envoie les champs à modifier pour un signalement.
  updatePollution(id: number, pollution: Partial<Pollution>): Observable<Pollution> {
    return this.http.put<Pollution>(`${this.apiUrl}/${id}`, pollution);
  }

  // Demande la suppression d'un signalement.
  deletePollution(id: number): Observable<{ success: boolean; id: number }> {
    return this.http.delete<{ success: boolean; id: number }>(`${this.apiUrl}/${id}`);
  }
}
