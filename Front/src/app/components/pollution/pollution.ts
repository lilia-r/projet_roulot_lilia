import {
  Component,
  OnInit,
  inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pollution } from '../../models/pollution.model';
import { PollutionService } from '../../services/pollution.service';
import { CyberRevealDirective } from '../../shared/directives/cyber-reveal.directive';
import { HighlightPollutionDirective } from '../../shared/directives/highlight-pollution.directive';
import { PollutionLevelPipe } from '../../shared/pipes/pollution-level.pipe';
import { CanComponentDeactivate } from '../../core/guards/unsaved-changes.guard';

// Page principale des pollutions, chargée en lazy loading et protégée par authGuard + unsavedChangesGuard
@Component({
  selector: 'app-pollution',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CyberRevealDirective,
    HighlightPollutionDirective,
    PollutionLevelPipe,
  ],
  templateUrl: './pollution.html',
  styleUrl: './pollution.scss',
  // OnPush : Angular ne revérifie ce composant que lors d'un événement interne, d'un changement d'@Input
  // ou lorsqu'on appelle cdr.markForCheck() après une réponse HTTP.
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PollutionComponent implements OnInit, CanComponentDeactivate {
  private pollutionService = inject(PollutionService);
  // Permet de prévenir Angular qu'une donnée a changé après un appel asynchrone (nécessaire en OnPush)
  private cdr = inject(ChangeDetectorRef);

  pollutions: Pollution[] = [];
  selectedPollution: Pollution | null = null;
  isLoading = false;

  // Valeurs des champs de recherche / filtre de l'historique
  searchKeyword = '';
  filterType = '';

  typesList: string[] = ['Déchets', 'Plastique', 'Air', 'Eau', 'Chimique', 'Industriel'];

  formData: Pollution = this.getEmptyForm();

  // Au chargement du composant, on récupère la liste des pollutions depuis l'API
  ngOnInit(): void {
    this.loadPollutions();
  }

  // Réinitialise le formulaire avec des valeurs propres par défaut (date du jour)
  getEmptyForm(): Pollution {
    return {
      titre: '',
      type: 'Déchets',
      level: 15,
      lieu: '',
      dateObservation: new Date().toISOString().split('T')[0],
      description: '',
    };
  }

  // Méthode appelée automatiquement par unsavedChangesGuard quand l'utilisateur essaie de quitter /pollutions.
  // Renvoie true si au moins un champ texte du formulaire a été commencé.
  hasUnsavedChanges(): boolean {
    return (
      this.formData.titre.trim().length > 0 ||
      this.formData.lieu.trim().length > 0 ||
      (this.formData.description?.trim().length ?? 0) > 0
    );
  }

  // Centralise le choix de la classe CSS de fond selon le type de pollution.
  // Utilisée à la fois dans la liste et dans la modale de détail pour éviter de dupliquer la logique dans le HTML.
  getBgClass(item: Pollution): string {
    const t = (item.type ?? '').toLowerCase();
    if (t.includes('chimique') || t.includes('industriel')) return 'bg-chimique';
    if (t.includes('air')) return 'bg-air';
    if (t.includes('eau')) return 'bg-eau';
    if (t.includes('plastique')) return 'bg-plastique';
    return 'bg-dechets';
  }

  // Charge toutes les pollutions via PollutionService puis demande un rafraîchissement de la vue (markForCheck)
  loadPollutions(): void {
    this.isLoading = true;
    this.pollutionService.getPollutions().subscribe({
      next: (data) => {
        this.pollutions = data;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur chargement pollutions :', err);
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  // Renvoie la liste filtrée selon le mot-clé saisi et la catégorie sélectionnée
  get filteredPollutions(): Pollution[] {
    return this.pollutions.filter((item) => {
      const keyword = this.searchKeyword.toLowerCase().trim();
      const matchesKeyword =
        !keyword ||
        item.titre?.toLowerCase().includes(keyword) ||
        item.lieu?.toLowerCase().includes(keyword);

      if (!this.filterType) {
        return matchesKeyword;
      }

      const selected = this.filterType.toLowerCase();
      const itemType = (item.type || '').toLowerCase();
      const itemTitle = (item.titre || '').toLowerCase();

      if (selected.includes('déchet') || selected.includes('dechet')) {
        const isSpecificOther =
          itemTitle.includes('air') ||
          itemTitle.includes('eau') ||
          itemTitle.includes('chimique') ||
          itemTitle.includes('plastique');
        return matchesKeyword && itemType.includes('déchet') && !isSpecificOther;
      }

      return matchesKeyword && (itemType.includes(selected) || itemTitle.includes(selected));
    });
  }

  // Envoie une nouvelle pollution à l'API et l'ajoute en tête de liste (nouvelle référence de tableau pour OnPush)
  onSubmit(): void {
    if (!this.formData.titre.trim() || !this.formData.lieu.trim()) {
      return;
    }

    this.isLoading = true;
    this.pollutionService.addPollution(this.formData).subscribe({
      next: (created) => {
        // On recrée un nouveau tableau ([created, ...this.pollutions]) au lieu de .push() : bonne pratique avec OnPush
        this.pollutions = [created, ...this.pollutions];
        this.formData = this.getEmptyForm();
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur ajout pollution :', err);
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  // Ouvre la fenêtre modale avec le détail du signalement cliqué
  selectPollution(item: Pollution): void {
    this.selectedPollution = item;
    this.cdr.markForCheck();
  }

  // Ferme la fenêtre modale de détail
  closeDetail(): void {
    this.selectedPollution = null;
    this.cdr.markForCheck();
  }

  // Supprime une pollution côté API puis la retire de la liste affichée
  deleteItem(id: number | string | undefined, event: Event): void {
    // Empêche le clic sur le bouton ✕ d'ouvrir aussi la modale de détail de la ligne
    event.stopPropagation();
    if (id === undefined) return;

    this.pollutionService.deletePollution(id).subscribe({
      next: () => {
        this.pollutions = this.pollutions.filter((p) => p.id !== id);
        if (this.selectedPollution?.id === id) {
          this.selectedPollution = null;
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur suppression pollution :', err);
        this.cdr.markForCheck();
      },
    });
  }
}
