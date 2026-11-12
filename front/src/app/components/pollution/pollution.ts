import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PollutionService } from '../../services/pollution.service';
import { Pollution } from '../../models/pollution.model';
import { PollutionLevelPipe } from '../../shared/pipes/pollution-level.pipe';
import { HighlightPollutionDirective } from '../../shared/directives/highlight-pollution.directive';

@Component({
  selector: 'app-pollution',
  standalone: true,
  imports: [CommonModule, FormsModule, PollutionLevelPipe, HighlightPollutionDirective],
  templateUrl: './pollution.html',
  styleUrl: './pollution.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PollutionComponent implements OnInit {
  private pollutionService = inject(PollutionService);
  private cdr = inject(ChangeDetectorRef);

  pollutions: Pollution[] = [];
  selectedPollution: Pollution | null = null;
  isLoading = false;

  searchKeyword = '';
  filterType = '';

  // Contenu initial du formulaire avec un indice de dangerosité (level) par défaut
  formData: Omit<Pollution, 'id'> = {
    titre: '',
    type: 'Déchets',
    level: 15,
    description: '',
    dateObservation: new Date().toISOString().substring(0, 10),
    lieu: '',
    latitude: undefined,
    longitude: undefined,
    photoUrl: '',
  };

  typesList = ['Déchets', 'Chimique', 'Air', 'Eau', 'Plastique'];

  ngOnInit(): void {
    this.fetchPollutions();
  }

  fetchPollutions(): void {
    this.isLoading = true;
    this.pollutionService.getPollutions().subscribe({
      next: (data) => {
        this.pollutions = data;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  get filteredPollutions(): Pollution[] {
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
    if (!this.formData.titre || !this.formData.lieu) return;

    this.isLoading = true;
    const submittedLevel = this.formData.level ?? 15;

    this.pollutionService.addPollution(this.formData).subscribe({
      next: (created) => {
        // Immutabilité requise avec OnPush : on crée un nouveau tableau plutôt que .unshift()
        const pollutionWithLevel: Pollution = {
          ...created,
          level: created.level ?? submittedLevel,
        };
        this.pollutions = [pollutionWithLevel, ...this.pollutions];

        this.formData = {
          titre: '',
          type: 'Déchets',
          level: 15,
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
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  selectPollution(item: Pollution): void {
    this.selectedPollution = item;
    this.cdr.markForCheck();
  }

  closeDetail(): void {
    this.selectedPollution = null;
    this.cdr.markForCheck();
  }

  deleteItem(id: number, event: Event): void {
    event.stopPropagation();
    this.pollutionService.deletePollution(id).subscribe({
      next: () => {
        // Immutabilité respectée : .filter() renvoie toujours une nouvelle référence de tableau
        this.pollutions = this.pollutions.filter((p) => p.id !== id);
        if (this.selectedPollution?.id === id) {
          this.selectedPollution = null;
        }
        this.cdr.markForCheck();
      },
    });
  }
}
