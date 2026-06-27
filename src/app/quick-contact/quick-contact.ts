import { Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from './../auth-service';

@Component({
  selector: 'app-quick-contact',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './quick-contact.html',
  styleUrl: './quick-contact.css',
})
export class QuickContact {
  @Output() close = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.form = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      institution: ['', Validators.required],
      service: ['', Validators.required],
    });
  }


  showNotification = false;
  notificationType: 'success' | 'error' = 'success';
  notificationTitle = '';
  notificationMessage = '';

  countdown = 6;

  private timer: any;
  private interval: any;


  closePanel() {
    this.close.emit();
  }
  showPopup(type: 'success' | 'error', title: string, message: string) {
    clearTimeout(this.timer);
    clearInterval(this.interval);

    this.notificationType = type;
    this.notificationTitle = title;
    this.notificationMessage = message;

    this.showNotification = true;
    this.countdown = 3;

    this.interval = setInterval(() => {
      this.countdown--;
    }, 2500);

    this.timer = setTimeout(() => {
      this.showNotification = false;
      clearInterval(this.interval);
    }, 6000);
  }
  submitForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.value;

    this.authService.request(payload).subscribe({
      next: (response: any) => {
        console.log('Success Response:', response);

        this.form.reset();

        this.showPopup(
          'success',
          'Request received.',
          "We'll be in touch via email or WhatsApp shortly. If there is any delay, kindly call us on 0768793478."
        );

        // close panel AFTER showing popup if you want UX flow like modal → success
        this.close.emit();
      },

      error: (err: any) => {
        console.log(err?.error?.message);

        this.showPopup(
          'error',
          'Unsuccessful attempt',
          err?.error?.message || 'Something went wrong. Please try again.'
        );
        if (err.status === 409) {
          this.form.reset();
        }
      }
    });
  }
}