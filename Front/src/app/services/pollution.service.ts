import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Pollution } from '../models/pollution.model';
import { environment } from '../../environments/environment';

// Service responsable de toute la communication HTTP avec l'API /api/pollutions
@Injectable({
  providedIn: 'root',
})
export class PollutionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/pollutions`;

  // Récupère la liste des pollutions et harmonise le format de chaque objet avec normalizePollution()
  getPollutions(): Observable<Pollution[]> {
    return this.http
      .get<any[]>(this.apiUrl)
      .pipe(map((items) => items.map((item) => this.normalizePollution(item))));
  }

  // Envoie une nouvelle pollution au backend (en doublant type -> type_pollution pour correspondre à la BDD)
  addPollution(pollution: Pollution): Observable<Pollution> {
    const payload = {
      ...pollution,
      type_pollution: pollution.type,
    };
    return this.http
      .post<any>(this.apiUrl, payload)
      .pipe(map((item) => this.normalizePollution(item)));
  }

  // Supprime une pollution en base à partir de son identifiant
  deletePollution(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Adapte les noms de champs reçus de la BDD (snake_case) vers le format attendu par le front (camelCase)
  private normalizePollution(item: any): Pollution {
    const rawType = item.type_pollution || item.type || 'Déchets';
    const titre = (item.titre || '').toLowerCase();

    // Corrige automatiquement les anciens enregistrements restés sur "Déchets"
    let resolvedType = rawType;
    if (rawType.toLowerCase().includes('déchet') || rawType.toLowerCase().includes('dechet')) {
      if (titre.includes('air')) resolvedType = 'Air';
      else if (titre.includes('eau')) resolvedType = 'Eau';
      else if (titre.includes('chimique')) resolvedType = 'Chimique';
      else if (titre.includes('plastique')) resolvedType = 'Plastique';
    }

    return {
      ...item,
      type: resolvedType,
      dateObservation: item.dateObservation || item.date_observation,
    };
  }
}
