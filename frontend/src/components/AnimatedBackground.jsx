import React, { useEffect, useRef } from 'react';
import '../AnimatedBackground.css';

const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Imposta le dimensioni del canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Array per memorizzare le sfere
    const spheres = [];

    // Funzione per creare una sfera
    const createSphere = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 20 + 5, // Raggio casuale tra 5 e 25
      dx: (Math.random() - 0.5) * 0.5, // Velocità orizzontale
      dy: (Math.random() - 0.5) * 0.5, // Velocità verticale
      color: `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},0.5)`
    });

    // Crea le sfere iniziali
    for (let i = 0; i < 50; i++) {
      spheres.push(createSphere());
    }

    // Funzione di animazione
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      spheres.forEach(sphere => {
        // Aggiorna la posizione
        sphere.x += sphere.dx;
        sphere.y += sphere.dy;

        // Rimbalza ai bordi
        if (sphere.x + sphere.radius > canvas.width || sphere.x - sphere.radius < 0) sphere.dx *= -1;
        if (sphere.y + sphere.radius > canvas.height || sphere.y - sphere.radius < 0) sphere.dy *= -1;

        // Disegna la sfera
        ctx.beginPath();
        ctx.arc(sphere.x, sphere.y, sphere.radius, 0, Math.PI * 2);
        ctx.fillStyle = sphere.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Pulizia
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="animated-background"></canvas>;
};

export default AnimatedBackground;