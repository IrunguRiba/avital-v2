import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('bg-canvas') as HTMLCanvasElement;
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Layout Configurations
  const GRID_SIZE = 90;     
  const MOUSE_RADIUS = 200;  
  const WARP_DEPTH = 0.5;    

  // Style Configs (Ultra subtle figma mesh aesthetics)
  const COLOR_GRID_LINE = 'rgba(225, 220, 201, 0.01)'; 
  const COLOR_GRID_DOT = 'rgba(225, 220, 201, 0.12)';  
  const COLOR_HOVER_CELL = 'rgba(255, 217, 164, 0.03)';
  const COLOR_HOVER_BORDER = 'rgba(255, 217, 164, 0.14)'; 

  let gridColumns = 0;
  let gridRows = 0;
  let nodes: NodePoint[][] = [];
  let cells: GridCell[] = [];
  
  const mouse = { x: null as number | null, y: null as number | null };

  const workflows = [
    ['npm install -g @angular/cli', 'npm install', 'ng serve'],
    ['npm i', 'npm run build', 'npm start'],
    ['yarn install', 'yarn dev', 'yarn build'],
    ['docker build -t app .', 'docker run -p 4200:4200 app']
  ];

  interface NodePoint {
    baseX: number;
    baseY: number;
    x: number;
    y: number;
  }

  interface GridCell {
    col: number;
    row: number;
    isHovered: boolean;
    commands: string[];
    displayedLines: string[];
    currentLine: number;
    currentChar: number;
    textTicker: number;
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    setupGrid();
  }

  function setupGrid() {
    const padding = 100;
    gridColumns = Math.ceil((canvas.width + padding * 2) / GRID_SIZE);
    gridRows = Math.ceil((canvas.height + padding * 2) / GRID_SIZE);

    nodes = [];
    for (let c = 0; c <= gridColumns; c++) {
      nodes[c] = [];
      for (let r = 0; r <= gridRows; r++) {
        const bx = (c * GRID_SIZE) - padding;
        const by = (r * GRID_SIZE) - padding;
        nodes[c][r] = { baseX: bx, baseY: by, x: bx, y: by };
      }
    }

    cells = [];
    for (let c = 0; c < gridColumns; c++) {
      for (let r = 0; r < gridRows; r++) {
        cells.push({
          col: c,
          row: r,
          isHovered: false,
          commands: workflows[Math.floor(Math.random() * workflows.length)],
          displayedLines: [],
          currentLine: 0,
          currentChar: 0,
          textTicker: 0
        });
      }
    }
  }

  function updatePhysics() {
    for (let c = 0; c <= gridColumns; c++) {
      for (let r = 0; r <= gridRows; r++) {
        const n = nodes[c][r];
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - n.baseX;
          const dy = mouse.y - n.baseY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < MOUSE_RADIUS) {
            const force = Math.sin((distance / MOUSE_RADIUS) * Math.PI * 0.5);
            const offset = (1 - force) * MOUSE_RADIUS * WARP_DEPTH;
            n.x = n.baseX - (dx / distance) * offset;
            n.y = n.baseY - (dy / distance) * offset;
            continue;
          }
        }
        n.x += (n.baseX - n.x) * 0.15;
        n.y += (n.baseY - n.y) * 0.15;
      }
    }

    cells.forEach(cell => {
      const pTopLeft = nodes[cell.col][cell.row];
      const pBottomRight = nodes[cell.col + 1][cell.row + 1];

      if (mouse.x !== null && mouse.y !== null) {
        const insideX = mouse.x >= Math.min(pTopLeft.x, pBottomRight.x) && mouse.x <= Math.max(pTopLeft.x, pBottomRight.x);
        const insideY = mouse.y >= Math.min(pTopLeft.y, pBottomRight.y) && mouse.y <= Math.max(pTopLeft.y, pBottomRight.y);
        
        if (insideX && insideY) {
          if (!cell.isHovered) {
            cell.isHovered = true;
          }
          updateCellTerminalText(cell);
          return;
        }
      }
      
      if (cell.isHovered) {
        cell.isHovered = false;
        cell.displayedLines = [];
        cell.currentLine = 0;
        cell.currentChar = 0;
      }
    });
  }

  function updateCellTerminalText(cell: GridCell) {
    cell.textTicker++;
    if (cell.textTicker % 2 !== 0) return;

    if (cell.currentLine < cell.commands.length) {
      const fullLine = cell.commands[cell.currentLine];
      
      if (cell.displayedLines.length <= cell.currentLine) {
        cell.displayedLines.push('');
      }

      if (cell.currentChar < fullLine.length) {
        cell.displayedLines[cell.currentLine] += fullLine[cell.currentChar];
        cell.currentChar++;
      } else {
        cell.currentLine++;
        cell.currentChar = 0;
      }
    }
  }

  function renderScene() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Render Base 3D Mesh Structures
    ctx.lineWidth = 0.5;
    for (let c = 0; c < gridColumns; c++) {
      for (let r = 0; r < gridRows; r++) {
        const tl = nodes[c][r];
        const tr = nodes[c + 1][r];
        const bl = nodes[c][r + 1];

        ctx.strokeStyle = COLOR_GRID_LINE;
        ctx.beginPath();
        ctx.moveTo(tl.x, tl.y);
        ctx.lineTo(tr.x, tr.y);
        ctx.moveTo(tl.x, tl.y);
        ctx.lineTo(bl.x, bl.y);
        ctx.stroke();

        ctx.fillStyle = COLOR_GRID_DOT;
        ctx.beginPath();
        ctx.arc(tl.x, tl.y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 2. Render Active Glowing Terminals inside Hovered Grid Cells
    cells.forEach(cell => {
      if (!cell.isHovered) return;

      const tl = nodes[cell.col][cell.row];
      const tr = nodes[cell.col + 1][cell.row];
      const br = nodes[cell.col + 1][cell.row + 1];
      const bl = nodes[cell.col][cell.row + 1];

      ctx.fillStyle = 'rgba(10, 10, 11, 0.94)';
      ctx.beginPath();
      ctx.moveTo(tl.x, tl.y);
      ctx.lineTo(tr.x, tr.y);
      ctx.lineTo(br.x, br.y);
      ctx.lineTo(bl.x, bl.y);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = COLOR_HOVER_BORDER;
      ctx.lineWidth = 1.0;
      ctx.stroke();

      const paddingX = 10;
      let startY = tl.y + 18;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(tl.x, tl.y);
      ctx.lineTo(tr.x, tr.y);
      ctx.lineTo(br.x, br.y);
      ctx.lineTo(bl.x, bl.y);
      ctx.closePath();
      ctx.clip();

      ctx.fillStyle = 'rgba(225, 220, 201, 0.3)';
      ctx.font = '9px "DM Mono", monospace';
      ctx.fillText(`node_idx:[${cell.col},${cell.row}]`, tl.x + paddingX, tl.y + 12);

      ctx.font = '10px "DM Mono", monospace';
      cell.displayedLines.forEach((lineText, idx) => {
        const lineY = startY + (idx * 16);
        
        ctx.fillStyle = '#e39323';
        ctx.fillText('$', tl.x + paddingX, lineY);

        ctx.fillStyle = 'rgba(225, 220, 201, 0.8)';
        ctx.fillText(lineText, tl.x + paddingX + 10, lineY);
      });

      if (cell.currentLine < cell.commands.length && Math.floor(Date.now() / 200) % 2 === 0) {
        const currentLineText = cell.displayedLines[cell.currentLine] || '';
        const textWidth = ctx.measureText(currentLineText).width;
        ctx.fillStyle = '#ffd9a4';
        ctx.fillRect(tl.x + paddingX + 11 + textWidth, startY + (cell.currentLine * 16) - 9, 5, 10);
      }

      ctx.restore();
    });
  }

  function loop() {
    updatePhysics();
    renderScene();
    requestAnimationFrame(loop);
  }

  // Handle Input Listeners with 90% view cutoff rules
  window.addEventListener('mousemove', (e) => {
    // If the mouse passes below 90% of screen height, release focus to let the native page scroll
    if (e.clientY > window.innerHeight * 0.9) {
      mouse.x = null;
      mouse.y = null;
    } else {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', resizeCanvas);

  resizeCanvas();
  loop();
});