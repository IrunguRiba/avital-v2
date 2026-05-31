import { AfterViewInit, Component, ElementRef, ViewChild, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-hero-particles',
  templateUrl: './hero-particles.html',
  styleUrls: ['./hero-particles.css']
})
export class HeroParticlesComponent implements AfterViewInit, OnDestroy {

  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private animationId!: number;

  private particles: any[] = [];

  // smooth mouse system
  private mouse = { x: 0, y: 0 };
  private targetMouse = { x: 0, y: 0 };

  private angle = 0;

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    this.resize(canvas);
    window.addEventListener('resize', () => this.resize(canvas));

    // target mouse (raw input)
    window.addEventListener('mousemove', (e) => {
      this.targetMouse.x = e.clientX;
      this.targetMouse.y = e.clientY;
    });

    this.createSphere();
    this.animate();
  }

  resize(canvas: HTMLCanvasElement) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  createSphere() {
    const total = 3000;
    const radius = 180;

    for (let i = 0; i < total; i++) {

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      this.particles.push({
        x, y, z,
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
    const cy = canvas.height / 2;

    // smooth mouse interpolation
    this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.08;
    this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.08;

    this.angle += 0.002;

    const cosA = Math.cos(this.angle);
    const sinA = Math.sin(this.angle);

    for (let p of this.particles) {

      // rotate sphere
      let x = p.ox * cosA - p.oz * sinA;
      let z = p.ox * sinA + p.oz * cosA;
      let y = p.oy;

      // ------------------------------
      // 🌌 MOUSE FIELD DISTORTION
      // ------------------------------
      const dx = x - (this.mouse.x - cx);
      const dy = y - (this.mouse.y - cy);

      const dist = Math.sqrt(dx * dx + dy * dy);

      const radius = 190; // influence area

      const force = Math.max(0, 1 - dist / radius);
      const strength = force * force * 14;

      if (dist > 0.001) {
        x += (dx / dist) * strength;
        y += (dy / dist) * strength;
      }

      // ------------------------------
      // perspective projection
      // ------------------------------
      const scale = 300 / (300 + z);

      const screenX = x * scale + cx;
      const screenY = y * scale + cy;

      const size = scale * 2;

      this.ctx.beginPath();
      this.ctx.arc(screenX, screenY, size, 0, Math.PI * 2);

      this.ctx.fillStyle = "rgba(225,220,201,0.85)";
      this.ctx.fill();
    }

    this.animationId = requestAnimationFrame(this.animate);
  };

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
  }
}