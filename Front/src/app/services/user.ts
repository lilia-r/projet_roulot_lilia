import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // Prépare les requêtes vers l'API des utilisateurs.
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  // Récupère la liste des utilisateurs.
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // Envoie les informations d'un utilisateur pour le créer.
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }
}
