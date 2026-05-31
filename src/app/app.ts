import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { Router } from '@angular/router';
import { Portfolio } from './portfolio/portfolio';
import { Prices } from './prices/prices';
import { Contact } from './contact/contact';
import { AboutUs } from './about-us/about-us';
import { Footer } from './footer/footer';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { HeroParticlesComponent } from './hero-particles/hero-particles';
import { QuickContact } from './quick-contact/quick-contact';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

@Component({
  selector: 'app-root',
  imports: [ Portfolio, QuickContact,  Prices, Contact, AboutUs, Footer, HeroParticlesComponent, CommonModule],


templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App implements AfterViewInit {

  constructor(private router: Router){}
  logo = 'avital-logo.png';
  menuOpen = false;
  quickContactOpen=false

  @ViewChild('menupanel', { static: false }) menupanel!: ElementRef;
  @ViewChild('contactSection', { static: false }) contactSection!: ElementRef;
  @ViewChild('portfolioSection', { static: false }) portfolioSection!: ElementRef;
  @ViewChild('aboutSection', { static: false }) aboutSection!: ElementRef;
  @ViewChild('pricesSection', { static: false }) pricesSection!: ElementRef;
  @ViewChild('footerSection', { static: false }) footerSection!: ElementRef;
  @ViewChild('heroSection', { static: false }) heroSection!: ElementRef;

  smoother!: ScrollSmoother;


  ngAfterViewInit(): void {

    this.smoother = ScrollSmoother.create({
      
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1,
      effects: true,
      normalizeScroll: true
    });
  
  
   gsap.to("#hero", {
      opacity: 0,
      scale: 0.4,
      ease: "none",
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
        scroller: "#smooth-wrapper"
      }
    });
    const sections = ['.portfolio', '.about-us', '.prices', '.contact', '.footer'];
  
    
    
    ScrollTrigger.refresh();
  }

  scrollToSection(section: string) {
    this.smoother.scrollTo(`#${section}`, true);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    document.body.classList.toggle('menu-open', this.menuOpen);
  }

  closeMenu() {
    this.menuOpen = false;
    document.body.classList.remove('menu-open');
  }


  currentSection = 'hero';
  // Smooth scroll navigation
  gotoPortfolio() {
  this.smoother.scrollTo('#portfolio', false);
  this.closeMenu();
}

gotoAbout() {
  this.smoother.scrollTo('#about', false);
  this.closeMenu();
}

gotoContact() {
  this.smoother.scrollTo('#contact', false);
  this.closeMenu();
}

gotoPrices() {
  this.smoother.scrollTo('#prices', false);
  this.closeMenu();
}

gotoHome() {

  // reset hero animations instantly
  gsap.to("#hero", {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    y: 0,
    duration: 0
  });

  // scroll to hero
  this.smoother.scrollTo("#hero", true);

  this.closeMenu();
}

gotoFooter() {
  this.smoother.scrollTo('#footer', false);
  this.closeMenu();
}

openQuickContact() {
  this.quickContactOpen = true;

  gsap.fromTo(
    '.quick-contact-wrapper',
    {
      x: '-100%'
    },
    {
      x: '0%',
      duration: 1,
      ease: 'power4.inOut'
    }
  );
}
closeQuickContact() {

  gsap.to('.quick-contact-wrapper', {
    x: '-100%',
    duration: 1,
    ease: 'power4.inOut',
    onComplete: () => {
      this.quickContactOpen = false;
    }
  });

}

}