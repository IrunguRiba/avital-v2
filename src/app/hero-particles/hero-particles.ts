import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  OnDestroy
} from '@angular/core';

@Component({
  selector: 'app-hero-particles',
  templateUrl: './hero-particles.html',
  styleUrls: ['./hero-particles.css']
})
export class HeroParticlesComponent implements AfterViewInit, OnDestroy {

  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private animationId!: number;

  private particles: any[] = [];

  // smooth mouse system
  private mouse = { x: 0, y: 0 };
  private targetMouse = { x: 0, y: 0 };

  private angle = 0;
  private isMobile = false;

  // responsive settings
  private sphereRadius = 180;
  private particleCount = 3000;
  private perspective = 300;
  private influenceRadius = 190;

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    this.resize(canvas);

    window.addEventListener('resize', () => {
      this.resize(canvas);
    });

    window.addEventListener('mousemove', (e) => {
      this.targetMouse.x = e.clientX;
      this.targetMouse.y = e.clientY;
    });

    this.animate();
  }

  resize(canvas: HTMLCanvasElement) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const width = window.innerWidth;

    this.isMobile = width < 768;

    if (this.isMobile) {
      this.sphereRadius = Math.max(156, width * 0.18);
      this.particleCount = 1400;
      this.perspective = 240;
      this.influenceRadius = 110;
    } else if (width < 1200) {
      this.sphereRadius = Math.min(160, width * 0.2);
      this.particleCount = 2200;
      this.perspective = 270;
      this.influenceRadius = 150;
    } else {
      this.sphereRadius = 180;
      this.particleCount = 3000;
      this.perspective = 300;
      this.influenceRadius = 190;
    }

    this.createSphere();
  }

  createSphere() {
    this.particles = [];

    for (let i = 0; i < this.particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      const x =
        this.sphereRadius *
        Math.sin(phi) *
        Math.cos(theta);

      const y =
        this.sphereRadius *
        Math.sin(phi) *
        Math.sin(theta);

      const z =
        this.sphereRadius *
        Math.cos(phi);

      this.particles.push({
        ox: x,
        oy: y,
        oz: z
      });
    }
  }

  animate = () => {
    const canvas = this.canvasRef.nativeElement;

    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;

    // slightly higher on mobile
    const cy = this.isMobile
      ? canvas.height * 0.42
      : canvas.height / 2;

    // smooth mouse interpolation
    this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.08;
    this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.08;

    this.angle += 0.002;

    const cosA = Math.cos(this.angle);
    const sinA = Math.sin(this.angle);

    for (const p of this.particles) {

      // rotate sphere
      let x = p.ox * cosA - p.oz * sinA;
      let z = p.ox * sinA + p.oz * cosA;
      let y = p.oy;

      // mouse distortion
      const dx = x - (this.mouse.x - cx);
      const dy = y - (this.mouse.y - cy);

      const dist = Math.sqrt(dx * dx + dy * dy);

      const force = Math.max(
        0,
        1 - dist / this.influenceRadius
      );

      const strength = force * force * 14;

      if (dist > 0.001) {
        x += (dx / dist) * strength;
        y += (dy / dist) * strength;
      }

      // perspective projection
      const scale =
        this.perspective /
        (this.perspective + z);

      const screenX = x * scale + cx;
      const screenY = y * scale + cy;

      const size = Math.max(0.5, scale);

      this.ctx.beginPath();
      this.ctx.arc(
        screenX,
        screenY,
        size,
        0,
        Math.PI * 2
      );

      this.ctx.fillStyle = 'rgba(225,220,201,0.85)';
      this.ctx.fill();
    }

    this.animationId = requestAnimationFrame(this.animate);
  };

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
  }
}