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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PollutionComponent implements OnInit, CanComponentDeactivate {
  private pollutionService = inject(PollutionService);
  private cdr = inject(ChangeDetectorRef);

  pollutions: Pollution[] = [];
  selectedPollution: Pollution | null = null;
  isLoading = false;

  searchKeyword = '';
  filterType = '';

  typesList: string[] = ['Déchets', 'Plastique', 'Air', 'Eau', 'Chimique', 'Industriel'];

  formData: Pollution = this.getEmptyForm();

  ngOnInit(): void {
    this.loadPollutions();
  }

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

  hasUnsavedChanges(): boolean {
    return (
      this.formData.titre.trim().length > 0 ||
      this.formData.lieu.trim().length > 0 ||
      (this.formData.description?.trim().length ?? 0) > 0
    );
  }

  canDeactivate(): boolean {
    if (this.hasUnsavedChanges()) {
      return window.confirm(
        'Vous avez un signalement en cours de saisie. Voulez-vous vraiment quitter sans enregistrer ?',
      );
    }
    return true;
  }

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

  onSubmit(): void {
    if (!this.formData.titre.trim() || !this.formData.lieu.trim()) {
      return;
    }

    this.isLoading = true;
    this.pollutionService.addPollution(this.formData).subscribe({
      next: (created) => {
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

  selectPollution(item: Pollution): void {
    this.selectedPollution = item;
    this.cdr.markForCheck();
  }

  closeDetail(): void {
    this.selectedPollution = null;
    this.cdr.markForCheck();
  }

  deleteItem(id: number | string | undefined, event: Event): void {
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
