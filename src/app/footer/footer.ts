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
    // 1. Target the parent container so triggering isn't thrown off by the moving child element
    const footerTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.page-container',
        start: 'top 85%', 
        toggleActions: 'play none none reverse'
      }
    });

    footerTimeline
      // 2. Slide the entire right-card-section container from left (-100%) and fade it in
      .from('.right-card-section', {
        xPercent: +100,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out'
      })

      // 3. Stagger reveal the main text blocks inside it as it lands
      .from('.header-group .sub-headline, .header-group .main-headline', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out'
      }, '-=0.5') // Overlaps with the container sliding finish
      
      // 4. Grow the subtle top geometric divider from the center
      .from('.top-divider', {
        scaleX: 0,
        duration: 0.5,
        ease: 'power2.inOut'
      }, '-=0.3')

      // 5. Pop open the custom engraved frame and slide up the link text inside it
      .from('.engraved-frame', {
        scale: 0.95,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out'
      }, '-=0.2')
      
      // 6. Stagger reveal all individual column link arrays
      .from('.nav-links a, .floating-logo-container, .legals .legal-link', {
        y: 15,
        opacity: 0,
        duration: 0.5,
        stagger: 0.04,
        ease: 'power2.out'
      }, '-=0.2')

      // 7. Final accents drop: Help FAB spring + base copyright stamp reveal
      .from('.help-fab', {
        scale: 0,
        duration: 0.4,
        ease: 'back.out(1.5)'
      }, '-=0.2')
      .from('.copyright', {
        opacity: 0,
        y: 10,
        duration: 0.4
      }, '-=0.1');
  }
}