import { Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-quick-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './quick-contact.html',
  styleUrl: './quick-contact.css',
})
export class QuickContact {
  @Output() close = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [
          Validators.required
        ]
      ],
      institutionType: ['', Validators.required],
      service: ['', Validators.required]
    });
  }

  closePanel() {
    this.close.emit();
  }

  closeForm(): void {
    this.close.emit();
    console.log('Close clicked');
  }

  submitForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.value.phone;

    const normalized = raw.startsWith('0')
      ? '+254' + raw.substring(1)
      : raw.startsWith('7')
        ? '+254' + raw
        : raw;

    const payload = {
      ...this.form.value,
      phone: normalized
    };

    console.log('FINAL PAYLOAD:', payload);

    this.close.emit();
  }

  
}