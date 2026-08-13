/** ============================================================
 *  HomePage.jsx — Correct Sequential Flow
 * ============================================================ */

import React, { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import Hero from './Hero';
import Gallery from './Gallery';
import About from './About';

export default function HomePage() {
  const heroContainerRef = useRef(null);

  // Scroll track ONLY for Hero zoom and blackout
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroContainerRef,
    offset: ['start start', 'end end'],
  });

  const galleryOpacity = useTransform(heroProgress, [0.70, 1.0], [0, 1]);

  return (
    <div className="w-full bg-black text-white flex flex-col">
      {/* 1. HERO SECTION TRACK (280vh dedicated exclusively to Hero) */}
      <div ref={heroContainerRef} className="relative h-[280vh] w-full">
        <Hero scrollYProgress={heroProgress} />
      </div>

      {/* 2. GALLERY SECTION TRACK 
          Un-nested from Hero so its internal 1600vh sticky scroll 
          can play out completely before moving down to About.
      */}
      <motion.div 
        style={{ opacity: galleryOpacity }}
        className="relative z-20 w-full"
      >
        <Gallery />
      </motion.div>

      {/* 3. ABOUT SECTION 
          Sits directly below Gallery in DOM flow. 
          Will only be reached after scrolling through Gallery's full height.
      */}
      <div className="relative z-30 w-full">
        <About />
      </div>
    </div>
  );
}