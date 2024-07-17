import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { loginUser } from "../modules/ApiCrud";
import '../components/AnimatedBackground'
import '../Style/Animations.css'
import '../Style/Form.css';

export default function Login({ setIsAuthenticated }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger the animation after a short delay
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData);
      localStorage.setItem("token", response.token);
      setIsAuthenticated(true);
      navigate("/home");
    } catch (error) {
      console.error("Errore durante il login:", error);
      alert("Credenziali non valide. Riprova.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form 
        className={`login-form mb-52 ${isVisible ? 'login-form-animation' : 'opacity-0'}`} 
        autoComplete="off" 
        onSubmit={handleSubmit}
        
      >
        <div className="mb-6 text-center">
          <h1 className="text-3xl text-black">Login</h1>
        </div>
        <div className="block-cube block-input mb-4">
          <input 
            name="email" 
            type="email" 
            placeholder="Email" 
            onChange={handleChange}
            required
            className="bg-transparent text-center"
          />
          <div className="formbg-top"><div className="formbg-inner"></div></div>
          <div className="formbg-right"><div className="formbg-inner"></div></div>
          <div className="formbg"><div className="formbg-inner"></div></div>
        </div>
        <div className="block-cube block-input mb-6">
          <input 
            name="password" 
            type="password" 
            placeholder="Password" 
            onChange={handleChange}
            required
            className="bg-transparent text-center"
          />
          <div className="formbg-top"><div className="formbg-inner"></div></div>
          <div className="formbg-right"><div className="formbg-inner"></div></div>
          <div className="formbg"><div className="formbg-inner"></div></div>
        </div>
        <button className="btn block-cube block-cube-hover" type="submit">
          <div className="formbg-top"><div className="formbg-inner"></div></div>
          <div className="formbg-right"><div className="formbg-inner"></div></div>
          <div className="formbg"><div className="formbg-inner"></div></div>
          <div className="formtext">Log In</div>
        </button>
      </form>
    </div>
  );
}