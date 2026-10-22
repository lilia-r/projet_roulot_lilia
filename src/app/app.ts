import { Component } from '@angular/core';
import { PollutionComponent } from './components/pollution/pollution';

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
