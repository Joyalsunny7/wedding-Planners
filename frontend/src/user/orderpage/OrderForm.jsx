import React, { useState } from "react";
import { motion } from "framer-motion";
import API from "../../api/axios"; // Path to your Axios helper instance
import orderBg from "../../assets/orderBg.png";

export default function OrderForm({ user }) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    pax: "",
    serviceType: [],
    mealType: [],
    location: "",
    eventDate: "",
    functionType: "Wedding",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (category, value) => {
    setFormData((prev) => {
      const currentList = prev[category];
      const updatedList = currentList.includes(value)
        ? currentList.filter((item) => item !== value)
        : [...currentList, value];

      return { ...prev, [category]: updatedList };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // Direct POST request via your API client
      // Authorization token is automatically included in headers via Axios interceptor
      const response = await API.post("/orders/submit-order", formData);

      if (response.status === 200 || response.status === 201) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error("Order submit error:", err);
      setErrorMsg(
        err.response?.data?.message || "Failed to submit request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-stone-950">
      {/* Repeating Damask Background Layer */}
      <div 
        className="fixed inset-0 bg-repeat bg-center opacity-30 pointer-events-none z-0"
        style={{ 
          backgroundImage: `url(${orderBg})`,
          backgroundSize: '400px'
        }}
      />

      {/* Dark Overlay for Readability */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 pointer-events-none z-0" />

      {/* Background Ambient Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-2xl w-full bg-stone-900/90 backdrop-blur-md p-8 md:p-10 rounded-2xl border border-amber-500/30 shadow-[0_0_50px_rgba(0,0,0,0.9)]"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">
            Book Your Event
          </h2>
          <p className="mt-2 text-sm text-amber-200/70 font-serif tracking-widest uppercase">
            Crafting Timeless Memories
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
            {errorMsg}
          </div>
        )}

        {submitted ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-12 space-y-4"
          >
            <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto border border-amber-400/30 text-2xl">
              ✓
            </div>
            <h3 className="text-2xl font-serif text-amber-300">Thank You!</h3>
            <p className="text-stone-300 max-w-md mx-auto text-sm">
              Your order details have been received. Our team will review your
              specifications and contact you shortly.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 px-6 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg text-sm transition"
            >
              Submit Another Request
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-amber-200/80 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-stone-800/90 border border-stone-700 focus:border-amber-400 rounded-lg px-4 py-3 text-sm text-white placeholder-stone-500 focus:outline-none transition"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-amber-200/80 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-stone-800/90 border border-stone-700 focus:border-amber-400 rounded-lg px-4 py-3 text-sm text-white placeholder-stone-500 focus:outline-none transition"
                />
              </div>

              {/* Number of Pax */}
              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-amber-200/80 mb-2">
                  Number of Pax (Guests) *
                </label>
                <input
                  type="number"
                  name="pax"
                  required
                  min="1"
                  placeholder="e.g., 250"
                  value={formData.pax}
                  onChange={handleChange}
                  className="w-full bg-stone-800/90 border border-stone-700 focus:border-amber-400 rounded-lg px-4 py-3 text-sm text-white placeholder-stone-500 focus:outline-none transition"
                />
              </div>

              {/* Function Type */}
              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-amber-200/80 mb-2">
                  Function / Event Type *
                </label>
                <select
                  name="functionType"
                  value={formData.functionType}
                  onChange={handleChange}
                  className="w-full bg-stone-800/90 border border-stone-700 focus:border-amber-400 rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition"
                >
                  <option value="Wedding">Wedding</option>
                  <option value="Reception">Reception</option>
                  <option value="Engagement">Engagement</option>
                  <option value="Birthday Party">Birthday Party</option>
                  <option value="Holy Communion">Holy Communion</option>
                  <option value="Baptism">Baptism</option>
                  <option value="Death Anniversary">Death Anniversary</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Services Required */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-xs font-serif uppercase tracking-wider text-amber-200/80 mb-3">
                  Services Required *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    "Full Event Planning",
                    "Catering & Dining",
                    "Stage & Venue Decor",
                    "Photography & Videography",
                    "Lighting & Sound",
                    "Buffet Service",
                    "Setting Service",
                    "Juice Live Only",
                  ].map((service) => (
                    <label
                      key={service}
                      className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition ${
                        formData.serviceType.includes(service)
                          ? "bg-amber-500/20 border-amber-400 text-amber-200"
                          : "bg-stone-800/90 border-stone-700 text-stone-300 hover:border-stone-600"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.serviceType.includes(service)}
                        onChange={() =>
                          handleCheckboxChange("serviceType", service)
                        }
                        className="w-4 h-4 accent-amber-400 rounded bg-stone-900 border-stone-700 focus:ring-amber-400 focus:ring-offset-0"
                      />
                      <span className="text-xs font-medium">{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Meal Preference */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-xs font-serif uppercase tracking-wider text-amber-200/80 mb-3">
                  Meal Style / Preference *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    "Juice Live Only",
                    "Breakfast",
                    "Lunch",
                    "Hi Tea",
                    "Dinner",
                  ].map((meal) => (
                    <label
                      key={meal}
                      className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition ${
                        formData.mealType.includes(meal)
                          ? "bg-amber-500/20 border-amber-400 text-amber-200"
                          : "bg-stone-800/90 border-stone-700 text-stone-300 hover:border-stone-600"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.mealType.includes(meal)}
                        onChange={() => handleCheckboxChange("mealType", meal)}
                        className="w-4 h-4 accent-amber-400 rounded bg-stone-900 border-stone-700 focus:ring-amber-400 focus:ring-offset-0"
                      />
                      <span className="text-xs font-medium">{meal}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Event Date */}
              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-amber-200/80 mb-2">
                  Event Date *
                </label>
                <input
                  type="date"
                  name="eventDate"
                  required
                  value={formData.eventDate}
                  onChange={handleChange}
                  className="w-full bg-stone-800/90 border border-stone-700 focus:border-amber-400 rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition"
                />
              </div>

              {/* Location Input */}
              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-amber-200/80 mb-2">
                  Location / Venue (or paste the google map link) *
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  placeholder="e.g., Kochi Auditorium / City Name"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full bg-stone-800/90 border border-stone-700 focus:border-amber-400 rounded-lg px-4 py-3 text-sm text-white placeholder-stone-500 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-lg bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-500 text-stone-950 font-semibold tracking-wider uppercase text-sm shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all duration-300 transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit Order Request"}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}