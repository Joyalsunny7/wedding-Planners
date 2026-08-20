import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/axios";

export default function Register({ onSwitchToLogin }) {
  const [step, setStep] = useState("register"); // 'register' or 'otp'
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  // Handle Registration Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await API.post("/auth/register", formData);
      // Move to OTP verification step upon successful register request
      setStep("otp");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP Digit Input Change
  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;

    let newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle OTP Backspace Navigation
  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle OTP Verification Submit
  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 4) {
      setError("Please enter the complete 4-digit code.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/verify-otp", { 
        email: formData.email, 
        otp: enteredOtp 
      });
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
      setError(err.response?.data?.message || "Verification failed. Invalid code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-30 flex-1 flex flex-col justify-between p-8 md:p-10 text-center h-full">
      {/* Parchment Book Page Textures */}
      <div className="absolute inset-0 bg-[radial-gradient(#8b7355_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-0 bottom-0 w-8 bg-gradient-to-r from-black/30 via-black/5 to-transparent z-20 pointer-events-none" />

      {step === "register" ? (
        /* --- STEP 1: REGISTER FORM --- */
        <form onSubmit={handleRegisterSubmit} className="relative z-30 flex-1 flex flex-col justify-between pl-4">
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
              {loading ? "Processing..." : "Register"}
            </button>

            <div className="flex justify-between items-center text-[11px] text-[#6e4e31] pt-1 font-serif font-medium">
              <button type="button" onClick={() => navigate('/bookcover')} className="hover:text-[#3e2714] underline cursor-pointer">
                ← Close Book
              </button>
              <button type="button" onClick={onSwitchToLogin} className="hover:text-[#3e2714] underline cursor-pointer">
                Back to Sign In →
              </button>
            </div>
          </div>
        </form>
      ) : (
        /* --- STEP 2: OTP VERIFICATION FORM --- */
        <form onSubmit={handleVerifySubmit} className="relative z-30 flex-1 flex flex-col justify-between pl-4">
          <div className="text-center mt-4">
            <h2 className="text-2xl font-serif font-extrabold tracking-[0.2em] text-[#5a3a22] uppercase">
              Security Check
            </h2>
            <div className="h-0.5 w-16 bg-[#a67c52] mx-auto my-2 opacity-60" />
            <p className="text-[11px] text-[#6e4e31] font-serif mt-2">
              Enter the 4-digit code sent to <span className="font-semibold">{formData.email}</span>
            </p>
          </div>

          {error && (
            <div className="my-1 border border-red-800/30 bg-red-900/10 rounded p-2 text-red-800 text-xs font-medium">
              {error}
            </div>
          )}

          <div className="space-y-6 my-auto">
            <div className="flex justify-center gap-3 sm:gap-4">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  ref={(el) => (inputRefs.current[index] = el)}
                  value={data}
                  onChange={(e) => handleOtpChange(e.target, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  className="w-12 h-14 text-center text-xl font-serif font-bold text-[#3e2714] bg-transparent border-b-2 border-[#a67c52] focus:border-[#5a3a22] focus:outline-none transition-all shadow-sm"
                  required
                />
              ))}
            </div>
          </div>

          <div className="pt-3 space-y-3 text-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5a3a22] hover:bg-[#3e2714] text-[#f4ebd8] font-serif font-bold py-3 rounded-sm text-xs tracking-widest uppercase transition-colors shadow-md cursor-pointer"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>

            <div className="flex justify-between items-center text-[11px] text-[#6e4e31] pt-1 font-serif font-medium">
              <button type="button" onClick={() => navigate('/bookcover')} className="hover:text-[#3e2714] underline cursor-pointer">
                ← Close Book
              </button>
              <button type="button" onClick={() => setStep("register")} className="hover:text-[#3e2714] underline cursor-pointer">
                ← Back
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}