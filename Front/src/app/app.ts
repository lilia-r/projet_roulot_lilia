import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PollutionFormComponent } from './components/pollution-form/pollution-form';
import { PollutionRecapComponent } from './components/pollution-recap/pollution-recap';
import { Pollution } from './models/pollution.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, PollutionFormComponent, PollutionRecapComponent],
  templateUrl: './app.html', // Ou './app.component.html' selon le nom de ton fichier HTML
  styleUrl: './app.scss', // Ou './app.component.scss' selon le nom de ton fichier SCSS
})
export class App {
  declaredPollution: Pollution | null = null;

  onPollutionCreated(data: Pollution): void {
    this.declaredPollution = data;
  }

  onReset(): void {
    this.declaredPollution = null;
  }
}
