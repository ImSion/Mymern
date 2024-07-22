import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser, getUserData } from "../modules/ApiCrud";
import '../components/AnimatedBackground'
import '../Style/Animations.css'
import '../Style/Form.css';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001"

export default function Login({ setIsAuthenticated }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      setIsAuthenticated(true);
      // Aggiungi questa chiamata per ottenere i dati dell'utente
      getUserData().then(userData => {
        // Memorizza i dati dell'utente in localStorage
        localStorage.setItem("userData", JSON.stringify(userData));
        // Dispara l'evento loginStateChange
        window.dispatchEvent(new Event('loginStateChange'));
        navigate("/home");
      }).catch(error => {
        console.error("Errore nel recupero dei dati utente:", error);
      });
    }
  }, [location, navigate, setIsAuthenticated]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData);
      localStorage.setItem("token", response.token);
      setIsAuthenticated(true);
      
      // Recupera i dati dell'utente
      const userData = await getUserData();
      // Memorizza i dati dell'utente nel localStorage
      localStorage.setItem("userData", JSON.stringify(userData));
      
      // Dispara un evento personalizzato per notificare il cambio di stato del login
      window.dispatchEvent(new Event('loginStateChange'));
      
      navigate("/home");
    } catch (error) {
      console.error("Errore durante il login:", error);
      alert("Credenziali non valide. Riprova.");
    }
  };
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form 
        className={`login-form mb-52 ${isVisible ? 'login-form-animation' : 'opacity-0'}`} 
        autoComplete="off" 
        onSubmit={handleSubmit}
        
      >
        <div className="mb-6 text-center">
          <h1 className="text-3xl text-black dark:text-white">Login</h1>
        </div>
        
        <div className="block-cube block-input mb-4">
          <input 
            name="email" 
            type="email" 
            placeholder="Email" 
            onChange={handleChange}
            required
            className="bg-transparent text-center dark:placeholder-white"
          />
          <div className="formbg-top"><div className="formbg-inner dark:bg-slate-300"></div></div>
          <div className="formbg-right "><div className="formbg-inner dark:bg-slate-300"></div></div>
          <div className="formbg"><div className="formbg-inner dark:bg-gradient-to-tr from-white via-sky-400/90 to-sky-800"></div></div>
        </div>

        <div className="block-cube block-input mb-6">
          <input 
            name="password" 
            type="password" 
            placeholder="Password" 
            onChange={handleChange}
            required
            className="bg-transparent text-center dark:placeholder-white"
          />
          <div className="formbg-top"><div className="formbg-inner dark:bg-slate-300"></div></div>
          <div className="formbg-right"><div className="formbg-inner dark:bg-slate-300"></div></div>
          <div className="formbg"><div className="formbg-inner dark:bg-gradient-to-tr from-white via-sky-400/90 to-sky-600/60"></div></div>
        </div>

        <div className='flex gap-3'>
          <button className="btn block-cube block-cube-hover" type="submit">
            <div className="formbg-top"><div className="formbg-inner dark:bg-slate-300"></div></div>
            <div className="formbg-right"><div className="formbg-inner dark:bg-slate-300"></div></div>
            <div className="formbg"><div className="formbg-inner dark:bg-gradient-to-tr from-white via-sky-400/90 to-sky-800"></div></div>
            <div className="formtext">Log In</div>
          </button>
          <button onClick={handleGoogleLogin} className="btn block-cube block-cube-hover" type="submit">
            <div className="formbg-top"><div className="formbg-inner dark:bg-slate-300"></div></div>
            <div className="formbg-right"><div className="formbg-inner dark:bg-slate-300"></div></div>
            <div className="formbg"><div className="formbg-inner dark:bg-gradient-to-tr from-white via-sky-400/90 to-sky-800"></div></div>
            <div className="formtext flex items-center justify-center">Google <img className='w-6 ml-2 dark:bg-black dark:rounded-full' src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" alt="" /></div>
          </button> 
        </div>
        
      </form>
      
    </div>
  );
}