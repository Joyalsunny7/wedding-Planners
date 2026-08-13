/** ============================================================
 *  ButterflyChandelierCanvas.jsx
 *  Procedural Crystal Butterfly Chandelier with Wind/Pendulum Physics
 * ============================================================ */

import React, { useEffect, useRef } from 'react';

export default function ButterflyChandelierCanvas({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse tracking for dynamic wind force
    const mouse = { x: -9999, y: -9999, vx: 0, vy: 0, lastX: 0, lastY: 0, lastTime: 0 };

    const handleMouseMove = (e) => {
      const now = performance.now();
      const dt = Math.max(16, now - (mouse.lastTime || now));
      
      mouse.vx = (e.clientX - mouse.lastX) / dt;
      mouse.vy = (e.clientY - mouse.lastY) / dt;
      
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.lastX = e.clientX;
      mouse.lastY = e.clientY;
      mouse.lastTime = now;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initButterflies();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Butterfly chandelier nodes
    let butterflies = [];
    const COUNT = 120; // High density chandelier arrangement

    const initButterflies = () => {
      butterflies = [];
      const centerX = width / 2;
      const startY = -50;

      for (let i = 0; i < COUNT; i++) {
        // V-Shaped / Diamond Chandelier Formation
        const rowRatio = i / COUNT;
        const spreadX = (Math.random() - 0.5) * (1 - Math.pow(rowRatio - 0.5, 2) * 2) * (width * 0.55);
        const hangLength = 120 + rowRatio * (height * 0.7) + (Math.random() - 0.5) * 60;
        const anchorX = centerX + spreadX;

        butterflies.push({
          anchorX,
          anchorY: startY,
          length: hangLength,
          
          // Pendulum Physics Variables
          angle: (Math.random() - 0.5) * 0.05,
          angularVelocity: 0,
          angularAcceleration: 0,
          damping: 0.985,
          
          // Visual Attributes
          scale: 0.45 + Math.random() * 0.4,
          glowIntensity: 0.7 + Math.random() * 0.3,
          phaseOffset: Math.random() * Math.PI * 2,
          wingFlapSpeed: 0.02 + Math.random() * 0.03,
          wingAngle: 0,
          depth: Math.random(), // 0 = far, 1 = near
        });
      }

      // Sort by depth for correct 3D overlapping
      butterflies.sort((a, b) => a.depth - b.depth);
    };

    initButterflies();

    /* ------------------------------------------------------------
     * DRAWING HELPERS
     * ------------------------------------------------------------ */

    // Render detailed glass/crystal butterfly wing with internal facets
    const drawCrystalWing = (context, size, side) => {
      context.save();
      context.scale(side, 1); // Flip horizontally for left/right wings

      // Main Outer Wing Contour
      context.beginPath();
      context.moveTo(0, 0);
      context.bezierCurveTo(size * 0.4, -size * 0.8, size * 1.1, -size * 0.7, size * 1.2, -size * 0.2);
      context.bezierCurveTo(size * 1.3, size * 0.3, size * 0.8, size * 0.7, size * 0.4, size * 0.5);
      context.bezierCurveTo(size * 0.2, size * 0.8, -size * 0.1, size * 0.9, 0, 0);
      context.closePath();

      // Glass fill gradient
      const wingGrad = context.createLinearGradient(0, -size, size, size);
      wingGrad.addColorStop(0, 'rgba(255, 255, 255, 0.75)');
      wingGrad.addColorStop(0.4, 'rgba(200, 225, 255, 0.45)');
      wingGrad.addColorStop(0.8, 'rgba(150, 180, 220, 0.25)');
      wingGrad.addColorStop(1, 'rgba(255, 255, 255, 0.6)');

      context.fillStyle = wingGrad;
      context.fill();

      // Outer Specular Crystal Edge
      context.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      context.lineWidth = 1.5;
      context.stroke();

      // Internal Glass Facet Lines (Ribs)
      context.beginPath();
      context.moveTo(0, 0);
      context.quadraticCurveTo(size * 0.5, -size * 0.4, size * 1.1, -size * 0.2);
      context.moveTo(0, 0);
      context.quadraticCurveTo(size * 0.4, 0, size * 0.9, size * 0.3);
      context.moveTo(0, 0);
      context.quadraticCurveTo(size * 0.2, size * 0.4, size * 0.4, size * 0.7);

      context.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      context.lineWidth = 0.8;
      context.stroke();

      context.restore();
    };

    /* ------------------------------------------------------------
     * MAIN ANIMATION LOOP
     * ------------------------------------------------------------ */
    let time = 0;

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // Ambient Wind Force generated by cursor motion & continuous soft breeze
      const globalBreeze = Math.sin(time * 0.015) * 0.0003;

      butterflies.forEach((b) => {
        // Calculate current bottom position of the butterfly bulb
        const currentX = b.anchorX + Math.sin(b.angle) * b.length;
        const currentY = b.anchorY + Math.cos(b.angle) * b.length;

        // Mouse Wind Interaction
        const dx = currentX - mouse.x;
        const dy = currentY - mouse.y;
        const dist = Math.hypot(dx, dy);
        const influenceRadius = 180;

        if (dist < influenceRadius) {
          const force = (1 - dist / influenceRadius) * 0.0025;
          const pushDir = dx > 0 ? 1 : -1;
          b.angularAcceleration += pushDir * force * (Math.abs(mouse.vx) + 0.5);
        }

        // Apply Natural Gravity Pendulum Forces
        const gravity = 0.00015;
        b.angularAcceleration -= gravity * Math.sin(b.angle);
        b.angularAcceleration += globalBreeze;

        // Physics Integration
        b.angularVelocity += b.angularAcceleration;
        b.angularVelocity *= b.damping;
        b.angle += b.angularVelocity;
        b.angularAcceleration = 0; // Reset acceleration frame-by-frame

        // Wing Flap Sub-Motion
        b.wingAngle = Math.sin(time * b.wingFlapSpeed + b.phaseOffset) * 0.25;

        /* ---------------- DRAWING PHASES ---------------- */

        // 1. Hanging Steel/Gold Suspension Cable
        ctx.beginPath();
        ctx.moveTo(b.anchorX, b.anchorY);
        ctx.lineTo(currentX, currentY);
        ctx.strokeStyle = `rgba(212, 175, 55, ${0.25 + b.depth * 0.35})`; // Warm gold wire
        ctx.lineWidth = 0.8 + b.depth * 0.5;
        ctx.stroke();

        // 2. Butterfly & Light Bulb Group
        ctx.save();
        ctx.translate(currentX, currentY);
        ctx.rotate(b.angle); // Pendulum tilt
        ctx.scale(b.scale, b.scale);

        // Gold Fixture Rod
        ctx.fillStyle = '#D4AF37';
        ctx.fillRect(-2, -18, 4, 18);

        // Glowing Center Light Bulb
        const bulbGlow = ctx.createRadialGradient(0, 0, 1, 0, 0, 24);
        bulbGlow.addColorStop(0, 'rgba(255, 255, 255, 1)');
        bulbGlow.addColorStop(0.2, 'rgba(255, 220, 150, 0.9)');
        bulbGlow.addColorStop(0.6, 'rgba(212, 175, 55, 0.35)');
        bulbGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = bulbGlow;
        ctx.beginPath();
        ctx.arc(0, 0, 24, 0, Math.PI * 2);
        ctx.fill();

        // Solid Bulb Core
        ctx.fillStyle = '#FFF8E7';
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fill();

        // 3. Render Crystal Wings (Left & Right)
        ctx.save();
        ctx.rotate(-b.wingAngle);
        drawCrystalWing(ctx, 42, 1); // Right wing
        ctx.restore();

        ctx.save();
        ctx.rotate(b.wingAngle);
        drawCrystalWing(ctx, 42, -1); // Left wing
        ctx.restore();

        ctx.restore();
      });

      // Gradually decay mouse velocity
      mouse.vx *= 0.9;
      mouse.vy *= 0.9;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-10 bg-transparent ${className}`}
    />
  );
}