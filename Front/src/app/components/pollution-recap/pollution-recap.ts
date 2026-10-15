import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pollution } from '../../models/pollution.model';

@Component({
  selector: 'app-pollution-recap',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pollution-recap.component.html',
  styleUrl: './pollution-recap.component.scss',
})
export class PollutionRecapComponent {
  @Input({ required: true }) data!: Pollution;
  @Output() reset = new EventEmitter<void>();

  onReset(): void {
    this.reset.emit();
  }
}
