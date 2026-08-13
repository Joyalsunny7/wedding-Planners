/** ============================================================
 *  Gallery.jsx — Dual Scroll Sequences + Extended Ribbon Fade Out
 * ============================================================ */

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

// Assets
import auditoriumBg from "../../assets/auditorium.jpeg";
import pantry from "../../assets/pantry.png";
import pantry1 from "../../assets/pantry1.png";
import pantry2 from "../../assets/pantry2.png";
import pantry3 from "../../assets/pantry3.png";
import pantry4 from "../../assets/pantry4.png";
import pantry5 from "../../assets/pantry5.png";

import chair from "../../assets/chair.png";
import chair1 from "../../assets/chair1.png";
import chair2 from "../../assets/chair2.png";
import chair3 from "../../assets/chair3.png";

const pantryData = [
  {
    img: pantry,
    title: "Main Pantry",
    desc: "Welcome to our central food counter hub—the vibrant heart of our culinary experience. Designed for seamless service and exceptional variety.",
  },
  {
    img: pantry1,
    title: "Box Led Counter",
    desc: "Step up to our Box LED Counter—a sleek, modern focal point illuminated to highlight our freshly prepared daily meals.",
  },
  {
    img: pantry2,
    title: "Salad Counter",
    desc: "Step up to our Salad Counter for a vibrant selection of crisp greens, colorful farm-fresh vegetables, and house-made dressings.",
  },
  {
    img: pantry3,
    title: "Dessert Counter",
    desc: "Our Dessert Counter offers an elegant showcase of delicate baked goods, gourmet sweets, and seasonal treats.",
  },
  {
    img: pantry4,
    title: "Tea Counter",
    desc: "Our Tea Counter celebrates the art of tea with a curated blend of traditional favorites and modern aromatic brews.",
  },
  {
    img: pantry5,
    title: "Live Counter",
    desc: "Bring your event to life with the irresistible aromas and sizzle of our Appam & Dosa Live Station.",
  },
];

const chairData = [
  {
    img: chair,
    title: "Grand Banquet Setup",
    desc: "Experience grand luxury with our primary seating setup. Thoughtfully aligned to maximize guest comfort.",
  },
  {
    img: chair1,
    title: "VIP Lounge Arrangement",
    desc: "Exclusive plush seating engineered for distinguished guests. Offers an intimate atmosphere combined with premium upholstery.",
  },
  {
    img: chair2,
    title: "Executive Table Cluster",
    desc: "Perfectly spaced circular arrangements fostering conversation and celebration.",
  },
  {
    img: chair3,
    title: "Royal Theater Seating",
    desc: "Sleek, structured row arrangements maximizing capacity without sacrificing luxury.",
  },
];

const allItems = [...pantryData, ...chairData];

export default function Gallery() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  /* STAGE 1: BACKGROUND ZOOM (0.00 - 0.08) */
  const bgScale = useTransform(scrollYProgress, [0, 0.08], [3.0, 1.0]);

  /* STAGE 2: PANTRY SECTION (0.08 - 0.42) */
  const pantryYRaw = useTransform(
    scrollYProgress,
    [0.06, 0.8],
    ["0vh", "0vh"],
  );
  const pantryY = useSpring(pantryYRaw, { stiffness: 160, damping: 20 });
  const pantryScaleRaw = useTransform(scrollYProgress, [0.06, 0.1], [0.6, 1.0]);
  const pantryScale = useSpring(pantryScaleRaw, {
    stiffness: 200,
    damping: 18,
  });

  const pOp0 = useTransform(scrollYProgress, [0.1, 0.15, 0.18], [1, 1, 0]);
  const pOp1 = useTransform(
    scrollYProgress,
    [0.15, 0.18, 0.23, 0.26],
    [0, 1, 1, 0],
  );
  const pOp2 = useTransform(
    scrollYProgress,
    [0.23, 0.26, 0.3, 0.33],
    [0, 1, 1, 0],
  );
  const pOp3 = useTransform(
    scrollYProgress,
    [0.3, 0.33, 0.36, 0.38],
    [0, 1, 1, 0],
  );
  const pOp4 = useTransform(
    scrollYProgress,
    [0.36, 0.38, 0.4, 0.42],
    [0, 1, 1, 0],
  );
  const pOp5 = useTransform(
    scrollYProgress,
    [0.4, 0.42, 0.44, 0.46],
    [0, 1, 1, 0],
  );
  const pantryOpacities = [pOp0, pOp1, pOp2, pOp3, pOp4, pOp5];

  const pTitleX0 = useTransform(
    scrollYProgress,
    [0.1, 0.12, 0.15, 0.18],
    ["-150%", "0%", "0%", "-150%"],
  );
  const pTitleX1 = useTransform(
    scrollYProgress,
    [0.16, 0.18, 0.23, 0.26],
    ["-150%", "0%", "0%", "-150%"],
  );
  const pTitleX2 = useTransform(
    scrollYProgress,
    [0.24, 0.26, 0.3, 0.33],
    ["-150%", "0%", "0%", "-150%"],
  );
  const pTitleX3 = useTransform(
    scrollYProgress,
    [0.31, 0.33, 0.36, 0.38],
    ["-150%", "0%", "0%", "-150%"],
  );
  const pTitleX4 = useTransform(
    scrollYProgress,
    [0.37, 0.38, 0.4, 0.42],
    ["-150%", "0%", "0%", "-150%"],
  );
  const pTitleX5 = useTransform(
    scrollYProgress,
    [0.4, 0.42, 0.44, 0.46],
    ["-150%", "0%", "0%", "-150%"],
  );
  const pantryTitleXOffsets = [
    pTitleX0,
    pTitleX1,
    pTitleX2,
    pTitleX3,
    pTitleX4,
    pTitleX5,
  ];

  const pDescX0 = useTransform(
    scrollYProgress,
    [0.11, 0.13, 0.15, 0.18],
    ["-150%", "0%", "0%", "-150%"],
  );
  const pDescX1 = useTransform(
    scrollYProgress,
    [0.17, 0.19, 0.23, 0.26],
    ["-150%", "0%", "0%", "-150%"],
  );
  const pDescX2 = useTransform(
    scrollYProgress,
    [0.25, 0.27, 0.3, 0.33],
    ["-150%", "0%", "0%", "-150%"],
  );
  const pDescX3 = useTransform(
    scrollYProgress,
    [0.32, 0.34, 0.36, 0.38],
    ["-150%", "0%", "0%", "-150%"],
  );
  const pDescX4 = useTransform(
    scrollYProgress,
    [0.38, 0.39, 0.4, 0.42],
    ["-150%", "0%", "0%", "-150%"],
  );
  const pDescX5 = useTransform(
    scrollYProgress,
    [0.41, 0.43, 0.44, 0.46],
    ["-150%", "0%", "0%", "-150%"],
  );
  const pantryDescXOffsets = [
    pDescX0,
    pDescX1,
    pDescX2,
    pDescX3,
    pDescX4,
    pDescX5,
  ];

  /* STAGE 3: PANTRY EXIT (0.42 - 0.48) */
  const pantryExitScale = useTransform(
    scrollYProgress,
    [0.42, 0.48],
    [1.0, 0.8],
  );
  const pantryExitOpacity = useTransform(scrollYProgress, [0.42, 0.48], [1, 0]);
  const pantryExitBlur = useTransform(
    scrollYProgress,
    [0.42, 0.48],
    ["blur(0px)", "blur(16px)"],
  );

  /* STAGE 4: CHAIR SECTION SEQUENCE (0.48 - 0.70) */
  const chairYRaw = useTransform(
    scrollYProgress,
    [0.48, 0.52],
    ["100vh", "0vh"],
  );
  const chairY = useSpring(chairYRaw, { stiffness: 160, damping: 20 });
  const chairScaleRaw = useTransform(scrollYProgress, [0.48, 0.52], [0.6, 1.0]);
  const chairScale = useSpring(chairScaleRaw, { stiffness: 200, damping: 18 });

  const cOp0 = useTransform(
    scrollYProgress,
    [0.5, 0.54, 0.58, 0.61],
    [0, 1, 1, 0],
  );
  const cOp1 = useTransform(
    scrollYProgress,
    [0.59, 0.62, 0.65, 0.68],
    [0, 1, 1, 0],
  );
  const cOp2 = useTransform(
    scrollYProgress,
    [0.66, 0.68, 0.7, 0.72],
    [0, 1, 1, 0],
  );
  const cOp3 = useTransform(
    scrollYProgress,
    [0.71, 0.72, 0.74, 0.75],
    [0, 1, 1, 0],
  );
  const chairOpacities = [cOp0, cOp1, cOp2, cOp3];

  const cTitleY0 = useTransform(
    scrollYProgress,
    [0.5, 0.53, 0.58, 0.61],
    ["-60px", "0px", "0px", "-60px"],
  );
  const cTitleY1 = useTransform(
    scrollYProgress,
    [0.59, 0.61, 0.65, 0.68],
    ["-60px", "0px", "0px", "-60px"],
  );
  const cTitleY2 = useTransform(
    scrollYProgress,
    [0.66, 0.67, 0.7, 0.72],
    ["-60px", "0px", "0px", "-60px"],
  );
  const cTitleY3 = useTransform(
    scrollYProgress,
    [0.71, 0.72, 0.74, 0.75],
    ["-60px", "0px", "0px", "-60px"],
  );
  const chairTitleYOffsets = [cTitleY0, cTitleY1, cTitleY2, cTitleY3];

  const cDescY0 = useTransform(
    scrollYProgress,
    [0.51, 0.54, 0.58, 0.61],
    ["30px", "0px", "0px", "30px"],
  );
  const cDescY1 = useTransform(
    scrollYProgress,
    [0.6, 0.62, 0.65, 0.68],
    ["30px", "0px", "0px", "30px"],
  );
  const cDescY2 = useTransform(
    scrollYProgress,
    [0.67, 0.68, 0.7, 0.72],
    ["30px", "0px", "0px", "30px"],
  );
  const cDescY3 = useTransform(
    scrollYProgress,
    [0.72, 0.73, 0.74, 0.75],
    ["30px", "0px", "0px", "30px"],
  );
  const chairDescYOffsets = [cDescY0, cDescY1, cDescY2, cDescY3];

  /* ------------------------------------------------------------
   * STAGE 5: RECAP RIBBON OUTRO (0.75 - 0.90)
   * ------------------------------------------------------------ */
  const outroOpacity = useTransform(scrollYProgress, [0.75, 0.78], [0, 1]);
  const darkOverlayOpacity = useTransform(
    scrollYProgress,
    [0.75, 0.8],
    [0, 0.95],
  );

  // Map scroll progress to repeat across multiple full 100% loop cycles
  // Changing [-100%, 0%] or multiple cycles creates an endless scrolling ribbon as you scroll
  const rawRibbonLoop = useTransform(
    scrollYProgress,
    [0.75, 0.92],
    ["0%", "-200%"],
  );
  const ribbonX = useSpring(rawRibbonLoop, { stiffness: 45, damping: 22 });
  /* STAGE 6: SIMPLE FADE OUT ENDING (0.90 - 1.00) */
  // Gradual fade out over ~4-5 seconds of continuous upscrolling
  const rawExitOpacity = useTransform(scrollYProgress, [0.9, 0.98], [1, 0]);
  const rawExitBlur = useTransform(
    scrollYProgress,
    [0.92, 1.0],
    ["blur(0px)", "blur(10px)"],
  );

  const exitOpacity = useSpring(rawExitOpacity, { stiffness: 25, damping: 30 });
  const exitBlur = useSpring(rawExitBlur, { stiffness: 25, damping: 30 });

  return (
    <div className="w-full bg-black text-white relative font-cormorant">
      {/* 1600vh height gives ~4-5 seconds of extra scroll track time */}
      <div ref={containerRef} className="relative w-full h-[1600vh]">
        <motion.div
          style={{
            opacity: exitOpacity,
            filter: exitBlur,
          }}
          className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center transform-gpu"
        >
          {/* Base Layer: Background */}
          <motion.div
            style={{ scale: bgScale, transformOrigin: "50% 50%" }}
            className="absolute inset-0 w-full h-full min-h-screen z-0 pointer-events-none transform-gpu"
          >
            <img
              src={auditoriumBg}
              alt="Auditorium Background"
              className="w-full h-full object-cover object-center select-none"
            />
          </motion.div>

          {/* Dark Overlay for Outro */}
          <motion.div
            style={{ opacity: darkOverlayOpacity }}
            className="absolute inset-0 bg-black z-35 pointer-events-none"
          />

          {/* ================= PANTRY SECTION ================= */}
          <motion.div
            style={{
              y: pantryY,
              scale: useTransform(
                pantryScale,
                (s) => s * pantryExitScale.get(),
              ),
              opacity: pantryExitOpacity,
              filter: pantryExitBlur,
            }}
            className="absolute inset-0 w-full h-full min-h-screen z-10 pointer-events-none transform-gpu flex items-center justify-center"
          >
            {pantryData.map((item, idx) => (
              <motion.img
                key={`pantry-img-${idx}`}
                src={item.img}
                alt={item.title}
                style={{ opacity: pantryOpacities[idx] }}
                className="absolute inset-0 w-full h-full object-cover object-center select-none filter drop-shadow-2xl"
              />
            ))}
          </motion.div>

          {/* Pantry Text */}
          <motion.div
            style={{ opacity: pantryExitOpacity }}
            className="absolute left-12 md:left-16 top-1/2 -translate-y-1/2 z-20 pointer-events-none max-w-xl"
          >
            {pantryData.map((item, idx) => (
              <div
                key={`pantry-text-${idx}`}
                className="absolute left-0 top-1/2 -translate-y-1/2"
              >
                <motion.h3
                  style={{
                    x: pantryTitleXOffsets[idx],
                    opacity: pantryOpacities[idx],
                  }}
                  className="text-6xl md:text-8xl font-bold tracking-tight uppercase mb-4 text-[#D4AF37] drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] whitespace-nowrap"
                >
                  {item.title}
                </motion.h3>
                <motion.p
                  style={{
                    x: pantryDescXOffsets[idx],
                    opacity: pantryOpacities[idx],
                  }}
                  className="text-xl md:text-3xl italic text-amber-100/90 font-medium leading-relaxed drop-shadow-[0_3px_12px_rgba(0,0,0,1)]"
                >
                  {item.desc}
                </motion.p>
              </div>
            ))}
          </motion.div>

          {/* ================= CHAIR SECTION ================= */}
          <motion.div
            style={{ y: chairY, scale: chairScale }}
            className="absolute inset-0 w-full h-full min-h-screen z-30 pointer-events-none transform-gpu flex items-center justify-center"
          >
            {chairData.map((item, idx) => (
              <motion.img
                key={`chair-img-${idx}`}
                src={item.img}
                alt={item.title}
                style={{ opacity: chairOpacities[idx] }}
                className="absolute inset-0 w-full h-full object-cover object-center select-none filter drop-shadow-2xl"
              />
            ))}
          </motion.div>

          {/* Chair Text */}
          <div className="absolute top-12 md:top-16 left-1/2 -translate-x-1/2 z-30 pointer-events-none w-full max-w-4xl text-center px-6">
            {chairData.map((item, idx) => (
              <div
                key={`chair-text-${idx}`}
                className="absolute left-1/2 -translate-x-1/2 top-0 w-full"
              >
                <motion.h3
                  style={{
                    y: chairTitleYOffsets[idx],
                    opacity: chairOpacities[idx],
                  }}
                  className="text-5xl md:text-7xl font-bold tracking-tight uppercase mb-3 text-[#D4AF37] drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]"
                >
                  {item.title}
                </motion.h3>
                <motion.p
                  style={{
                    y: chairDescYOffsets[idx],
                    opacity: chairOpacities[idx],
                  }}
                  className="text-xl md:text-3xl italic text-amber-100/90 font-medium leading-relaxed max-w-2xl mx-auto drop-shadow-[0_3px_12px_rgba(0,0,0,1)]"
                >
                  {item.desc}
                </motion.p>
              </div>
            ))}
          </div>

          {/* ================= STAGE 5: RECAP RIBBON OUTRO ================= */}
          <motion.div
            style={{ opacity: outroOpacity }}
            className="absolute inset-0 z-40 flex flex-col justify-center items-center pointer-events-none overflow-hidden"
          >
            <div className="text-center mb-8 px-6">
              <span className="font-marcellus text-amber-400 text-xs md:text-sm uppercase tracking-[0.3em] block mb-2">
                Gallery Overview
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-[#D4AF37] uppercase tracking-wider drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
                Every Detail, Thoughtfully Curated
              </h2>
            </div>

            {/* Seamless Looping Ribbon Container */}
            <div className="w-full overflow-hidden py-4">
              <motion.div
                style={{ x: ribbonX }}
                className="flex gap-6 w-max px-6"
              >
                {/* Tripled array guarantees no empty space during scrolling */}
                {[...allItems, ...allItems, ...allItems, ...allItems].map(
                  (tile, i) => (
                    <div
                      key={`recap-tile-${i}`}
                      className="relative w-64 h-40 md:w-80 md:h-48 rounded-xl overflow-hidden border border-amber-500/30 bg-black/60 shadow-xl flex-shrink-0 group"
                    >
                      <img
                        src={tile.img}
                        alt={tile.title}
                        className="w-full h-full object-cover object-center opacity-80 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end p-4">
                        <span className="text-amber-200 text-lg font-semibold tracking-wide">
                          {tile.title}
                        </span>
                      </div>
                    </div>
                  ),
                )}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
