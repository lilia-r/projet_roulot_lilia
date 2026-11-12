import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth';
import { SignUpPayload, SignUpResponse } from '../models/user.model';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class SignupComponent {
  // Services et états nécessaires au traitement de l'inscription.
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  // Données saisies et résultat affiché à l'utilisateur.
  formData: SignUpPayload = {
    name: '',
    email: '',
    password: '',
  };

  response: SignUpResponse | null = null;
  isLoading = false;
  errorMessage = '';

  onSubmit(): void {
    // Prépare l'écran puis envoie les données au service d'inscription.
    this.isLoading = true;
    this.errorMessage = '';
    this.response = null;
    this.cdr.markForCheck();

    this.authService.signUp(this.formData).subscribe({
      next: (res) => {
        console.log('Réponse reçue :', res);
        this.response = res;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur API :', err);
        this.errorMessage = "Une erreur est survenue lors de l'inscription.";
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }
}
