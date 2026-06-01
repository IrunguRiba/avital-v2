import { Component, Output, EventEmitter, AfterViewInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

// Import GSAP and ScrollTrigger
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  logo = 'avital-logo.png';

  @Output() navigateSection = new EventEmitter<string>();

  constructor(private router: Router) {}

  openContact() {
    this.navigateSection.emit('contact');
  }

  gotoHome() {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      gsap.registerPlugin(ScrollTrigger);
      this.initFooterAnimation();
    }
  }

  private initFooterAnimation(): void {
    const footerTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.page-container',
        start: 'top 85%', 
        toggleActions: 'play none none reverse'
      }
    });

    footerTimeline
      // 2. Slide the entire container sharply from left (+100%)
      .from('.right-card-section', {
        xPercent: +100,
        duration: 1.1,
        ease: 'power3.out'
      })

      // 3. Stagger reveal the main text blocks sharply
      .from('.header-group .sub-headline, .header-group .main-headline', {
        y: 30,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out'
      }, '-=0.5')
      
      // 4. Grow the geometric divider from the center
      .from('.top-divider', {
        scaleX: 0,
        duration: 0.5,
        ease: 'power2.inOut'
      }, '-=0.3')

      // 5. Pop open the frame sharply
      .from('.engraved-frame', {
        scale: 0.95,
        duration: 0.4,
        ease: 'power2.out'
      }, '-=0.2')
      
      // 6. Stagger reveal individual links sharply
      .from('.nav-links a, .floating-logo-container, .legals .legal-link', {
        y: 15,
        duration: 0.5,
        stagger: 0.04,
        ease: 'power2.out'
      }, '-=0.2')
  }
}