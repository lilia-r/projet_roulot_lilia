import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PollutionService } from '../../services/pollution.service';
import { Pollution } from '../../models/pollution.model';

@Component({
  selector: 'app-pollution',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pollution.html',
  styleUrl: './pollution.scss',
})
export class PollutionComponent implements OnInit {
  private pollutionService = inject(PollutionService);
  private cdr = inject(ChangeDetectorRef);

  pollutions: Pollution[] = [];
  selectedPollution: Pollution | null = null;
  isLoading = false;

  searchKeyword = '';
  filterType = '';

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
    this.pollutionService.addPollution(this.formData).subscribe({
      next: (created) => {
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
        this.pollutions = this.pollutions.filter((p) => p.id !== id);
        if (this.selectedPollution?.id === id) {
          this.selectedPollution = null;
        }
        this.cdr.markForCheck();
      },
    });
  }
}
