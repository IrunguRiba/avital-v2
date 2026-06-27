import { Component, OnInit, AfterViewInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

// Import GSAP Framework Core and Scroll Plugins
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact implements OnInit, AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  
  contactForm!: FormGroup;
  showSuccess = false;

  ngOnInit(): void {
    this.contactForm = new FormGroup({
      fullName: new FormControl(''),
      phone: new FormControl(''),
      email: new FormControl('', [Validators.email]),
      contactChoice: new FormControl('phone'),
      subject: new FormControl('', [Validators.required]),
      message: new FormControl('', [Validators.required])
    });
  }

  isPhoneSelected(): boolean {
    return this.contactForm.get('contactChoice')?.value === 'phone';
  }

  onRadioChange(choice: string): void {
    this.contactForm.get('contactChoice')?.setValue(choice);
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.showSuccess = true;

      setTimeout(() => {
        this.showSuccess = false;
        this.contactForm.reset({
          contactChoice: 'phone', 
          fullName: '',
          phone: '',
          email: '',
          subject: '',
          message: ''
        });
      }, 1000); 

    } else {
      this.contactForm.markAllAsTouched();
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      gsap.registerPlugin(ScrollTrigger);
      this.initContactAnimation();
    }
  }

  private initContactAnimation(): void {
    const contactTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.contact-section',
        start: 'top 80%', 
        toggleActions: 'play none none reverse'
      }
    });

    contactTimeline.from('.contact-section', {
      xPercent: -100,
      opacity: 0,
      duration: 1.2,
      ease: 'power4.out'
    });

    contactTimeline.from('.eyebrow, .title, .subtitle', {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out'
    }, '-=0.4');
  }
}