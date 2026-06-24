import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';

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
export class App implements AfterViewInit, OnInit {

  constructor(private router: Router){}
  logo = 'avital-logo.png';
  menuOpen = false;
  quickContactOpen=false

  isMobile = false;

  
  
ngOnInit() {
  this.isMobile = window.innerWidth <= 768;
}

  @ViewChild('menupanel', { static: false }) menupanel!: ElementRef;
  @ViewChild('contactSection', { static: false }) contactSection!: ElementRef;
  @ViewChild('portfolioSection', { static: false }) portfolioSection!: ElementRef;
  @ViewChild('aboutSection', { static: false }) aboutSection!: ElementRef;
  @ViewChild('pricesSection', { static: false }) pricesSection!: ElementRef;
  @ViewChild('footerSection', { static: false }) footerSection!: ElementRef;
  @ViewChild('heroSection', { static: false }) heroSection!: ElementRef;

  smoother!: ScrollSmoother;


  ngAfterViewInit(): void {
    ScrollTrigger.create({
      trigger: "#footer",
      start: "top 10%",
      end: "top bottom",
      scroller: "#smooth-wrapper",
    
      onEnter: () => {
        const isMobile = window.innerWidth <= 768;
    
        if (isMobile) {
          // 🔥 MOBILE: hide EVERYTHING (including logo)
          gsap.to(".nav", {
            autoAlpha: 0,
            duration: 0.4,
            ease: "power2.out",
            pointerEvents: "none"
          });
        } else {
          // 🖥 DESKTOP: hide only menu/content
          gsap.to(".nav > :not(.logo)", {
            autoAlpha: 0,
            y: -10,
            duration: 0.4,
            ease: "power2.out",
            pointerEvents: "none"
          });
        }
      },
    
      onLeaveBack: () => {
        const isMobile = window.innerWidth <= 768;
    
        if (isMobile) {
          // 🔥 MOBILE: Bring back the entire nav immediately
          gsap.to(".nav", {
            autoAlpha: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
            pointerEvents: "auto"
          });
          
          // Safety reset for inner elements just in case window resized
          gsap.set(".nav > :not(.logo)", { autoAlpha: 1, y: 0, pointerEvents: "auto" });
        } else {
          gsap.to(".nav > :not(.logo)", {
            autoAlpha: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
            pointerEvents: "auto"
          });
          
          gsap.set(".nav", { autoAlpha: 1, pointerEvents: "auto" });
        }
      }
    });
    window.addEventListener('scroll', () => {
      const nav = document.querySelector('.nav');
  
      if (window.scrollY > 50) {
        nav?.classList.add('scrolled');
      } else {
        nav?.classList.remove('scrolled');
      }
    });

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

    // --- NEW: Dynamic Navigation Trigger for About Us Section ---
    ScrollTrigger.create({
      trigger: "#about",
      start: "top top",
      end: "bottom top",
      scroller: "#smooth-wrapper",
      onEnter: () => document.querySelector('.nav')?.classList.add('nav-about-glass'),
      onLeave: () => document.querySelector('.nav')?.classList.remove('nav-about-glass'),
      onEnterBack: () => document.querySelector('.nav')?.classList.add('nav-about-glass'),
      onLeaveBack: () => document.querySelector('.nav')?.classList.remove('nav-about-glass')
    });
    
    ScrollTrigger.refresh();
    
  }
  
  
  get navClass() {
    return {
      scrolled: true, // keep base transition effects if you want
      about: this.currentSection === 'about'
    };
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