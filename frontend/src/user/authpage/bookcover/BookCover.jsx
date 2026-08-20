import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import Login from "../login/Login";
import Register from "../register/Register";

import logo from "../../../assets/logo1.png";
import bookCoverTexture from "../../../assets/Book.jpeg";
import screenBg from "../../../assets/bookbg.JPG";

export default function BookCover() {
  const navigate = useNavigate();
  const location = useLocation();

  // Check current route states
  const isRegisterRoute = location.pathname.includes("/register");
  const isCoverRoute = location.pathname === "/" || location.pathname === "/bookcover";
  const isOpen = !isCoverRoute; // Book opens if we are on login or register

  return (
    <div 
      className="relative min-h-screen w-full bg-cover bg-center flex items-center justify-center p-4 md:p-8 overflow-hidden select-none"
      style={{ backgroundImage: `url(${screenBg})` }}
    >
      <div className="absolute inset-0 bg-black/70 pointer-events-none" />

      {/* 3D Scene Container */}
      <div className="w-full max-w-lg z-10 relative [perspective:1800px]">
        <div className="relative w-full min-h-[620px] [transform-style:preserve-3d]">
          
          {/* GROUND SHADOW */}
          <div className="absolute -bottom-6 left-6 right-2 h-10 bg-black/80 blur-lg rounded-full transform [rotateX(80deg)] [transform-origin:bottom] pointer-events-none" />

          {/* FRONT COVER */}
          <motion.div
            initial={{ rotateY: 0 }}
            animate={{ rotateY: isOpen ? -180 : 0 }}
            transition={{ duration: 1.2, ease: [0.645, 0.045, 0.355, 1.000] }}
            style={{ transformOrigin: "left center" }}
            className={`absolute inset-0 rounded-r-2xl rounded-l-md bg-[#1a120b] border-y border-r border-amber-900 shadow-[20px_10px_40px_rgba(0,0,0,0.9)] flex flex-col justify-between p-10 text-center [transform-style:preserve-3d] [backface-visibility:hidden] z-40 ${isOpen ? 'pointer-events-none' : 'pointer-events-auto'}`}
          >
            <div className="absolute inset-0 bg-cover bg-center opacity-40 rounded-r-2xl" style={{ backgroundImage: `url(${bookCoverTexture})` }} />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 rounded-r-2xl" />

            {/* Gold Embossed Border Frame */}
            <div className="absolute inset-4 border-2 border-amber-500/40 rounded-r-xl pointer-events-none z-10" />

            {/* Cover Content & Title */}
            <div className="relative z-20 mt-8 space-y-4 flex flex-col items-center">
              <img src={logo} alt="Logo" className="w-20 h-20 object-contain drop-shadow-[0_5px_5px_rgba(0,0,0,0.9)]" />
              <div>
                <div className="h-0.5 w-24 bg-amber-500/50 mx-auto my-3" />
                <p className="font-serif italic text-xs text-amber-200/70">
                  The Wedding Planners
                </p>
              </div>
            </div>

            {/* Action Buttons on Cover */}
            <div className="relative z-30 space-y-3 w-3/4 mx-auto mb-6 pointer-events-auto">
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-amber-600 hover:bg-amber-500 text-[#1a120b] font-serif font-bold py-2.5 rounded-sm text-xs tracking-widest uppercase transition-colors shadow-lg cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  navigate("/register", { replace: true });
                }}
                className="w-full bg-transparent hover:bg-amber-500/10 text-amber-300 border border-amber-500/50 font-serif font-semibold py-2.5 rounded-sm text-xs tracking-widest uppercase transition-colors shadow-sm cursor-pointer"
              >
                Create Account
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-full bg-transparent hover:bg-amber-500/10 text-amber-300/80 border border-amber-500/30 font-serif font-medium py-2 rounded-sm text-[11px] tracking-widest uppercase transition-colors shadow-sm cursor-pointer"
              >
                Home
              </button>
            </div>

          </motion.div>

          {/* INSIDE RIGHT PAGE 1: LOGIN FORM */}
          <motion.div
            animate={{ rotateY: isRegisterRoute ? -180 : 0 }}
            initial={false}
            transition={{ duration: 1.0, ease: [0.645, 0.045, 0.355, 1.000] }}
            style={{ transformOrigin: "left center" }}
            className="absolute inset-0 rounded-2xl bg-[#f4ebd8] border border-[#d4c5ab] shadow-[15px_10px_30px_rgba(0,0,0,0.8)] flex flex-col justify-between text-center [transform-style:preserve-3d] [backface-visibility:hidden] z-20 overflow-hidden"
          >
            <Login onSwitchToRegister={() => navigate("/register")} />
          </motion.div>

          {/* INSIDE RIGHT PAGE 2: REGISTER FORM */}
          <motion.div
            initial={{ rotateY: 180 }}
            animate={{ rotateY: isRegisterRoute ? 0 : 180 }}
            transition={{ duration: 1.0, ease: [0.645, 0.045, 0.355, 1.000] }}
            style={{ transformOrigin: "left center" }}
            className="absolute inset-0 rounded-2xl bg-[#f4ebd8] border border-[#d4c5ab] shadow-[15px_10px_30px_rgba(0,0,0,0.8)] flex flex-col justify-between text-center [transform-style:preserve-3d] [backface-visibility:hidden] z-30 overflow-hidden"
          >
            <Register onSwitchToLogin={() => navigate("/login")} />
          </motion.div>

        </div>
      </div>
    </div>
  );
}