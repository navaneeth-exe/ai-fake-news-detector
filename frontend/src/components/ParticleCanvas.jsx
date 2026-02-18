import { useEffect, useRef } from 'react';

// ─── Neural Network Grid ───
// A structured dot grid that warps toward the cursor,
// connecting nearby nodes with glowing lines to simulate
// an AI "thinking" network.
//
// Updates: Now dynamically uses CSS variables for theming.

const GRID_SPACING = 50;        // Distance between grid nodes
const MOUSE_RADIUS = 180;       // Influence radius of the cursor
const WARP_STRENGTH = 25;       // How much nodes get pulled toward cursor
const CONNECTION_DIST = 70;     // Max distance to draw connections
const CURSOR_CONNECTION = 200;  // Connect cursor to nodes within this range
const NODE_RADIUS = 1.5;        // Base dot size
const FRAME_INTERVAL = 1000 / 30; // ~30fps throttle

export default function ParticleCanvas({ theme }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let lastFrame = 0;
    let gridNodes = [];
    const mouse = { x: -1000, y: -1000 };

    // Helper to get current theme colors from CSS variables
    const getColors = () => {
      const style = getComputedStyle(document.documentElement);
      
      // Fetch theme variables
      const accent = style.getPropertyValue('--accent').trim() || '#6366f1';
      const textSecondary = style.getPropertyValue('--text-2').trim() || '#94a3b8';
      const textTertiary = style.getPropertyValue('--text-3').trim() || '#64748b';
      
      // hexToRgba helper
      const hexToRgba = (hex) => {
        let c;
        if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
            c= hex.substring(1).split('');
            if(c.length== 3){
                c= [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c= '0x'+c.join('');
            return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',';
        }
        return 'rgba(148, 163, 184,'; // Fallback
      };

      return {
        dot: hexToRgba(textTertiary),         // Dots use tertiary text color
        line: hexToRgba(textSecondary),       // Lines use secondary text color
        cursorLine: hexToRgba(accent),        // Cursor lines use accent
        cursorGlow: accent,                   // Glow uses accent
      };
    };

    const buildGrid = () => {
      gridNodes = [];
      const cols = Math.ceil(canvas.width / GRID_SPACING) + 2;
      const rows = Math.ceil(canvas.height / GRID_SPACING) + 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          gridNodes.push({
            originX: c * GRID_SPACING,
            originY: r * GRID_SPACING,
            x: c * GRID_SPACING,
            y: r * GRID_SPACING,
          });
        }
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      buildGrid();
    };

    const animate = (now) => {
      animId = requestAnimationFrame(animate);
      if (now - lastFrame < FRAME_INTERVAL) return;
      lastFrame = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const colors = getColors(); // Fetch colors every frame to react to theme changes immediately

      // 1. Update node positions (warp toward cursor)
      for (const node of gridNodes) {
        const dx = mouse.x - node.originX;
        const dy = mouse.y - node.originY;
        const dist = Math.hypot(dx, dy);

        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (1 - dist / MOUSE_RADIUS);
          const easedForce = force * force; 
          node.x = node.originX + (dx / dist) * easedForce * WARP_STRENGTH;
          node.y = node.originY + (dy / dist) * easedForce * WARP_STRENGTH;
        } else {
          node.x += (node.originX - node.x) * 0.1;
          node.y += (node.originY - node.y) * 0.1;
        }
      }

      // 2. Draw grid connections
      for (let i = 0; i < gridNodes.length; i++) {
        const a = gridNodes[i];
        for (let j = i + 1; j < gridNodes.length; j++) {
          const b = gridNodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < CONNECTION_DIST) {
            const opacity = (1 - d / CONNECTION_DIST) * 0.15;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `${colors.line}${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // 3. Draw cursor connections
      if (mouse.x > 0 && mouse.y > 0) {
        for (const node of gridNodes) {
          const d = Math.hypot(node.x - mouse.x, node.y - mouse.y);
          if (d < CURSOR_CONNECTION) {
            const opacity = (1 - d / CURSOR_CONNECTION) * 0.6;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(node.x, node.y);
            ctx.strokeStyle = `${colors.cursorLine}${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Cursor glow
        const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 80);
        gradient.addColorStop(0, `${colors.cursorLine}0.1)`);
        gradient.addColorStop(1, `${colors.cursorLine}0)`);
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 80, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // 4. Draw nodes (dots)
      for (const node of gridNodes) {
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.hypot(dx, dy);
        const isNearCursor = dist < MOUSE_RADIUS;

        const radius = isNearCursor
          ? NODE_RADIUS + (1 - dist / MOUSE_RADIUS) * 2
          : NODE_RADIUS;
        const opacity = isNearCursor
          ? 0.4 + (1 - dist / MOUSE_RADIUS) * 0.5
          : 0.2;

        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `${colors.dot}${opacity})`;
        ctx.fill();

        // Bright glow for very close nodes
        if (dist < MOUSE_RADIUS * 0.4) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius + 2, 0, Math.PI * 2);
          ctx.fillStyle = `${colors.cursorLine}${(1 - dist / (MOUSE_RADIUS * 0.4)) * 0.2})`;
          ctx.fill();
        }
      }
    };

    const onMouse = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onLeave = () => { mouse.x = -1000; mouse.y = -1000; };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouse);
    window.addEventListener('mouseleave', onLeave);
    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, [theme]); // Re-run effect if theme changes

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
