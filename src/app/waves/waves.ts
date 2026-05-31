import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-waves',
  imports: [],
  templateUrl: './waves.html',
  styleUrl: './waves.css',
})
export class Waves implements AfterViewInit {

  @ViewChild('waveCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private canvas!: HTMLCanvasElement;

  private layers = 80;
  private gap = 2;

  private t = 0;
  private animationId = 0;

  ngAfterViewInit(): void {
    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

    this.resizeCanvas();
    this.draw();
  }

  @HostListener('window:resize')
  resizeCanvas(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = 320;
  }

  // stronger wave field (DEEPER CURVE)
  private current(xi: number): number {
    return (
      Math.sin(xi * 0.010 + this.t * 0.5) * 35 +
      Math.sin(xi * 0.004 + this.t * 0.25) * 18
    );
  }

  // deeper single depression (more ocean-like trough)
  private dip(xi: number): number {
    const center = this.canvas.width * 0.55;
    const width = 220;

    return -Math.exp(-Math.pow((xi - center) / width, 2)) * 90;
  }

  private draw = (): void => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const centerY = this.canvas.height / 2;

    for (let i = 0; i < this.layers; i++) {

      const depth = i / this.layers;

      // stronger “wave body” thickness
      const thickness = Math.sin(depth * Math.PI);

      const baseY =
        centerY + (i - this.layers / 2) * this.gap * thickness;

      this.ctx.beginPath();

      for (let xi = 0; xi < this.canvas.width; xi++) {

        const y =
          baseY +
          this.current(xi) +
          this.dip(xi) * thickness;

        xi
          ? this.ctx.lineTo(xi, y)
          : this.ctx.moveTo(xi, y);
      }

      const col =
        depth < 0.5
          ? `rgba(0,200,255,${0.04 + depth * 0.28})`
          : `rgba(255,210,90,${0.04 + (1 - depth) * 0.28})`;

      this.ctx.strokeStyle = col;
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    }

    this.t += 0.015;

    this.animationId = requestAnimationFrame(this.draw);
  };

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
  }
}