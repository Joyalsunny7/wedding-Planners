/** ============================================================
 *  HomePage.jsx — Optimized Preloader Flow
 * ============================================================ */

import React, { useRef, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import Hero from "./Hero";
import Gallery from "./Gallery";
import About from "./About";
import SKSLogoLoader from "./SKSLogoLoader";

export default function HomePage() {
  const [isPreloaderDone, setIsPreloaderDone] = useState(false);
  const heroContainerRef = useRef(null);

  // Scroll track ONLY for Hero zoom and blackout
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroContainerRef,
    offset: ["start start", "end end"],
  });

  const galleryOpacity = useTransform(heroProgress, [0.7, 1.0], [0, 1]);

  return (
    <div className="bg-[#0c0c0c] min-h-screen text-white relative">
      {/* 📍 Preloader overlays full screen until ready */}
      <SKSLogoLoader 
        minDuration={2500} 
        onComplete={() => setIsPreloaderDone(true)} 
      />

      <div className="w-full bg-black text-white flex flex-col">
        {/* 1. HERO SECTION TRACK (280vh dedicated exclusively to Hero) */}
        <div ref={heroContainerRef} className="relative h-[280vh] w-full">
          <Hero scrollYProgress={heroProgress} />
        </div>

        {/* 2. GALLERY SECTION TRACK */}
        <motion.div
          style={{ opacity: galleryOpacity }}
          className="relative z-20 w-full"
        >
          <Gallery />
        </motion.div>

        {/* 3. ABOUT SECTION */}
        <div className="relative z-30 w-full">
          <About />
        </div>
      </div>
    </div>
  );
}