import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pollution } from '../models/pollution.model';

@Injectable({
  providedIn: 'root',
})
export class PollutionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/pollutions`;

  getPollutions(): Observable<Pollution[]> {
    return this.http.get<Pollution[]>(this.apiUrl);
  }

  getPollutionById(id: number): Observable<Pollution> {
    return this.http.get<Pollution>(`${this.apiUrl}/${id}`);
  }

  addPollution(pollution: Omit<Pollution, 'id'>): Observable<Pollution> {
    return this.http.post<Pollution>(this.apiUrl, pollution);
  }

  updatePollution(id: number, pollution: Partial<Pollution>): Observable<Pollution> {
    return this.http.put<Pollution>(`${this.apiUrl}/${id}`, pollution);
  }

  deletePollution(id: number): Observable<{ success: boolean; id: number }> {
    return this.http.delete<{ success: boolean; id: number }>(`${this.apiUrl}/${id}`);
  }
}
