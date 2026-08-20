import React, { useState } from 'react';
import API from "../../api/axios"; // Import your Axios instance helper
import orderBg from "../../assets/orderBg.png";

const SKSWeddingPlanners = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    phone: '',
    email: '',
    eventType: 'Wedding / Reception',
    eventDate: '',
    budget: '1.5 lakhs to 3 lakhs',
    services: [],
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const availableServices = [
    'Stage & Mandap Decor',
    'Haldi / Mehendi Theme Setup',
    'Photography & Videography',
    'Sangeet / DJ & Sound',
    'Catering Services',
    'Beautician / Makeup Artist'
  ];

  const handleCheckboxChange = (service) => {
    setFormData((prev) => {
      const exists = prev.services.includes(service);
      return {
        ...prev,
        services: exists
          ? prev.services.filter((s) => s !== service)
          : [...prev.services, service]
      };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // POST request to backend API
      const response = await API.post("/orders/submit-order", formData);

      if (response.status === 200 || response.status === 201) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error("Order submit error:", err);
      setErrorMsg(
        err.response?.data?.message || "Failed to submit inquiry. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
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

      <div style={styles.page}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.badge}>SKS - the Wedding Planners</div>
          <h1 style={styles.title}>Crafting Your Dream Wedding</h1>
          <p style={styles.subtitle}>
            From traditional Mandap setups to complete event execution, share your vision with us and get a customized quote for your special day.
          </p>
        </header>

        <div style={styles.grid}>
          {/* Contact & Business Info */}
          <div style={styles.infoColumn}>
            <div style={styles.cardDark}>
              <h2 style={styles.cardHeader}>Get in Touch</h2>
              <p style={styles.cardSub}>Reach out directly to discuss themes, venue availability, and bookings.</p>

              <div style={styles.infoGroup}>
                <span style={styles.infoLabel}>Phone / WhatsApp</span>
                <a href="tel:+919656777699" style={styles.infoLink}>
                  +91 96567 77699
                </a>
              </div>

              <div style={styles.infoGroup}>
                <span style={styles.infoLabel}>Email Us</span>
                <a href="mailto:skseventz11@gmail.com" style={styles.infoLink}>
                  skseventz11@gmail.com
                </a>
              </div>

              <div style={styles.infoGroup}>
                <span style={styles.infoLabel}>Main Office Location</span>
                <a 
                  href="https://maps.app.goo.gl/C38dXac68dZX6xJb7?g_st=ac" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={styles.mapBtn}
                >
                  📍 View Location on Google Maps
                </a>
              </div>

              <hr style={styles.divider} />

              <h3 style={styles.servicesTitle}>Popular Planning Services</h3>
              <ul style={styles.serviceList}>
                <li>Mandap & Stage Decoration</li>
                <li>Haldi & Mehendi Setup</li>
                <li>Baraat, Dhol & Sangeet Arrangements</li>
                <li>Resort & Convention Hall Decor</li>
              </ul>
            </div>
          </div>

          {/* Planning & Quote Form */}
          <div style={styles.formColumn}>
            <div style={styles.cardLight}>
              {submitted ? (
                <div style={styles.successState}>
                  <h3 style={{ color: '#15803d', margin: '0 0 8px 0' }}>Booking Inquiry Received!</h3>
                  <p style={{ color: '#166534', margin: 0, fontSize: '14px' }}>
                    Thank you, <strong>{formData.clientName}</strong>. The team at SKS Wedding Planners will contact you shortly to review your event requirement.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    style={{ ...styles.btn, marginTop: '16px', backgroundColor: '#166534' }}
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h2 style={{ ...styles.cardHeader, color: '#1c1917' }}>Plan Your Event</h2>
                  <p style={{ color: '#78716c', fontSize: '14px', marginBottom: '20px' }}>
                    Fill out your details to receive an estimated quote and availability details.
                  </p>

                  {errorMsg && (
                    <div style={styles.errorState}>
                      {errorMsg}
                    </div>
                  )}

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Your Name *</label>
                    <input
                      type="text"
                      name="clientName"
                      value={formData.clientName}
                      onChange={handleChange}
                      placeholder="e.g. Neeraj"
                      required
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.row}>
                    <div style={{ ...styles.formGroup, flex: 1 }}>
                      <label style={styles.label}>Phone / Mobile *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="10-digit mobile number"
                        required
                        style={styles.input}
                      />
                    </div>

                    <div style={{ ...styles.formGroup, flex: 1 }}>
                      <label style={styles.label}>Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@example.com"
                        style={styles.input}
                      />
                    </div>
                  </div>

                  <div style={styles.row}>
                    <div style={{ ...styles.formGroup, flex: 1 }}>
                      <label style={styles.label}>Event Type</label>
                      <select
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleChange}
                        style={styles.input}
                      >
                        <option value="Wedding / Reception">Wedding / Reception</option>
                        <option value="Engagement">Engagement Ceremony</option>
                        <option value="Sangeet / Mehendi">Sangeet / Mehendi</option>
                        <option value="Haldi Ceremony">Haldi Ceremony</option>
                        <option value="House Warming / Other">House Warming / Other</option>
                      </select>
                    </div>

                    <div style={{ ...styles.formGroup, flex: 1 }}>
                      <label style={styles.label}>Expected Budget Range</label>
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        style={styles.input}
                      >
                        <option value="Below 50k">Below ₹50,000</option>
                        <option value="50k to 1.5 lakhs">₹50,000 - ₹1.5 Lakhs</option>
                        <option value="1.5 lakhs to 3 lakhs">₹1.5 Lakhs - ₹3 Lakhs</option>
                        <option value="3 lakhs to 5 lakhs">₹3 Lakhs - ₹5 Lakhs</option>
                        <option value="Above 5 lakhs">Above ₹5 Lakhs</option>
                      </select>
                    </div>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Event Date</label>
                    <input
                      type="date"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleChange}
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Services Needed</label>
                    <div style={styles.checkboxGrid}>
                      {availableServices.map((service) => (
                        <label key={service} style={styles.checkboxLabel}>
                          <input
                            type="checkbox"
                            checked={formData.services.includes(service)}
                            onChange={() => handleCheckboxChange(service)}
                            style={{ marginRight: '8px' }}
                          />
                          {service}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Additional Requirements / Venue Notes</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your expected guest count, venue preferences, or specific decoration themes..."
                      rows="4"
                      style={{ ...styles.input, resize: 'vertical' }}
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading} 
                    style={{ 
                      ...styles.btn, 
                      opacity: loading ? 0.7 : 1, 
                      cursor: loading ? 'not-allowed' : 'pointer' 
                    }}
                  >
                    {loading ? "Submitting Inquiry..." : "Submit Inquiry & Get Quote"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    position: 'relative',
    zIndex: 10,
    minHeight: '100vh',
    padding: '40px 20px',
    fontFamily: "'Segoe UI', Roboto, sans-serif"
  },
  header: {
    textAlign: 'center',
    maxWidth: '700px',
    margin: '0 auto 40px auto'
  },
  badge: {
    display: 'inline-block',
    backgroundColor: '#8B4513',
    color: '#FFF',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '1px',
    padding: '4px 14px',
    borderRadius: '20px',
    textTransform: 'uppercase',
    marginBottom: '12px'
  },
  title: {
    fontSize: '32px',
    color: '#F59E0B',
    margin: '0 0 10px 0'
  },
  subtitle: {
    color: '#D1D5DB',
    fontSize: '15px',
    lineHeight: '1.5'
  },
  grid: {
    maxWidth: '1000px',
    margin: '0 auto',
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap'
  },
  infoColumn: {
    flex: '1 1 320px'
  },
  formColumn: {
    flex: '2 1 450px'
  },
  cardDark: {
    backgroundColor: 'rgba(44, 24, 16, 0.9)',
    backdropFilter: 'blur(8px)',
    color: '#FFF',
    padding: '32px',
    borderRadius: '12px',
    height: '100%',
    boxSizing: 'border-box',
    border: '1px solid rgba(232, 210, 193, 0.2)'
  },
  cardLight: {
    backgroundColor: '#FFF',
    padding: '32px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    boxSizing: 'border-box'
  },
  cardHeader: {
    fontSize: '22px',
    margin: '0 0 8px 0',
    color: '#E8D2C1'
  },
  cardSub: {
    color: '#A0928B',
    fontSize: '13px',
    marginBottom: '24px'
  },
  infoGroup: {
    marginBottom: '18px'
  },
  infoLabel: {
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    color: '#D4B29E',
    display: 'block',
    marginBottom: '4px'
  },
  infoLink: {
    color: '#F59E0B',
    fontSize: '15px',
    fontWeight: '600',
    textDecoration: 'none'
  },
  mapBtn: {
    display: 'inline-block',
    marginTop: '4px',
    color: '#F59E0B',
    fontSize: '13px',
    fontWeight: '600',
    textDecoration: 'underline'
  },
  divider: {
    borderColor: '#42281D',
    margin: '24px 0'
  },
  servicesTitle: {
    fontSize: '14px',
    color: '#E8D2C1',
    marginBottom: '12px'
  },
  serviceList: {
    paddingLeft: '18px',
    margin: 0,
    color: '#D4B29E',
    fontSize: '13px',
    lineHeight: '1.8'
  },
  row: {
    display: 'flex',
    gap: '16px'
  },
  formGroup: {
    marginBottom: '16px'
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: '6px'
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #E0D6CE',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#FAF8F5'
  },
  checkboxGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    backgroundColor: '#FAF8F5',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #E0D6CE'
  },
  checkboxLabel: {
    fontSize: '13px',
    color: '#444',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  },
  btn: {
    width: '100%',
    backgroundColor: '#8B4513',
    color: '#FFF',
    padding: '12px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px'
  },
  successState: {
    padding: '24px',
    backgroundColor: '#F0FDF4',
    border: '1px solid #BBF7D0',
    borderRadius: '8px',
    textAlign: 'center'
  },
  errorState: {
    padding: '12px',
    marginBottom: '16px',
    backgroundColor: '#FEF2F2',
    border: '1px solid #FECACA',
    borderRadius: '6px',
    color: '#991B1B',
    fontSize: '13px',
    textAlign: 'center'
  }
};

export default SKSWeddingPlanners;