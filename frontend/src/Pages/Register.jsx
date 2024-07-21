import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../modules/ApiCrud";
import '../Style/Animations.css';
import '../Style/Form.css';

export default function Register() {
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    password: "",
    data_di_nascita: "",
  });
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      alert("Registrazione avvenuta con successo!");
      navigate("/login");
    } catch (error) {
      console.error("Errore durante la registrazione:", error);
      alert("Errore durante la registrazione. Riprova.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form 
        className={`login-form w-[400px]  flex flex-col items-center sm:w-[600px] mb-52 ${isVisible ? 'login-form-animation' : 'opacity-0'}`} 
        autoComplete="off" 
        onSubmit={handleSubmit}
      >
        <div className="mb-6 text-center">
          <h1 className="text-3xl text-black">Registrazione</h1>
        </div>

        <div className="flex w-[330px] xs:w-[380px] sm:w-full gap-5">
          <div className="block-cube block-input mb-4 w-72">
            <input 
              name="nome" 
              type="text" 
              placeholder="Nome" 
              onChange={handleChange}
              required
              className="bg-transparent text-center dark:placeholder-white"
            />
            <div className="formbg-top"><div className="formbg-inner dark:bg-white"></div></div>
            <div className="formbg-right"><div className="formbg-inner dark:bg-white"></div></div>
            <div className="formbg"><div className="formbg-inner dark:bg-gradient-to-tr from-white via-sky-400/90 to-sky-800"></div></div>
          </div>
          <div className="block-cube block-input mb-4 w-72">
          <input 
              name="cognome" 
              type="text" 
              placeholder="Cognome" 
              onChange={handleChange}
              required
              className="bg-transparent text-center dark:placeholder-white"
            />
            <div className="formbg-top"><div className="formbg-inner dark:bg-white"></div></div>
            <div className="formbg-right"><div className="formbg-inner dark:bg-white"></div></div>
            <div className="formbg"><div className="formbg-inner dark:bg-gradient-to-tr from-white via-sky-400/90 to-sky-800"></div></div>
          </div>
        </div>

        <div className="flex w-[330px] xs:w-[380px] sm:w-full gap-5">
          <div className="block-cube block-input mb-4 w-72">
            <input 
              name="email" 
              type="email" 
              placeholder="Email" 
              onChange={handleChange}
              required
              className="bg-transparent text-center dark:placeholder-white"
            />
            <div className="formbg-top"><div className="formbg-inner dark:bg-white"></div></div>
            <div className="formbg-right"><div className="formbg-inner dark:bg-white"></div></div>
            <div className="formbg"><div className="formbg-inner dark:bg-gradient-to-tr from-white via-sky-400/90 to-sky-800"></div></div>
          </div>

          <div className="block-cube block-input mb-4 w-72">
            <input 
              name="password" 
              type="password" 
              placeholder="Password" 
              onChange={handleChange}
              required
              className="bg-transparent text-center dark:placeholder-white"
            />
            <div className="formbg-top"><div className="formbg-inner dark:bg-white"></div></div>
            <div className="formbg-right"><div className="formbg-inner dark:bg-white"></div></div>
            <div className="formbg"><div className="formbg-inner dark:bg-gradient-to-tr from-white via-sky-400/90 to-sky-800"></div></div>
          </div>
        </div>       
               
        <div className="block-cube block-input mb-6 w-72">
          <input 
            name="data_di_nascita" 
            type="date" 
            onChange={handleChange}
            required
            className="bg-transparent text-center dark:placeholder-white"
          />
          <div className="formbg-top"><div className="formbg-inner dark:bg-white"></div></div>
          <div className="formbg-right"><div className="formbg-inner dark:bg-white"></div></div>
          <div className="formbg"><div className="formbg-inner dark:bg-gradient-to-tr from-white via-sky-400/90 to-sky-800"></div></div>
        </div>

        <button className="btn block-cube block-cube-hover" type="submit">
          <div className="formbg-top"><div className="formbg-inner dark:bg-white"></div></div>
          <div className="formbg-right"><div className="formbg-inner dark:bg-white"></div></div>
          <div className="formbg"><div className="formbg-inner dark:bg-gradient-to-tr from-white via-sky-400/90 to-sky-800"></div></div>
          <div className="formtext">Registrati</div>
        </button>

      </form>
    </div>
  );
}