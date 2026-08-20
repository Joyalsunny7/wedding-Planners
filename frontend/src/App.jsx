import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import HomePage from "./user/homepage/HomePage";
import OrderForm from "./user/orderpage/OrderForm";
import ContactUs from "./user/contactus/ContactUs";
import Login from "./user/authpage/login/Login";
import Register from "./user/authpage/register/Register"; 
import OTP from "./user/authpage/otp/OTP";
import BookCover from "./user/authpage/bookcover/BookCover";
import About from "./user/homepage/About"
function LoginWrapper() {
  const navigate = useNavigate();

  const handleLoginSuccess = (data) => {
    localStorage.setItem("user_session", JSON.stringify(data));
    navigate("/"); // Redirect to home page after login
  };

  return <Login onLoginSuccess={handleLoginSuccess} />;
}

function RegisterWrapper() {
  const navigate = useNavigate();

  const handleRegisterSuccess = (data) => {
    localStorage.setItem("user_session", JSON.stringify(data));
    navigate("/verify-otp"); // Redirect to OTP verification after register
  };

  return (
    <Register
      onRegisterSuccess={handleRegisterSuccess}
      onSwitchToLogin={() => navigate("/login")}
    />
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/order" element={<OrderForm />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<About />} />
        
        
        {/* Added /bookcover as an explicit route for closing the book */}
        <Route path="/bookcover" element={<BookCover />} />
        <Route path="/login" element={<BookCover />} />
        <Route path="/register" element={<BookCover />} />
        
        <Route path="/verify-otp" element={<OTP />} />
      </Routes>
    </Router>
  );
}