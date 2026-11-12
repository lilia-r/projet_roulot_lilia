import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PollutionService } from '../../services/pollution.service';
import { Pollution } from '../../models/pollution.model';

// CE FICHIER SERT À :
// Gérer tout ce qui se passe sur l'écran pour l'utilisateur.
// 1. Il demande au service de charger les pollutions dès l'ouverture de la page.
// 2. Il récupère ce que l'utilisateur tape dans le formulaire pour ajouter une pollution.
// 3. Il filtre la liste si on tape un mot dans la barre de recherche.
// 4. Il ouvre une petite fenêtre quand on clique sur une pollution pour voir les détails.

@Component({
  selector: 'app-pollution',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pollution.html',
  styleUrl: './pollution.scss',
})
export class PollutionComponent implements OnInit {
  // Le service communique avec l'API ; le détecteur met à jour l'affichage.
  private pollutionService = inject(PollutionService);
  private cdr = inject(ChangeDetectorRef);

  // Ces variables gardent les données et l'état visibles sur la page.
  pollutions: Pollution[] = [];
  selectedPollution: Pollution | null = null;
  isLoading = false;

  // Valeurs utilisées par la recherche et le filtre par type.
  searchKeyword = '';
  filterType = '';

  // Contenu initial du formulaire, avec la date du jour.
  formData: Omit<Pollution, 'id'> = {
    titre: '',
    type: 'Déchets',
    description: '',
    dateObservation: new Date().toISOString().substring(0, 10),
    lieu: '',
    latitude: undefined,
    longitude: undefined,
    photoUrl: '',
  };

  typesList = ['Déchets', 'Chimique', 'Air', 'Eau', 'Plastique'];

  ngOnInit(): void {
    // Charge la liste dès l'ouverture de la page.
    this.fetchPollutions();
  }

  fetchPollutions(): void {
    // L'appel à l'API est asynchrone : on attend sa réponse pour remplir la liste.
    this.isLoading = true;
    this.pollutionService.getPollutions().subscribe({
      next: (data) => {
        // Réponse réussie : on affiche les données reçues.
        this.pollutions = data;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        // En cas d'erreur, on arrête aussi l'indicateur de chargement.
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  get filteredPollutions(): Pollution[] {
    // Garde les éléments qui correspondent au type et au texte recherché.
    return this.pollutions.filter((p) => {
      const matchType = !this.filterType || p.type === this.filterType;
      const term = this.searchKeyword.toLowerCase();
      const matchText =
        !this.searchKeyword ||
        p.titre.toLowerCase().includes(term) ||
        p.lieu.toLowerCase().includes(term);
      return matchType && matchText;
    });
  }

  onSubmit(): void {
    // Le titre et le lieu sont obligatoires pour créer un signalement.
    if (!this.formData.titre || !this.formData.lieu) return;

    this.isLoading = true;
    this.pollutionService.addPollution(this.formData).subscribe({
      next: (created) => {
        // Ajoute le nouvel élément en tête de liste puis réinitialise le formulaire.
        this.pollutions.unshift(created);
        this.formData = {
          titre: '',
          type: 'Déchets',
          description: '',
          dateObservation: new Date().toISOString().substring(0, 10),
          lieu: '',
          latitude: undefined,
          longitude: undefined,
          photoUrl: '',
        };
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        // Même si l'envoi échoue, on retire l'état de chargement.
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  selectPollution(item: Pollution): void {
    // Mémorise le signalement choisi pour afficher ses détails.
    this.selectedPollution = item;
    this.cdr.markForCheck();
  }

  closeDetail(): void {
    // Une valeur nulle indique qu'aucun détail n'est ouvert.
    this.selectedPollution = null;
    this.cdr.markForCheck();
  }

  deleteItem(id: number, event: Event): void {
    // Empêche le clic sur le bouton de suppression d'ouvrir aussi le détail.
    event.stopPropagation();
    this.pollutionService.deletePollution(id).subscribe({
      next: () => {
        // Retire de la liste l'élément supprimé par l'API.
        this.pollutions = this.pollutions.filter((p) => p.id !== id);
        if (this.selectedPollution?.id === id) {
          this.selectedPollution = null;
        }
        this.cdr.markForCheck();
      },
    });
  }
}
