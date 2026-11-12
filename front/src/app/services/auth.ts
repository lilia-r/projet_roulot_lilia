import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SignUpPayload, SignUpResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Prépare l'envoi des informations d'inscription à l'API.
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/signup`;

  // Envoie le formulaire et reçoit la réponse du serveur.
  signUp(payload: SignUpPayload): Observable<SignUpResponse> {
    return this.http.post<SignUpResponse>(this.apiUrl, payload);
  }
}
