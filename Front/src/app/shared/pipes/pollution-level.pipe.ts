import { Pipe, PipeTransform } from '@angular/core';

// Pipe personnalisé qui traduit un score numérique (0-101+) en libellé lisible dans le HTML.
// pure: true signifie qu'Angular ne le recalcule que si la valeur d'entrée change (bon pour les perfs).
@Pipe({
  name: 'pollutionLevel',
  standalone: true,
  pure: true,
})
export class PollutionLevelPipe implements PipeTransform {
  transform(value: number | undefined | null): string {
    if (value === null || value === undefined || isNaN(value)) {
      return 'Inconnu';
    }
    if (value <= 20) return 'Faible';
    if (value <= 50) return 'Modérée';
    if (value <= 100) return 'Élevée';
    return 'Dangereuse';
  }
}
