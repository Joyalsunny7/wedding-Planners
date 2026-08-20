/** ============================================================
 *  Hero.jsx — Cinematic zoom → blackout → reveal sequence.
 *  Receives `scrollYProgress` from the parent HomePage wrapper.
 * ============================================================ */

import React, { useEffect, useRef } from "react";
import { motion, useTransform } from "framer-motion";
import { Sparkles as SparklesIcon } from "lucide-react";

// Assets
import bgImg from "../../assets/background .jpeg";
import logoImg from "../../assets/logo.png";
import Navbar from "../navbar/Navbar"

function GlitterCanvas({ canvasRef, opacity }) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;

    let width = window.innerWidth;
    let height = window.innerHeight;

    /* ---------------- Cursor (tracked continuously) ---------------- */
    const mouse = { x: -9999, y: -9999, vx: 0, vy: 0 };

    /* ---------------- Shape drawer (round / diamond / oval) ---------- */
    const drawSpec = (context, shape, r) => {
      context.beginPath();
      if (shape === "diamond") {
        context.moveTo(0, -r * 1.8);
        context.lineTo(r * 0.8, 0);
        context.lineTo(0, r * 1.8);
        context.lineTo(-r * 0.8, 0);
        context.closePath();
      } else if (shape === "oval") {
        context.ellipse(0, 0, r * 1.6, r * 0.9, 0, 0, Math.PI * 2);
      } else {
        context.arc(0, 0, r, 0, Math.PI * 2);
      }
      context.fill();
    };

    /* ---------------- Background Stars (100–150) ---------------- */
    const STAR_TARGET = 130;
    const STAR_RGBS = ["255,255,255", "214,210,255", "255,236,200"];
    const starColor = () =>
      `rgba(${STAR_RGBS[Math.floor(Math.random() * STAR_RGBS.length)]},`;
    const spawnStar = () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 0.5 + Math.random() * 1.6,
      color: starColor(),
      alpha: 0.12 + Math.random() * 0.3,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.3 + Math.random() * 1.1,
    });
    const stars = [];
    for (let i = 0; i < STAR_TARGET; i += 1) stars.push(spawnStar());

    /* ---------------- Glitter Particles (350–400) ---------------- */
    const GOLD_COLORS = ["#ffd700", "#ffffff", "#fff8dc"];
    const PARTICLE_TARGET = 375;
    const SHATTER_RADIUS = 60;
    const SWIRL_RADIUS = 150;
    const particles = [];

    const spawnParticle = (overrides = {}) => {
      const rnd = Math.random();
      const vxBase = (Math.random() - 0.5) * 0.22;
      const vyBase = 0.12 + Math.random() * 0.28;
      return {
        x: overrides.x !== undefined ? overrides.x : Math.random() * width,
        y: overrides.y !== undefined ? overrides.y : Math.random() * height,
        size: 1 + Math.random() * 3,
        shape: rnd < 0.38 ? "round" : rnd < 0.72 ? "diamond" : "oval",
        color: GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)],
        alpha:
          overrides.alpha !== undefined
            ? overrides.alpha
            : 0.6 + Math.random() * 0.4,
        rotation: Math.random() * Math.PI,
        vxBase,
        vyBase,
        vx: overrides.vx !== undefined ? overrides.vx : 0,
        vy: overrides.vy !== undefined ? overrides.vy : 0,
        active: true,
        respawn: 0,
      };
    };
    for (let i = 0; i < PARTICLE_TARGET; i += 1)
      particles.push(spawnParticle());

    /* ---------------- Fragment pool ---------------- */
    const FRAG_POOL = 900;
    const frags = [];
    for (let i = 0; i < FRAG_POOL; i += 1) {
      frags.push({
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        size: 0,
        color: "#fff",
        alpha: 0,
        rotation: 0,
        vrot: 0,
        active: false,
      });
    }
    let fragPtr = 0;

    /* ---------------- Resize (full-viewport) ---------------- */
    const applySize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    applySize();
    window.addEventListener("resize", applySize);

    /* ---------------- Scroll: keep coverage seamless ---------------- */
    const onScroll = () => {
      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        if (Math.random() < 0.02) {
          if (p.y < 0 || p.y > height) p.y = Math.random() * height;
          if (p.x < 0 || p.x > width) p.x = Math.random() * width;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    /* ---------------- Mouse tracking (position + velocity) ------- */
    let lastX = null;
    let lastY = null;
    let lastT = 0;

    const onMouseMove = (e) => {
      const now = performance.now();
      const dt = Math.max(8, now - lastT);
      lastT = now;
      if (lastX !== null) {
        mouse.vx = (e.clientX - lastX) / dt;
        mouse.vy = (e.clientY - lastY) / dt;
      }
      lastX = e.clientX;
      lastY = e.clientY;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      mouse.vx = 0;
      mouse.vy = 0;
      lastX = null;
      lastY = null;
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseout", onMouseLeave);

    /* ---------------- Stone-shatter dispersal physics ---------------- */
    const shatterParticle = (p) => {
      const count = 2 + Math.floor(Math.random() * 2);
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const mag = Math.hypot(dx, dy) || 1;
      const baseAngle = Math.atan2(dy / mag, dx / mag);

      for (let i = 0; i < count; i += 1) {
        const f = frags[fragPtr];
        fragPtr = (fragPtr + 1) % FRAG_POOL;
        const angle = baseAngle + (Math.random() - 0.5) * Math.PI * 0.9;
        const speed = 6 + Math.random() * 7;
        f.x = p.x;
        f.y = p.y;
        f.vx = Math.cos(angle) * speed;
        f.vy = Math.sin(angle) * speed;
        f.size = 0.4 + Math.random() * 1.5;
        f.color = p.color;
        f.alpha = 0.85 + Math.random() * 0.15;
        f.rotation = Math.random() * Math.PI * 2;
        f.vrot = (Math.random() - 0.5) * 0.6;
        f.active = true;
      }

      p.active = false;
      p.respawn = 80 + Math.floor(Math.random() * 50);
    };

    const respawnParticle = (p) => {
      const edge = Math.floor(Math.random() * 4);
      const pad = 24;
      let x = 0;
      let y = 0;
      let vx = 0;
      let vy = 0;
      if (edge === 0) {
        x = Math.random() * width;
        y = -pad;
        vy = 0.35 + Math.random() * 0.7;
      } else if (edge === 1) {
        x = Math.random() * width;
        y = height + pad;
        vy = -(0.35 + Math.random() * 0.7);
      } else if (edge === 2) {
        x = -pad;
        y = Math.random() * height;
        vx = 0.35 + Math.random() * 0.7;
      } else {
        x = width + pad;
        y = Math.random() * height;
        vx = -(0.35 + Math.random() * 0.7);
      }

      const fresh = spawnParticle({ x, y, vx, vy, alpha: 0 });
      fresh.shape = p.shape;
      Object.assign(p, fresh);
      p.active = true;
    };

    /* ---------------- RAF animation loop (60fps) ---------------- */
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Background stars: static, faintly shimmering.
      for (let i = 0; i < stars.length; i += 1) {
        const s = stars[i];
        s.twinkle += 0.01 * s.twinkleSpeed;
        const a = Math.max(
          0.05,
          Math.min(0.5, s.alpha + Math.sin(s.twinkle) * 0.07),
        );
        ctx.globalAlpha = a;
        ctx.fillStyle = s.color + "0.8)";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Glitter particles: water-flow shift + shatter.
      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];

        if (p.active) {
          p.x += p.vx + p.vxBase;
          p.y += p.vy + p.vyBase;
          p.vx *= 0.985;
          p.vy *= 0.985;
          p.rotation += 0.002;

          if (p.y > height + 6) {
            p.y = -6;
            p.x = Math.random() * width;
          }
          if (p.x > width + 6) p.x = -6;
          if (p.x < -6) p.x = width + 6;

          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);

          // Stone-shatter on direct fast contact (60px).
          if (dist < SHATTER_RADIUS) {
            shatterParticle(p);
            continue;
          }

          // Water-flow ripple within 150px following cursor trajectory.
          if (dist < SWIRL_RADIUS && dist > 0.001) {
            const falloff = 1 - dist / SWIRL_RADIUS;
            const dirX = dx / dist;
            const dirY = dy / dist;
            p.vx += (mouse.vx * 0.5 - dirX * 0.4) * falloff * 0.35;
            p.vy += (mouse.vy * 0.5 - dirY * 0.4) * falloff * 0.35;
          }

          if (p.alpha < 0.8) p.alpha = Math.min(0.85, p.alpha + 0.02);

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = p.alpha;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 7;
          ctx.fillStyle = p.color;
          drawSpec(ctx, p.shape, p.size);
          ctx.restore();
        } else if (p.respawn > 0) {
          p.respawn -= 1;
          if (p.respawn <= 0) respawnParticle(p);
        }
      }

      // Fragments: shoot out, never return, fade away.
      for (let i = 0; i < frags.length; i += 1) {
        const f = frags[i];
        if (!f.active) continue;

        f.x += f.vx;
        f.y += f.vy;
        f.vx *= 0.985;
        f.vy *= 0.985;
        f.rotation += f.vrot;
        f.alpha -= 0.02;

        if (
          f.alpha <= 0 ||
          f.x < -60 ||
          f.x > width + 60 ||
          f.y < -60 ||
          f.y > height + 60
        ) {
          f.active = false;
          continue;
        }

        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.rotation);
        ctx.globalAlpha = Math.max(0, f.alpha);
        ctx.shadowColor = "rgba(255,215,0,0.5)";
        ctx.shadowBlur = 5;
        ctx.fillStyle = f.color;
        ctx.beginPath();
        ctx.arc(0, 0, f.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", applySize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseout", onMouseLeave);
    };
  }, [canvasRef]);

  return (
    <motion.canvas
      ref={canvasRef}
      style={{ opacity }}
      className="fixed inset-0 pointer-events-none z-10 bg-transparent"
      aria-hidden="true"
    />
  );
}

/* ============================================================
 * 2. HERO — sticky zoom + blackout timeline
 * ============================================================ */

export default function Hero({ scrollYProgress }) {
  const canvasRef = useRef(null);

  /* ---- Scroll timeline ---- */
  const heroTextOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  // Fades out ALL hero background/particle/content layers as the user
  // transitions into the Gallery, so nothing bleeds through.
  const heroFade = useTransform(scrollYProgress, [0.35, 0.45], [1, 0]);
  // Logo zooms from the center, scales moderately, and fades smoothly
  // to pure black during the zoom before the blackout pass-through.
  const logoScale = useTransform(scrollYProgress, [0, 0.42], [1, 8]);
  const logoOpacity = useTransform(scrollYProgress, [0.15, 0.4], [1, 0]);

  return (
    <>
  {/* Glassmorphic Navbar present across all nested routes */}
      <Navbar />
      {/* ---- Fixed curtain background (z-0), fades out leaving the gallery ---- */}
      <motion.div style={{ opacity: heroFade }} className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bgImg})` }}
        />
        <div className="absolute inset-0 bg-black/75" />
      </motion.div>

      {/* ---- Fixed transparent particle canvas (z-10), fades out in gallery ---- */}
      <GlitterCanvas canvasRef={canvasRef} opacity={heroFade} />

      {/* ---- Sticky hero view (z-20), fades out in gallery ---- */}
      <motion.div
        style={{ opacity: heroFade }}
        className="sticky top-0 z-20 flex h-screen w-full flex-col items-center justify-between overflow-hidden bg-transparent py-10 px-4"
      >
        {/* Top: glassmorphic badge */}
        <motion.div
          style={{ opacity: heroTextOpacity }}
          className="w-full text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,215,160,0.3)] bg-white/5 px-5 py-2 text-[0.7rem] uppercase tracking-[0.15em] text-[#fcd34d] backdrop-blur-xl shadow-lg md:text-xs">
            <SparklesIcon size={14} /> A Forever Celebration
          </div>
        </motion.div>

        {/* Center: clean, crisp circular logo card with zero fluid overlays */}
        <motion.div
          className="relative w-64 h-64 md:w-80 md:h-80 aspect-square rounded-full overflow-hidden flex items-center justify-center bg-black shadow-2xl shrink-0 z-20"
          style={{
            scale: logoScale,
            opacity: logoOpacity,
            transformOrigin: "50% 50%", // Zoom from the exact center of the logo card
          }}
        >
          <img
            src={logoImg}
            alt="SKS Logo"
            draggable={false}
            className="w-full h-full object-cover select-none pointer-events-none [image-rendering:crisp-edges] [image-rendering:-webkit-optimize-contrast]"
          />
        </motion.div>

        {/* Bottom: subtitle */}
        <motion.p
          style={{ opacity: heroTextOpacity }}
          className="max-w-2xl text-center text-base font-light leading-relaxed text-[#d1d5db] md:text-lg"
        >
          Plan today. Celebrate tomorrow. Reserve your wedding date with
          confidence.
        </motion.p>
      </motion.div>
    </>
  );
}
