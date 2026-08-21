/** ============================================================
 *  About.jsx — Executive About Page with 3D Spherical Bowl Chandelier
 * ============================================================ */

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  MapPin,
  Palette,
  CalendarDays,
  Car,
  Camera,
  Music,
  Users,
  Sparkles,
  CheckCircle2,
  Compass,
  Smile,
  ShieldCheck,
} from "lucide-react";

// Assets
import aboutBg from "../../assets/about.jpg";
import sujeeshImg from "../../assets/Sujeesh.jpeg";
import { Link } from "react-router-dom";
import Navbar from "../navbar/Navbar";

/* ------------------------------------------------------------
 * 3D UPSIDE-DOWN HALF-SPHERICAL BOWL CHANDELIER CANVAS COMPONENT
 * ------------------------------------------------------------ */
function TopTubeChandelier() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
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

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    let tubes = [];
    const COUNT = 520; // High density for 3D spherical dome illusion

    const initTubes = () => {
      tubes = [];
      const centerX = width / 2;
      const ceilingY = -10;

      const sphereRadiusX = Math.min(width, 950) * 0.42; // Radius along X
      const sphereRadiusZ = 220; // Radius along Z depth
      const maxDip = height * 0.65; // Max depth at center tip

      for (let i = 0; i < COUNT; i++) {
        const rNorm = Math.sqrt(Math.random()); // Radial distance from center (0 to 1)
        const theta = Math.random() * Math.PI * 2; // Angle around circle

        const x3D = Math.cos(theta) * rNorm * sphereRadiusX;
        const z3D = Math.sin(theta) * rNorm * sphereRadiusZ;

        const domeCurvature = Math.sqrt(Math.max(0, 1 - rNorm * rNorm));
        const targetY = ceilingY + (1 - domeCurvature * 0.82) * maxDip;

        const jitterX = (Math.random() - 0.5) * 4;
        const jitterY = (Math.random() - 0.5) * 8;

        const colorType =
          Math.random() < 0.45
            ? "silver"
            : Math.random() < 0.85
              ? "gold"
              : "champagne";

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
          waveOffsetY: 0,
          waveVelocity: 0,
          tubeWidth: (2.8 + Math.random() * 2.2) * scale3D,
          tubeLength: (20 + Math.random() * 16) * scale3D,
          alpha: Math.min(
            1.0,
            Math.max(0.35, 0.5 + (z3D / sphereRadiusZ) * 0.5),
          ),
        });
      }

      tubes.sort((a, b) => b.z3D - a.z3D);
    };

    initTubes();

    const drawMetallicTube = (context, w, h, type) => {
      context.save();

      const rx = w / 2;
      const ry = w / 3.5;

      context.beginPath();
      context.moveTo(-rx, 0);
      context.lineTo(-rx, h);
      context.ellipse(0, h, rx, ry, 0, Math.PI, 0, true);
      context.lineTo(rx, 0);
      context.closePath();

      const grad = context.createLinearGradient(-rx, 0, rx, 0);

      if (type === "gold") {
        grad.addColorStop(0.0, "#A87E22");
        grad.addColorStop(0.25, "#FAF3B2");
        grad.addColorStop(0.5, "#FFFFFF");
        grad.addColorStop(0.75, "#D4AF37");
        grad.addColorStop(1.0, "#7A5C16");
      } else if (type === "silver") {
        grad.addColorStop(0.0, "#6C7378");
        grad.addColorStop(0.25, "#E2E7EC");
        grad.addColorStop(0.5, "#FFFFFF");
        grad.addColorStop(0.75, "#949CA2");
        grad.addColorStop(1.0, "#454A4E");
      } else {
        grad.addColorStop(0.0, "#94856E");
        grad.addColorStop(0.25, "#F1E2D3");
        grad.addColorStop(0.5, "#FFFFFF");
        grad.addColorStop(0.75, "#BFAD94");
        grad.addColorStop(1.0, "#635644");
      }

      context.fillStyle = grad;
      context.fill();

      context.strokeStyle = "rgba(255, 255, 255, 0.45)";
      context.lineWidth = 0.5;
      context.stroke();

      context.beginPath();
      context.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      context.fillStyle = type === "gold" ? "#FFF8CE" : "#FFFFFF";
      context.fill();

      context.beginPath();
      context.ellipse(0, h, rx, ry, 0, 0, Math.PI);
      context.strokeStyle = "rgba(20, 20, 20, 0.55)";
      context.lineWidth = 0.5;
      context.stroke();

      context.restore();
    };

    let time = 0;

    const render = () => {
      time += 0.035;
      ctx.clearRect(0, 0, width, height);

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

        const tension = 0.038;
        const damping = 0.89;
        t.waveVelocity -= t.waveOffsetY * tension;
        t.waveVelocity *= damping;
        t.waveOffsetY += t.waveVelocity;
      }

      tubes.forEach((t) => {
        const tipX = t.baseTipX;
        const tipY = t.baseTipY + t.waveOffsetY;

        ctx.beginPath();
        ctx.moveTo(t.anchorX, t.anchorY);
        const midY = (t.anchorY + tipY) / 2;
        const curveOffset = Math.sin(t.waveOffsetY * 0.08 + time) * 1.8;
        ctx.quadraticCurveTo(t.anchorX + curveOffset, midY, tipX, tipY);

        ctx.strokeStyle =
          t.colorType === "gold"
            ? `rgba(212, 175, 55, ${0.1 + t.alpha * 0.3})`
            : `rgba(200, 215, 230, ${0.1 + t.alpha * 0.3})`;
        ctx.lineWidth = 0.4 + t.scale3D * 0.4;
        ctx.stroke();

        ctx.save();
        ctx.translate(tipX, tipY);

        ctx.fillStyle = t.colorType === "gold" ? "#D4AF37" : "#A0A8B0";
        ctx.fillRect(-0.75, -4, 1.5, 4);

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
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[380px] md:h-[460px] z-15 pointer-events-none overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}

/* ------------------------------------------------------------
 * DATA STRUCTURES
 * ------------------------------------------------------------ */
const services = [
  {
    icon: CalendarDays,
    title: "Complete Wedding Planning",
    description:
      "We help plan and coordinate the wedding from the initial concept through the final execution.",
  },
  {
    icon: MapPin,
    title: "Venue Assistance",
    description:
      "We help couples explore and select suitable wedding venues based on their requirements, guest count, style, location, and budget.",
  },
  {
    icon: Palette,
    title: "Wedding Décor & Theme",
    description:
      "From traditional elegance to contemporary concepts, we help create a wedding atmosphere that reflects the couple's personality.",
  },
  {
    icon: Sparkles,
    title: "Stage & Floral Décor",
    description:
      "We coordinate stage decoration, floral arrangements, entrance décor, table arrangements, and other visual elements.",
  },
  {
    icon: Users,
    title: "Bridal & Groom Coordination",
    description:
      "Our team helps coordinate important wedding-day requirements so the bride, groom, and families can focus on enjoying the celebration.",
  },
  {
    icon: CalendarDays,
    title: "Wedding Day Coordination",
    description:
      "We manage the schedule, vendors, ceremonies, arrangements, and important moments so everything stays on track.",
  },
  {
    icon: Music,
    title: "Entertainment & Programs",
    description:
      "From live music and DJs to traditional performances and special programs, we coordinate entertainment according to the wedding concept.",
  },
  {
    icon: Car,
    title: "Wedding Transportation",
    description:
      "We assist with transportation arrangements for the couple, families, guests, and important wedding requirements.",
  },
  {
    icon: Camera,
    title: "Photography Coordination",
    description:
      "We coordinate with photography and cinematography teams to ensure the important moments of the wedding are captured beautifully.",
  },
  {
    icon: Compass,
    title: "Destination Weddings",
    description:
      "For couples travelling to Kerala, SKS Wedding Planners can assist with planning and coordinating destination weddings across beautiful Kerala locations.",
  },
];

const planningSteps = [
  {
    number: "01",
    title: "Understand",
    description:
      "We start by understanding your story, expectations, traditions, preferences, guest requirements, and budget.",
  },
  {
    number: "02",
    title: "Plan",
    description:
      "Our team develops the wedding plan and coordinates the necessary services, vendors, venues, décor, entertainment, and logistics.",
  },
  {
    number: "03",
    title: "Coordinate",
    description:
      "As the wedding approaches, we bring all the moving pieces together and keep communication flowing between everyone involved.",
  },
  {
    number: "04",
    title: "Execute",
    description:
      "On the big day, our team takes care of the coordination so you and your family can be present in the moment.",
  },
  {
    number: "05",
    title: "Celebrate",
    description:
      "The result is what matters most — a wedding you can remember, not a wedding you had to manage.",
  },
];

const destinationItems = [
  "Venue selection",
  "Wedding planning",
  "Décor coordination",
  "Guest arrangements",
  "Transportation",
  "Wedding-day coordination",
  "Entertainment",
  "Photography coordination",
  "Ceremony planning",
  "Vendor coordination",
];

const whyChooseUs = [
  {
    icon: Users,
    title: "Dedicated Wedding Team",
    description:
      "Our focus is weddings and the details that make them special.",
  },
  {
    icon: Sparkles,
    title: "Personalised Planning",
    description: "Your wedding should reflect your story, not a template.",
  },
  {
    icon: ShieldCheck,
    title: "Professional Coordination",
    description:
      "We coordinate the different people and services involved in your celebration.",
  },
  {
    icon: MapPin,
    title: "Kerala Expertise",
    description:
      "Local understanding of Kerala's venues, traditions, culture, and wedding requirements.",
  },
  {
    icon: Heart,
    title: "Family-Focused Approach",
    description:
      "We work closely with couples and families throughout the planning journey.",
  },
  {
    icon: Smile,
    title: "Stress-Free Celebrations",
    description:
      "Our goal is to take the planning pressure away so you can enjoy your wedding.",
  },
];

/* ------------------------------------------------------------
 * MAIN ABOUT COMPONENT
 * ------------------------------------------------------------ */
export default function About() {
  return (
    <main className="bg-[#080808] text-white min-h-screen font-sans overflow-hidden">
      {/* Glassmorphic Navbar present across all nested routes */}
      <Navbar />

      {/* HERO SECTION WITH 3D CANVAS CHANDELIER */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16">
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          {aboutBg && (
            <img
              src={aboutBg}
              alt="About Background"
              className="w-full h-full object-cover object-center select-none opacity-40"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90 z-10" />
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[150px] rounded-full z-10" />
        </div>

        <TopTubeChandelier />

        <div className="relative z-20 max-w-6xl mx-auto px-6 text-center pt-[200px] md:pt-[240px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-bold text-[#D4AF37] tracking-tight leading-tight">
              Turning Wedding Dreams <br className="hidden md:block" /> Into
              Beautiful Celebrations
            </h1>

            <p className="mt-8 max-w-3xl mx-auto text-base md:text-xl text-gray-300 leading-relaxed font-light">
              SKS Wedding Planners is a dedicated wedding planning and
              coordination team focused on creating memorable, beautifully
              organised wedding celebrations.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <Link
                to="/order"
                className="inline-block px-8 py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-stone-950 font-semibold rounded-lg shadow-[0_0_15px_rgba(251,191,36,0.3)] hover:brightness-110 transition"
              >
                Plan Your Wedding
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-amber-500/30 bg-white/5 hover:bg-white/10 text-amber-200 transition"
              >
                Contact SKS
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ABOUT SKS INTRODUCTION */}
      <section className="py-20 border-t border-amber-500/10 bg-[#0c0c0c]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="md:col-span-7 space-y-6 text-base md:text-lg text-gray-300 leading-relaxed"
            >
              <span className="text-amber-400 uppercase tracking-[0.25em] text-xs font-semibold block">
                About SKS Wedding Planners
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white leading-snug">
                Every Couple Deserves a Wedding That Feels Uniquely Theirs
              </h2>
              <p>
                From the first conversation to the final moment of the
                celebration, our team works closely with couples and families to
                understand their vision, plan every detail, coordinate the right
                people, and make sure the wedding day flows smoothly.
              </p>
              <p className="text-amber-100/90 italic font-serif text-lg md:text-xl border-l-2 border-amber-500 pl-4 py-1">
                "We believe a wedding is more than a ceremony. It is a
                celebration of love, family, tradition, and togetherness."
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="md:col-span-5 relative"
            >
              <div className="absolute -inset-2 bg-gradient-to-tr from-amber-500/20 to-orange-500/20 blur-2xl rounded-3xl" />
              <div className="relative aspect-[3/4] min-h-[420px] rounded-2xl overflow-hidden border border-amber-500/20 bg-black/60 flex items-center justify-center p-6 text-center">
                <img
                  src={sujeeshImg}
                  alt="SKS Wedding Atmosphere"
                  className="absolute inset-0 w-full h-full object-cover object-top opacity-60"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="relative z-10 space-y-3">
                  <Heart size={40} className="mx-auto text-amber-400" />
                  <p className="text-xl font-serif text-amber-200">
                    Crafting Timeless Memories
                  </p>
                  <p className="text-xs text-gray-400 uppercase tracking-widest">
                    Across Kerala
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* OUR WEDDING PLANNING SERVICES */}
      <section className="py-24 bg-[#080808]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-amber-400 uppercase tracking-[0.25em] text-xs font-semibold block mb-3">
              What We Do
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#D4AF37]">
              Our Wedding Planning Services
            </h2>
            <p className="mt-4 text-gray-400 text-base md:text-lg">
              Our team provides complete wedding planning assistance, covering
              every important part of the celebration.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="p-8 rounded-2xl border border-amber-500/15 bg-gradient-to-b from-white/[0.03] to-transparent hover:border-amber-500/40 hover:bg-amber-500/[0.02] transition group"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition duration-300">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-white mb-3 group-hover:text-amber-300 transition">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {service.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* THE TEAM BEHIND YOUR WEDDING */}
      <section className="py-24 bg-[#0c0c0c] border-y border-amber-500/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 space-y-6"
            >
              <span className="text-amber-400 uppercase tracking-[0.25em] text-xs font-semibold block">
                The Team Behind Your Wedding
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight">
                Meet the SKS Wedding Planning Team
              </h2>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                A beautiful wedding doesn't happen by accident. Behind every
                perfectly timed entrance, beautifully decorated venue, organised
                ceremony, and memorable celebration is a team working quietly
                behind the scenes.
              </p>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                SKS Wedding Planners brings together wedding coordinators and
                planning professionals who work closely with couples, families,
                decorators, photographers, entertainers, venues, and other
                wedding partners.
              </p>

              <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <p className="text-xs uppercase tracking-widest text-amber-400 mb-1">
                  Our Responsibility Is Simple
                </p>
                <p className="text-xl md:text-2xl font-serif font-bold text-amber-200">
                  You enjoy the wedding. We take care of the details.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 text-center"
            >
              <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-black/80 aspect-[4/3] flex flex-col items-center justify-center p-6 shadow-2xl">
                <div className="relative z-10 bg-black/70 backdrop-blur-md p-6 rounded-2xl border border-amber-500/20 max-w-md">
                  <Users size={36} className="mx-auto text-amber-400 mb-3" />
                  <p className="text-lg font-serif font-semibold text-amber-300">
                    The SKS Wedding Planners Team
                  </p>
                  <p className="text-xs text-gray-300 mt-2 italic">
                    Planning the details. Coordinating the moments. Creating
                    unforgettable weddings.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* OUR WEDDING PLANNING APPROACH */}
      <section className="py-24 bg-[#080808]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-amber-400 uppercase tracking-[0.25em] text-xs font-semibold block mb-3">
              How We Work
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#D4AF37]">
              Our Wedding Planning Approach
            </h2>
            <p className="mt-4 text-gray-400 text-base md:text-lg italic">
              Every couple is different. So every wedding should be different
              too.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {planningSteps.map((step, idx) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative p-6 rounded-2xl border border-amber-500/20 bg-white/[0.02] hover:bg-amber-500/[0.04] transition flex flex-col justify-between"
              >
                <div>
                  <span className="text-4xl font-serif font-bold text-amber-400/30 block mb-4">
                    {step.number}
                  </span>
                  <h3 className="text-xl font-serif font-semibold text-amber-300 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* KERALA DESTINATION WEDDINGS */}
      <section className="py-24 bg-[#0c0c0c] border-t border-amber-500/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 space-y-6"
            >
              <span className="text-amber-400 uppercase tracking-[0.25em] text-xs font-semibold block">
                Destination Weddings
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight">
                Kerala Destination Weddings
              </h2>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                Kerala is one of India's most popular destination wedding
                locations, offering backwaters, beaches, heritage properties,
                and luxury resorts.
              </p>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                If you are planning a destination wedding in Kerala, SKS Wedding
                Planners helps coordinate local requirements, venues, vendors,
                stay, guest logistics, and celebration arrangements.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-4">
                {destinationItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-sm text-gray-300"
                  >
                    <CheckCircle2
                      size={16}
                      className="text-amber-400 shrink-0"
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6"
            >
              <div className="p-8 rounded-3xl border border-amber-500/20 bg-gradient-to-b from-amber-500/10 to-transparent space-y-6">
                <Compass size={40} className="text-amber-400" />
                <h3 className="text-2xl font-serif font-bold text-amber-200">
                  Planning a Destination Wedding from Abroad or Out-of-State?
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  We handle ground operations and vendor management locally in
                  Kerala so you can stay stress-free wherever you are located
                  during the planning phase.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 bg-[#080808]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-amber-400 uppercase tracking-[0.25em] text-xs font-semibold block mb-3">
              Why SKS
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#D4AF37]">
              Why Choose SKS Wedding Planners
            </h2>
            <p className="mt-4 text-gray-400 text-base md:text-lg">
              We bring commitment, local expertise, and attention to detail to
              every celebration.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="p-8 rounded-2xl border border-amber-500/15 bg-gradient-to-b from-white/[0.03] to-transparent hover:border-amber-500/40 transition group"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition duration-300">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-white mb-3 group-hover:text-amber-300 transition">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}