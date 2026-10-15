import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Pollution } from '../../models/pollution.model';

@Component({
  selector: 'app-pollution-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pollution-form.component.html',
  styleUrl: './pollution-form.component.scss',
})
export class PollutionFormComponent implements OnInit {
  @Output() formSubmitted = new EventEmitter<Pollution>();

  pollutionForm!: FormGroup;

  typesPollution: string[] = ['Plastique', 'Chimique', 'Dépôt sauvage', 'Eau', 'Air', 'Autre'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.pollutionForm = this.fb.group({
      titre: ['', [Validators.required]],
      typePollution: ['', [Validators.required]],
      description: ['', [Validators.required]],
      dateObservation: ['', [Validators.required]],
      lieu: ['', [Validators.required]],
      latitude: [
        null,
        [
          Validators.required,
          Validators.pattern(
            /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,8})?))$/,
          ),
        ],
      ],
      longitude: [
        null,
        [
          Validators.required,
          Validators.pattern(
            /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,8})?))$/,
          ),
        ],
      ],
      photoUrl: [''],
    });
  }

  isFieldInvalid(name: string): boolean {
    const field = this.pollutionForm.get(name);
    return !!(field && field.invalid && (field.touched || field.dirty));
  }

  onSubmit(): void {
    if (this.pollutionForm.invalid) {
      this.pollutionForm.markAllAsTouched();
      return;
    }

    const formValues = this.pollutionForm.value;
    const pollutionData: Pollution = {
      ...formValues,
      latitude: parseFloat(formValues.latitude),
      longitude: parseFloat(formValues.longitude),
    };

    this.formSubmitted.emit(pollutionData);
  }
}
