import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Pollution } from '../models/pollution.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PollutionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/pollutions`;

  getPollutions(): Observable<Pollution[]> {
    return this.http
      .get<any[]>(this.apiUrl)
      .pipe(map((items) => items.map((item) => this.normalizePollution(item))));
  }

  addPollution(pollution: Pollution): Observable<Pollution> {
    const payload = {
      ...pollution,
      type_pollution: pollution.type,
    };
    return this.http
      .post<any>(this.apiUrl, payload)
      .pipe(map((item) => this.normalizePollution(item)));
  }

  deletePollution(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

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
