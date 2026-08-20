import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/axios";

export default function Register({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/register", formData);
      const token = response.data.token || response.data?.data?.token;
      const user = response.data.user || response.data?.data?.user;

      if (token) {
        localStorage.setItem("token", token);
        if (user) localStorage.setItem("user", JSON.stringify(user));
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegisterSubmit} className="relative z-30 flex-1 flex flex-col justify-between p-8 md:p-10 text-center h-full">
      <div className="absolute inset-0 bg-[radial-gradient(#8b7355_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-0 bottom-0 w-8 bg-gradient-to-r from-black/30 via-black/5 to-transparent z-20 pointer-events-none" />

      <div className="relative z-30 flex-1 flex flex-col justify-between pl-4">
        <div className="text-center mt-4">
          <h2 className="text-2xl font-serif font-extrabold tracking-[0.2em] text-[#5a3a22] uppercase">
            Create Account
          </h2>
          <div className="h-0.5 w-16 bg-[#a67c52] mx-auto my-2 opacity-60" />
        </div>

        {error && (
          <div className="my-1 border border-red-800/30 bg-red-900/10 rounded p-2 text-red-800 text-xs font-medium">
            {error}
          </div>
        )}

        <div className="space-y-3 my-auto text-left">
          <div>
            <label className="block text-[10px] font-semibold text-[#6e4e31] mb-1 uppercase tracking-widest">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-sm bg-transparent border-b border-[#a67c52]/50 focus:border-[#5a3a22] focus:outline-none text-[#3e2714] font-serif text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-[#6e4e31] mb-1 uppercase tracking-widest">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 rounded-sm bg-transparent border-b border-[#a67c52]/50 focus:border-[#5a3a22] focus:outline-none text-[#3e2714] font-serif text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-[#6e4e31] mb-1 uppercase tracking-widest">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 rounded-sm bg-transparent border-b border-[#a67c52]/50 focus:border-[#5a3a22] focus:outline-none text-[#3e2714] font-serif text-sm"
              required
            />
          </div>
        </div>

        <div className="pt-3 space-y-3 text-center">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#5a3a22] hover:bg-[#3e2714] text-[#f4ebd8] font-serif font-bold py-3 rounded-sm text-xs tracking-widest uppercase transition-colors shadow-md cursor-pointer"
          >
            {loading ? "Creating..." : "Register"}
          </button>

        {/* Bottom Left: Close Book | Bottom Right: Back to Sign In */}
          <div className="flex justify-between items-center text-[11px] text-[#6e4e31] pt-1 font-serif font-medium">
            <button type="button" onClick={() => navigate('/bookcover')} className="hover:text-[#3e2714] underline cursor-pointer">
              ← Close Book
            </button>
            <button type="button" onClick={onSwitchToLogin} className="hover:text-[#3e2714] underline cursor-pointer">
              Back to Sign In →
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}