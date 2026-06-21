import { Component, signal, AfterViewInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Waves } from '../waves/waves';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-portfolio',
  imports: [Waves],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.css',
})
export class Portfolio implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);

  statistics = signal('187+');
  
  ecommerce = '8.png';
  chat="11.png"
  javascript = 'js.png';
  nodejs = 'node-js.png';
  angular = 'angular.png';
  androidstudio = 'android.png';
  java = 'java.png';
  kotlin = 'kotlin.jpg';
  devops = 'devops.png';
  docker = 'docker.svg';
  vercel = 'vercel.png';
  render = 'render.svg';
  react = 'react.png';
  native = 'React-native.png';
  trusted='trusted1.png'

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initScrollAnimations();
    }
  }

  private initScrollAnimations(): void {
    // --- 1. Card Reveal Animation ---
    gsap.to('.project-card.reverse', {
      opacity: 1,
      y: 0,
      scrollTrigger: {
        trigger: '.featured-section',
        start: 'top top',
        end: '+=10%',
        scrub: true,
        pin: true
      }
    });

    gsap.timeline({
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: '+=120%',
        pin: true,
      }
    });

    // --- 2. Integrated Pin & Dual Direction Marquee Animation ---
    // Combined into a single timeline so the track animation finishes cleanly with the pinning timeline context
    const marqueeTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.marquee-wrapper',
        start: 'top top',    // Begins pinning perfectly as the top of the section meets the viewport top
        end: '+=70%',        // Extends the scroll depth duration to give the track animation ample visual time
        scrub: true,         // Links track progression speed cleanly to your mouse/trackpad wheel speed
        pin: true,           // Pins the section in place cleanly
        pinSpacing: true     // Maintains clean vertical spacing so elements below aren't prematurely sucked up
      }
    });

    // Top track moves Left (Slides out by negative percentage)
    marqueeTimeline.to('.marquee-left .marquee-track', {
      xPercent: -15, 
      ease: 'none',
    }, 0);

    // Bottom track moves Right (Starts tucked back, slides forward into view)
    marqueeTimeline.fromTo('.marquee-right .marquee-track', 
      { xPercent: -40 }, 
      { xPercent: 0, ease: 'none' }, 
      0
    );
  }
}