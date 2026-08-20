import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../../api/axios';

export default function OTP() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  // Handle digit input & auto-focus next input
  const handleChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take last entered char
    setOtp(newOtp);

    // Auto focus next box
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle Backspace navigation
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle Paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, idx) => {
      newOtp[idx] = char;
    });
    setOtp(newOtp);

    const nextFocusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  // Verify OTP Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    const otpString = otp.join('');
    if (otpString.length < 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);

    try {
      const email = localStorage.getItem('pending_email'); // Or retrieve from state/location
      const response = await API.post('/auth/verify-otp', { email, otp: otpString });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.removeItem('pending_email');
      }

      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP code');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP Action
  const handleResend = async () => {
    setError('');
    setMessage('');
    setResending(true);

    try {
      const email = localStorage.getItem('pending_email');
      await API.post('/auth/resend-otp', { email });
      setMessage('A new OTP has been sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0c] flex items-center justify-center p-4 overflow-hidden">
      {/* Imperial Gold & Crimson Glowing Ambient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-amber-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-900/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />

      {/* Main Card Container */}
      <div className="w-full max-w-md z-10 my-8">
        <form
          onSubmit={handleSubmit}
          className={`bg-[#121216]/95 backdrop-blur-2xl p-8 rounded-2xl border border-amber-500/30 shadow-[0_0_50px_rgba(217,119,6,0.15)] transition-all duration-300 ${
            error ? 'animate-bounce' : ''
          }`}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-block p-2 rounded-full border border-amber-500/20 bg-amber-500/5 mb-3">
              <span className="text-amber-400 text-lg">🐉</span>
            </div>
            <h2 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 uppercase">
              Verify OTP
            </h2>
            <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto my-2" />
            <p className="text-xs text-amber-100/60 font-light tracking-wide">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-4 bg-red-950/40 border border-red-500/50 rounded-lg p-2.5 text-red-400 text-xs text-center font-medium shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-4 bg-amber-500/10 border border-amber-500/40 rounded-lg p-2.5 text-amber-300 text-xs text-center font-medium shadow-[0_0_15px_rgba(217,119,6,0.2)]">
              {message}
            </div>
          )}

          {/* 6 Digit Inputs */}
          <div className="flex justify-between gap-2 mb-6" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                ref={(el) => (inputRefs.current[index] = el)}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-bold rounded-lg bg-[#070709] text-amber-300 border border-amber-500/20 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none transition-all duration-200 shadow-inner"
                required
              />
            ))}
          </div>

          {/* Gold Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-zinc-950 font-bold py-2.5 rounded-lg text-sm tracking-wider uppercase transition-all duration-300 shadow-[0_0_20px_rgba(217,119,6,0.3)] flex items-center justify-center active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              'Verify Code'
            )}
          </button>

          {/* Resend Action */}
          <div className="mt-6 text-center">
            <p className="text-xs text-zinc-400">
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4 ml-1 transition-colors disabled:opacity-50"
              >
                {resending ? 'Sending...' : 'Resend OTP'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}