import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// Outil obligatoire pour faire fonctionner les formulaires simples dans Angular
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup', // Le nom de la balise qu'on utilise pour afficher la page (<app-signup>)
  standalone: true,
  imports: [CommonModule, FormsModule], // On donne accès à FormsModule au composant
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class SignupComponent {
  // Une boîte (un objet) qui stocke tout ce que l'utilisateur tape au clavier
  user = {
    login: '',
    password: '',
    confirmPassword: '',
    nom: '',
    prenom: '',
    email: '',
  };

  // Vaut false au départ, passera à true quand le formulaire sera envoyé
  isSubmitted = false;

  // Fonction appelée quand on clique sur le bouton "Valider l'inscription"
  onSubmit(form: NgForm): void {
    // Si toutes les cases obligatoires sont remplies ET que les 2 mots de passe sont identiques
    if (form.valid && this.user.password === this.user.confirmPassword) {
      this.isSubmitted = true; // Déclenche l'affichage du message de confirmation
      console.log('Données envoyées :', this.user);
    }
  }
}
