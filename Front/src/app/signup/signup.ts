import { Component, inject, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { SignUpPayload, SignUpResponse } from '../models/user.model';
import { CyberRevealDirective } from '../shared/directives/cyber-reveal.directive';
import { Login } from '../store/auth.actions';
import { AuthState } from '../store/auth.state';

// Page de connexion / inscription chargée en lazy loading sur la route /signup
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, CyberRevealDirective],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
  // Stratégie OnPush : le template n'est revérifié que si une donnée liée change ou via markForCheck()
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
  // Injection du Store NGXS pour dispatcher l'action [Auth] Login (authentification simulée pour l'exercice 05)
  private store = inject(Store);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  formData: SignUpPayload = {
    name: '',
    email: '',
    password: '',
  };

  response: SignUpResponse | null = null;
  isLoading = false;
  errorMessage = '';

  // Déclenché à la soumission du formulaire : valide les champs puis dispatche l'action NGXS Login
  onSubmit(): void {
    if (
      !this.formData.name.trim() ||
      !this.formData.email.trim() ||
      !this.formData.password?.trim()
    ) {
      this.errorMessage = 'Veuillez renseigner votre nom, votre email et votre mot de passe.';
      this.cdr.markForCheck();
      return;
    }

    if (this.formData.password.length < 6) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères.';
      this.cdr.markForCheck();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.response = null;
    this.cdr.markForCheck();

    // Dispatche l'action [Auth] Login dans le Store NGXS (le StoragePlugin sauvegarde automatiquement dans localStorage)
    this.store
      .dispatch(
        new Login({
          email: this.formData.email.trim(),
          nom: this.formData.name.trim(),
        }),
      )
      .subscribe({
        next: () => {
          const user = this.store.selectSnapshot(AuthState.user);
          if (user) {
            this.response = {
              message: 'Connexion réussie.',
              user: {
                id: user.id,
                name: user.nom,
                email: user.email,
              },
            };
          }
          this.isLoading = false;
          this.cdr.markForCheck();

          // Redirection vers la route protégée /pollutions (désormais autorisée par authGuard)
          setTimeout(() => {
            this.router.navigate(['/pollutions']);
          }, 600);
        },
        error: () => {
          this.errorMessage = 'Erreur lors de la connexion.';
          this.isLoading = false;
          this.cdr.markForCheck();
        },
      });
  }
}
