import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SKSLogoLoader({ 
  logoSrc, 
  alt = "SKS Wedding Planners",
  minDuration = 2500, // Duration to allow the full write-on reveal to complete
  onComplete 
}) {
  const [logoUrl, setLogoUrl] = useState(logoSrc || null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    // 1. Lock scrolling while preloader is active
    document.body.style.overflow = "hidden";

    // 2. Dynamic Lazy Load for default logo
    let active = true;

    async function loadLogo() {
      let finalSrc = logoSrc;

      if (!finalSrc) {
        const module = await import("../../assets/logo1.png");
        finalSrc = module.default;
      }

      if (active) {
        setLogoUrl(finalSrc);

        const img = new Image();
        img.src = finalSrc;
        img.onload = () => {
          if (active) setIsLoaded(true);
        };
      }
    }

    loadLogo();

    // 3. Keep preloader visible for smooth entry, then trigger complete
    const timer = setTimeout(() => {
      setShowPreloader(false);
      document.body.style.overflow = "unset";
      if (onComplete) onComplete();
    }, minDuration);

    return () => {
      active = false;
      clearTimeout(timer);
      document.body.style.overflow = "unset";
    };
  }, [logoSrc, minDuration, onComplete]);

  return (
    <AnimatePresence>
      {showPreloader && (
        <motion.div
          key="sks-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0c0c0c] text-white"
        >
          {/* Background Ambient Glow */}
          <div className="absolute w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />

          {/* Logo Reveal Container */}
          <div className="relative z-10 flex flex-col items-center">
            
            <div className="relative overflow-hidden p-2 min-h-[80px] flex items-center justify-center">
              {logoUrl ? (
                <>
                  {/* Clip-Path Reveal Animation (Simulates Typing/Writing) */}
                  <motion.img
                    src={logoUrl}
                    alt={alt}
                    initial={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)", opacity: 0 }}
                    animate={{ 
                      clipPath: isLoaded ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)" : "polygon(0 0, 0 0, 0 100%, 0 100%)", 
                      opacity: isLoaded ? 1 : 0 
                    }}
                    transition={{ duration: 1.6, ease: "easeInOut" }}
                    className="w-64 md:w-80 object-contain filter drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                    loading="lazy"
                  />

                  {/* Leading Golden Light Bar (Gives the writing cursor effect) */}
                  {isLoaded && (
                    <motion.div
                      initial={{ left: "0%" }}
                      animate={{ left: "100%" }}
                      transition={{ duration: 1.6, ease: "easeInOut" }}
                      className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-amber-300 to-transparent shadow-[0_0_12px_#fcd34d]"
                    />
                  )}

                  {/* Shimmer / Light Sweep across the gold texture */}
                  {isLoaded && (
                    <motion.div
                      initial={{ x: "-100%" }}
                      animate={{ x: "200%" }}
                      transition={{ duration: 1.4, delay: 1.3, ease: "easeInOut", repeat: Infinity, repeatDelay: 2.5 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent transform -skew-x-12"
                    />
                  )}
                </>
              ) : (
                /* Fallback while import resolves */
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-5xl md:text-6xl font-serif font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-[length:200%_auto] animate-[shimmer_2s_linear_infinite]"
                >
                  SKS
                </motion.div>
              )}
            </div>

            {/* Subtitle Fade-In */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mt-6 text-xs font-serif uppercase tracking-[0.35em] text-amber-200/90"
            >
              The Wedding Planners
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}