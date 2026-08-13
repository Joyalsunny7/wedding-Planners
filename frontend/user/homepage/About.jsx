/** ============================================================
 *  About.jsx — Executive About Page with 3D Spherical Bowl Chandelier
 * ============================================================ */

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Assets
import aboutBg from '../../assets/about.jpg';

/* ------------------------------------------------------------
 * 3D UPSIDE-DOWN HALF-SPHERICAL BOWL CHANDELIER CANVAS COMPONENT
 * ------------------------------------------------------------ */
function TopTubeChandelier() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight);

    // Mouse interaction tracking
    const mouse = { x: -9999, y: -9999, vx: 0, vy: 0, lastX: 0, lastY: 0 };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      mouse.vx = currentX - mouse.lastX;
      mouse.vy = currentY - mouse.lastY;

      mouse.x = currentX;
      mouse.y = currentY;
      mouse.lastX = currentX;
      mouse.lastY = currentY;
    };

    const handleMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      mouse.vx = 0;
      mouse.vy = 0;
    };

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
      initTubes();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    let tubes = [];
    const COUNT = 520; // High density for 3D spherical dome illusion

    const initTubes = () => {
      tubes = [];
      const centerX = width / 2;
      const ceilingY = -10;
      
      const sphereRadiusX = Math.min(width, 950) * 0.42; // Radius along X
      const sphereRadiusZ = 220;                         // Radius along Z depth
      const maxDip = height * 0.65;                       // Max depth at center tip

      for (let i = 0; i < COUNT; i++) {
        // Uniform distribution over a circular disc footprint (3D Hemisphere Projection)
        const rNorm = Math.sqrt(Math.random()); // Radial distance from center (0 to 1)
        const theta = Math.random() * Math.PI * 2; // Angle around circle

        const x3D = Math.cos(theta) * rNorm * sphereRadiusX;
        const z3D = Math.sin(theta) * rNorm * sphereRadiusZ;

        // Upside-down hemisphere bowl depth equation:
        // Center (rNorm = 0) dips lowest; outer rim (rNorm = 1) stays highest near ceiling
        const domeCurvature = Math.sqrt(Math.max(0, 1 - rNorm * rNorm));
        const targetY = ceilingY + (1 - domeCurvature * 0.82) * maxDip;

        const jitterX = (Math.random() - 0.5) * 4;
        const jitterY = (Math.random() - 0.5) * 8;

        // Color allocation (45% Silver, 40% Gold, 15% Champagne)
        const colorType = Math.random() < 0.45 ? 'silver' : Math.random() < 0.85 ? 'gold' : 'champagne';

        // 3D Perspective Scaling Factor
        const perspective = 600;
        const scale3D = perspective / (perspective + z3D);

        tubes.push({
          anchorX: centerX + x3D * scale3D,
          anchorY: ceilingY,
          baseTipX: centerX + x3D * scale3D + jitterX,
          baseTipY: targetY * scale3D + jitterY,
          z3D,
          scale3D,
          colorType,

          // Physics wave variables
          waveOffsetY: 0,
          waveVelocity: 0,

          // Slender metallic wire dimensions
          tubeWidth: (2.8 + Math.random() * 2.2) * scale3D,
          tubeLength: (20 + Math.random() * 16) * scale3D,
          alpha: Math.min(1.0, Math.max(0.35, 0.5 + (z3D / sphereRadiusZ) * 0.5)),
        });
      }

      // Sort array by Z-depth for 3D render ordering
      tubes.sort((a, b) => b.z3D - a.z3D);
    };

    initTubes();

    // Render Metallic Cylinder Tube (Gold / Silver / Champagne)
    const drawMetallicTube = (context, w, h, type) => {
      context.save();

      const rx = w / 2;
      const ry = w / 3.5;

      // 1. Cylinder Body
      context.beginPath();
      context.moveTo(-rx, 0);
      context.lineTo(-rx, h);
      context.ellipse(0, h, rx, ry, 0, Math.PI, 0, true);
      context.lineTo(rx, 0);
      context.closePath();

      // Silky Metallic Linear Gradients
      const grad = context.createLinearGradient(-rx, 0, rx, 0);

      if (type === 'gold') {
        grad.addColorStop(0.0, '#A87E22');
        grad.addColorStop(0.25, '#FAF3B2');
        grad.addColorStop(0.5, '#FFFFFF'); // Specular sheen
        grad.addColorStop(0.75, '#D4AF37');
        grad.addColorStop(1.0, '#7A5C16');
      } else if (type === 'silver') {
        grad.addColorStop(0.0, '#6C7378');
        grad.addColorStop(0.25, '#E2E7EC');
        grad.addColorStop(0.5, '#FFFFFF'); // Specular sheen
        grad.addColorStop(0.75, '#949CA2');
        grad.addColorStop(1.0, '#454A4E');
      } else {
        // Champagne Gold/Silver blend
        grad.addColorStop(0.0, '#94856E');
        grad.addColorStop(0.25, '#F1E2D3');
        grad.addColorStop(0.5, '#FFFFFF');
        grad.addColorStop(0.75, '#BFAD94');
        grad.addColorStop(1.0, '#635644');
      }

      context.fillStyle = grad;
      context.fill();

      context.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      context.lineWidth = 0.5;
      context.stroke();

      // 2. Top Rim Highlight
      context.beginPath();
      context.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      context.fillStyle = type === 'gold' ? '#FFF8CE' : '#FFFFFF';
      context.fill();

      // 3. Bottom Cap Edge
      context.beginPath();
      context.ellipse(0, h, rx, ry, 0, 0, Math.PI);
      context.strokeStyle = 'rgba(20, 20, 20, 0.55)';
      context.lineWidth = 0.5;
      context.stroke();

      context.restore();
    };

    let time = 0;

    const render = () => {
      time += 0.035;
      ctx.clearRect(0, 0, width, height);

      // --- SILKY LIQUID WAVE PHYSICS ---
      for (let i = 0; i < tubes.length; i++) {
        const t = tubes[i];

        const currentTipX = t.baseTipX;
        const currentTipY = t.baseTipY + t.waveOffsetY;

        const dx = currentTipX - mouse.x;
        const dy = currentTipY - mouse.y;
        const dist = Math.hypot(dx, dy);
        const radius = 90;

        if (dist < radius && Math.hypot(mouse.vx, mouse.vy) > 0.1) {
          const force = (1 - dist / radius) * 7.5;
          t.waveVelocity += (mouse.vy >= 0 ? 1 : -1) * force;
        }

        // Ripple dispersion across neighbors
        if (i > 0) {
          const prev = tubes[i - 1];
          const diff = prev.waveOffsetY - t.waveOffsetY;
          t.waveVelocity += diff * 0.075;
        }
        if (i < tubes.length - 1) {
          const next = tubes[i + 1];
          const diff = next.waveOffsetY - t.waveOffsetY;
          t.waveVelocity += diff * 0.075;
        }

        // Spring restoration and dampening
        const tension = 0.038;
        const damping = 0.89;
        t.waveVelocity -= t.waveOffsetY * tension;
        t.waveVelocity *= damping;
        t.waveOffsetY += t.waveVelocity;
      }

      // --- RENDER WIRE STRINGS & METALLIC TUBES ---
      tubes.forEach((t) => {
        const tipX = t.baseTipX;
        const tipY = t.baseTipY + t.waveOffsetY;

        // 1. Fine Wire Cable
        ctx.beginPath();
        ctx.moveTo(t.anchorX, t.anchorY);
        const midY = (t.anchorY + tipY) / 2;
        const curveOffset = Math.sin(t.waveOffsetY * 0.08 + time) * 1.8;
        ctx.quadraticCurveTo(t.anchorX + curveOffset, midY, tipX, tipY);

        ctx.strokeStyle =
          t.colorType === 'gold'
            ? `rgba(212, 175, 55, ${0.1 + t.alpha * 0.3})`
            : `rgba(200, 215, 230, ${0.1 + t.alpha * 0.3})`;
        ctx.lineWidth = 0.4 + t.scale3D * 0.4;
        ctx.stroke();

        // 2. Render Metallic Tube at Tip
        ctx.save();
        ctx.translate(tipX, tipY);

        // Connector Cap
        ctx.fillStyle = t.colorType === 'gold' ? '#D4AF37' : '#A0A8B0';
        ctx.fillRect(-0.75, -4, 1.5, 4);

        // Metallic Tube Body
        drawMetallicTube(ctx, t.tubeWidth, t.tubeLength, t.colorType);

        ctx.restore();
      });

      mouse.vx *= 0.85;
      mouse.vy *= 0.85;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[380px] md:h-[460px] z-15 pointer-events-none overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}

/* ------------------------------------------------------------
 * MAIN ABOUT COMPONENT
 * ------------------------------------------------------------ */
export default function About() {
  return (
    <section className="relative w-full min-h-screen bg-black text-white font-cormorant overflow-hidden">
      
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <img
          src={aboutBg}
          alt="About Background"
          className="w-full h-full object-cover object-center select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90 z-10" />
      </div>

      {/* 3D Upside-Down Spherical Bowl Tube Chandelier */}
      <TopTubeChandelier />

      {/* Page Content */}
      <div className="relative z-20 max-w-6xl mx-auto px-6 pt-[390px] md:pt-[470px] pb-24 flex flex-col justify-center min-h-screen">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-16 text-center md:text-left"
        >
          <span className="font-marcellus text-amber-400 text-xs md:text-sm uppercase tracking-[0.3em] block mb-3">
            Our Legacy & Passion
          </span>
          <h1 className="text-4xl md:text-7xl font-bold text-[#D4AF37] uppercase tracking-wider leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
            Crafting Unforgettable <br className="hidden md:block" /> Experiences
          </h1>
        </motion.div>

        {/* Narrative & Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="md:col-span-7 space-y-6 text-lg md:text-2xl italic text-amber-100/90 font-medium leading-relaxed drop-shadow-[0_3px_12px_rgba(0,0,0,1)]"
          >
            <p>
              We believe every event is an extraordinary canvas. From meticulously organized seating arrangements to live culinary counters, our dedication lies in elevating ordinary moments into timeless memories.
            </p>
            <p className="not-italic text-base md:text-xl text-gray-300 font-normal leading-normal">
              Whether hosting intimate VIP lounge gatherings, executive banquets, or grand theater seating events, our spaces and service are designed to provide unparalleled luxury and comfort.
            </p>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="md:col-span-5 grid grid-cols-2 gap-6 bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-amber-500/20 shadow-2xl"
          >
            <div className="text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-bold text-[#D4AF37]">10+</h2>
              <p className="text-xs md:text-sm uppercase tracking-widest text-amber-200/80 mt-1">
                Years Experience
              </p>
            </div>

            <div className="text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-bold text-[#D4AF37]">500+</h2>
              <p className="text-xs md:text-sm uppercase tracking-widest text-amber-200/80 mt-1">
                Grand Events
              </p>
            </div>

            <div className="text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-bold text-[#D4AF37]">100%</h2>
              <p className="text-xs md:text-sm uppercase tracking-widest text-amber-200/80 mt-1">
                Curated Detail
              </p>
            </div>

            <div className="text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-bold text-[#D4AF37]">24/7</h2>
              <p className="text-xs md:text-sm uppercase tracking-widest text-amber-200/80 mt-1">
                Dedicated Support
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}