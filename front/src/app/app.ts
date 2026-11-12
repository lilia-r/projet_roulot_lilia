import { Component } from '@angular/core';
import { PollutionComponent } from './components/pollution/pollution';

// Composant racine : il affiche l'écran principal de l'application.
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PollutionComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  title = 'projet_roulot_lilia';
}
