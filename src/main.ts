import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));

  const canvas = document.getElementById("bg-canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

let w = 0;
let h = 0;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();




const gridSize = 100;
const stars: any[] = [];

function createStars() {
  for (let x = 0; x < w; x += gridSize) {
    for (let y = 0; y < h; y += gridSize) {
      if (Math.random() > 0.7) {
        stars.push({
          x: x + Math.random() * gridSize,
          y: y + Math.random() * gridSize,
          r: Math.random() * 1.2 + 0.3,
          a: Math.random() * 0.6 + 0.2,
          twinkle: Math.random() * 0.015 + 0.005
        });
      }
    }
  }
}
createStars();


// ---------------- SHOOTING STARS ----------------

const shooting: any[] = [];

function spawnShootingStar() {
  shooting.push({
    x: Math.random() * w,
    y: Math.random() * h * 0.5,
    vx: -(Math.random() * 6 + 4),
    vy: Math.random() * 3 + 2,
    life: 1
  });
}


// ---------------- DRAW GRID ----------------

function drawGrid() {
  ctx.strokeStyle = "rgba(225,220,201,0.025)";
  ctx.lineWidth = 1;

  for (let x = 0; x < w; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }

  for (let y = 0; y < h; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
}


// ---------------- ANIMATION LOOP ----------------

function animate() {
  ctx.clearRect(0, 0, w, h);

  drawGrid();

  // stars
  for (const s of stars) {
    s.a += s.twinkle;
    if (s.a > 0.9 || s.a < 0.2) s.twinkle *= -1;

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(225,220,201,${s.a})`;
    ctx.fill();
  }

  // shooting stars
  for (let i = shooting.length - 1; i >= 0; i--) {
    const s = shooting[i];

    s.x += s.vx;
    s.y += s.vy;
    s.life -= 0.01;

    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(s.x + 12, s.y - 12);

    ctx.strokeStyle = `rgba(255,220,200,${s.life})`;
    ctx.lineWidth = 1;
    ctx.stroke();

    if (s.life <= 0) shooting.splice(i, 1);
  }

  requestAnimationFrame(animate);
}

animate();


// ---------------- SPAWN LOOP ----------------

setInterval(() => {
  if (Math.random() > 0.5) spawnShootingStar();
}, 2500);
