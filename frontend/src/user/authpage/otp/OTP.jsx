import React, { useState, useRef } from 'react';

export default function OtpFlipPage({ onVerifySuccess, onBack }) {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef([]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    let newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length === 4) {
      onVerifySuccess(enteredOtp);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
      {/* Outer book wrapper providing the 3D perspective shadow */}
      <div className="w-full max-w-md bg-stone-900 border border-stone-800/80 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-8 relative overflow-hidden transition-all duration-700 transform rotate-y-0">
        
        {/* Subtle decorative light gold corner flourishes or borders */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#F1E5AC]/40 to-transparent"></div>

        {/* Page Header Indicator */}
        <div className="text-center mb-8">
          <span className="font-serif font-bold text-[#F1E5AC] tracking-[0.25em] text-[9px] md:text-xs uppercase">
            Step III — Verification
          </span>
          <h2 className="font-serif text-2xl md:text-3xl text-stone-100 mt-2">Enter Security Code</h2>
          <p className="text-stone-400 text-xs mt-2">
            Please enter the 4-digit verification code sent to your device.
          </p>
          <div className="w-12 h-[1px] bg-[#F1E5AC]/40 mx-auto mt-4"></div>
        </div>

        {/* OTP Input Form */}
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-center gap-3 sm:gap-4">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                ref={el => (inputRefs.current[index] = el)}
                value={data}
                onChange={e => handleChange(e.target, index)}
                onKeyDown={e => handleKeyDown(e, index)}
                className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-serif text-[#F1E5AC] bg-stone-950 border border-stone-800 rounded focus:border-[#F1E5AC] focus:outline-none focus:ring-1 focus:ring-[#F1E5AC] transition-all"
              />
            ))}
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-[#F1E5AC] text-stone-950 font-serif text-xs tracking-[0.2em] uppercase hover:bg-[#e6d58c] transition duration-200 shadow-lg"
            >
              Verify & Proceed
            </button>

            <div className="flex justify-between items-center text-xs text-stone-400 pt-2">
              <button
                type="button"
                onClick={onBack}
                className="hover:text-[#F1E5AC] transition uppercase tracking-wider font-serif"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => alert("Resend OTP clicked")}
                className="hover:text-[#F1E5AC] transition underline decoration-stone-700"
              >
                Resend Code
              </button>
            </div>
          </div>
        </form>

        {/* Footer page number indicator */}
        <div className="text-center mt-8 pt-4 border-t border-stone-800/50">
          <span className="text-[10px] font-serif text-stone-600 tracking-widest">- III -</span>
        </div>
      </div>
    </div>
  );
}