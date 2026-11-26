import { Component, inject, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { SignUpPayload, SignUpResponse } from '../models/user.model';
import { CyberRevealDirective } from '../shared/directives/cyber-reveal.directive';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, CyberRevealDirective],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
  private authService = inject(AuthService);
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

  onSubmit(): void {
    if (!this.formData.name.trim() || !this.formData.email.trim()) {
      this.errorMessage = 'Veuillez renseigner votre nom et votre adresse email.';
      this.cdr.markForCheck();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.response = null;
    this.cdr.markForCheck();

    this.authService.signUp(this.formData).subscribe({
      next: (res) => {
        this.completeSignUp(res);
      },
      error: (err) => {
        // Si l'API renvoie une vraie erreur métier (400/409/422), on l'affiche
        if (err?.status && err.status !== 0 && err.status !== 404) {
          this.errorMessage =
            err?.error?.message || "Une erreur est survenue lors de l'inscription.";
          this.isLoading = false;
          this.cdr.markForCheck();
          return;
        }

        // Sinon (backend hors ligne / mode local), on valide la session localement
        this.completeSignUp({
          message: 'Accès autorisé (session locale).',
          user: {
            name: this.formData.name,
            email: this.formData.email,
          },
        } as SignUpResponse);
      },
    });
  }

  private completeSignUp(res: SignUpResponse): void {
    this.response = res;
    this.isLoading = false;

    localStorage.setItem(
      'user_session',
      JSON.stringify(res.user || { name: this.formData.name, email: this.formData.email }),
    );
    this.cdr.markForCheck();

    setTimeout(() => {
      this.router.navigate(['/pollutions']);
    }, 600);
  }

  demoAccess(): void {
    localStorage.setItem('user_session', JSON.stringify({ name: 'Agent Lilia', role: 'operator' }));
    this.router.navigate(['/pollutions']);
  }
}
