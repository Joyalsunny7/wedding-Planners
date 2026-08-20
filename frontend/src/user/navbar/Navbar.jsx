import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, User, LogOut } from "lucide-react";
import logo from "../../assets/logo1.png"; // Adjust path to your logo as needed

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the stored user session to expire the session
    localStorage.removeItem('user_session');
    
    // Redirect to login page
    navigate('/login'); 
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full m-0 p-0">
      <nav className="w-full flex items-center justify-between px-6 py-1.5 bg-[#1a120b]/15 dark:bg-black/15 backdrop-blur-md border-b border-amber-500/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
        {/* Left Section: Back Button & Brand Logo */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(-1)}
            title="Go Back"
            className="p-1.5 text-amber-200/80 hover:text-amber-300 hover:bg-amber-500/10 rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>

          <Link
            to="/"
            className="flex items-center space-x-2.5 group cursor-pointer"
          >
            <img
              src={logo}
              alt="SKS Planners Logo"
              className="w-7 h-7 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-transform duration-300 group-hover:scale-105"
            />
            <span className="font-serif font-bold text-[#F1E5AC] tracking-[0.25em] text-[9px] md:text-xs uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              The Wedding Planners
            </span>
          </Link>
        </div>

        {/* Center Section: Navigation Links */}
        <div className="hidden md:flex items-center space-x-6 font-serif text-xs uppercase tracking-widest text-amber-100/90">
          <Link
            to="/"
            className="hover:text-amber-300 transition-colors drop-shadow"
          >
            Home
          </Link>
          <Link
            to="/order"
            className="hover:text-amber-300 transition-colors drop-shadow"
          >
            Order
          </Link>
          <Link
            to="/about"
            className="hover:text-amber-300 transition-colors drop-shadow"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="hover:text-amber-300 transition-colors drop-shadow"
          >
            Contact Us
          </Link>
        </div>

        {/* Right Section: Cart, Profile, Logout, & Sign In */}
        <div className="flex items-center space-x-2 md:space-x-3">
          {/* Cart Button */}
          <button
            onClick={() => navigate("/cart")}
            title="Cart"
            className="p-1.5 text-amber-200/80 hover:text-amber-300 hover:bg-amber-500/10 rounded-full transition-colors relative cursor-pointer"
          >
            <ShoppingCart size={18} />
          </button>

          {/* User Profile Button */}
          <button
            onClick={() => navigate("/profile")}
            title="User Profile"
            className="p-1.5 text-amber-200/80 hover:text-amber-300 hover:bg-amber-500/10 rounded-full transition-colors cursor-pointer"
          >
            <User size={18} />
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-1.5 text-amber-200/80 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors cursor-pointer"
          >
            <LogOut size={18} />
          </button>

          {/* Sign In Button */}
          <button
            onClick={() => navigate("/login")}
            className="px-3 py-1.5 bg-amber-600/70 hover:bg-amber-500/90 text-[#1a120b] font-serif font-bold text-[11px] tracking-widest uppercase rounded-sm transition-all shadow-md backdrop-blur-sm cursor-pointer border border-amber-300/30"
          >
            Sign In
          </button>
        </div>
      </nav>
    </header>
  );
}