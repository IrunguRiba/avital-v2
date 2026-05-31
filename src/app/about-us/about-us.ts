// about-us.component.ts
import { Component, OnInit, OnDestroy, AfterViewInit ,  inject, PLATFORM_ID} from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

// 1. Import GSAP and ScrollTrigger
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export interface Review {
  text: string;
  author: string;
  rating: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-us.html',
  styleUrls: ['./about-us.css']
})
export class AboutUs implements OnInit, OnDestroy, AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  
  reviews: Review[] = [
    {
      text: "working with avital helped me finally understand how my project actually comes together instead of just submitting something i don't fully grasp. the step-by-step guidance made everything clear, and i feel more confident writing and explaining my code now.",
      author: "Joe",
      rating: "★★★★★"
    },
    {
      text: "The hands-on approach changed everything. I actually learned how to debug and think like a developer, not just copy-paste solutions. Highly recommend for any student serious about understanding software.",
      author: "Maria",
      rating: "★★★★★"
    },
    {
      text: "Avital doesn't just give answers — they teach the 'why' behind every decision. My project grade improved, but more importantly, my confidence skyrocketed.",
      author: "Alex",
      rating: "★★★★★"
    },
    {
      text: "Finally a service that respects academic growth. I can explain my entire codebase now. Incredible mentorship and architectural clarity.",
      author: "Samira",
      rating: "★★★★★"
    }
  ];

  scrollAmount = 0;

  scrollReviews(direction: 'left' | 'right') {
    const container = document.querySelector('.reviews-track-container');
    if (!container) return;
    const amount = 420;

    if (direction === 'left') {
      container.scrollBy({ left: -amount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: amount, behavior: 'smooth' });
    }
  }
  
  faqs: FAQ[] = [
    {
      question: "WHAT EXACTLY DOES AVITAL DELIVER?",
      answer: "WE GUIDE AND BUILD STUDENTS FULLY FUNCTIONAL SOFTWARE WHILE ENSURING THEY UNDERSTAND THE ARCHITECTURE, CODE, AND IMPLEMENTATION PROCESS."
    },
    {
      question: "HOW IS AVITAL DIFFERENT FROM HIRING SOMEONE TO DO MY PROJECT?",
      answer: "WE DON'T JUST DELIVER A FINISHED PRODUCT. WE FOCUS ON HANDS-ON DEVELOPMENT SO STUDENTS ACTIVELY PARTICIPATE AND UNDERSTAND HOW THEIR SYSTEM IS BUILT."
    },
    {
      question: "DO YOU ALLOW AI-GENERATED PROJECT WORK?",
      answer: "NO. OUR APPROACH IS BASED ON REAL DEVELOPMENT PRACTICES, NOT AUTOMATED OR AI-GENERATED SOLUTIONS."
    },
    {
      question: "WILL I BE ABLE TO EXPLAIN MY PROJECT AFTER WORKING WITH AVITAL?",
      answer: "YES. OUR PROCESS IS DESIGNED SO STUDENTS CAN CONFIDENTLY DEFEND AND EXPLAIN EVERY PART OF THEIR PROJECT."
    },
    {
      question: "WHAT LEVEL OF TECHNICAL SKILL DO I NEED TO START?",
      answer: "YOU DON'T NEED TO BE ADVANCED. WE ADAPT THE GUIDANCE BASED ON YOUR CURRENT LEVEL AND HELP YOU BUILD FROM THERE."
    },
    {
      question: "DO YOU MEET ACADEMIC INTEGRITY STANDARDS?",
      answer: "YES. OUR FOCUS IS EDUCATIONAL — WE ENSURE STUDENTS LEARN THE CONCEPTS AND ARE ACTIVELY INVOLVED IN BUILDING THEIR OWN WORK."
    }
  ];
  
  currentReviewIndex: number = 0;
  private carouselInterval: any;
  selectedFaqIndex: number | null = 0;
  hoveredQuestionIndex: number | null = null;
  
  ngOnInit(): void {}
  
  ngOnDestroy(): void {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }
  
  startReviewCarousel(): void {
    this.carouselInterval = setInterval(() => {}, 5000);
  }
  
  nextReview(): void {
    this.currentReviewIndex = (this.currentReviewIndex + 1) % this.reviews.length;
  }
  
  goToReview(index: number): void {
    clearInterval(this.carouselInterval);
    this.currentReviewIndex = index;
    this.startReviewCarousel();
  }
  
  selectFaq(index: number): void {
    if (this.selectedFaqIndex === index) {
      this.selectedFaqIndex = null;
    } else {
      this.selectedFaqIndex = index;
    }
  }
  
  getCurrentReview(): Review {
    return this.reviews[this.currentReviewIndex];
  }
  
  getStars(): string {
    return '★★★★★';
  }
  
  onStartProject(): void {
    alert(' Start your project journey — Contact AVITAL: hello@avital.dev');
  }

  ngAfterViewInit(): void {
    // 2. Ensure we only register and run animations on the browser side (SSR safe)
    if (isPlatformBrowser(this.platformId)) {
      gsap.registerPlugin(ScrollTrigger);
      this.initScrollAnimations();
    }
  }

  private initScrollAnimations(): void {
    // --- Pin FAQ Section while next section scrolls over it ---
    gsap.to('.faq-block', {
      scrollTrigger: {
        trigger: '.faq-block',
        start: 'top top',       // Pins when the FAQ section hits the top of the viewport
        end: '+=100%',          // Keeps it pinned for 100% of the viewport scroll height
        pin: true,              // Locks the FAQ section in place
        pinSpacing: false,      // CRITICAL: Allows the next section to scroll up over the pinned FAQ
        scrub: true
      }
    });
  }
}