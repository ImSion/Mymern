import React, { useEffect, useRef } from 'react';
import '../Style/AnimatedBackground.css';

const AnimatedBackground = ({ className, isVisible }) => {
  const canvasRef = useRef(null);
  const spheresRef = useRef([]);

  useEffect(() => {
    if (!isVisible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;

    // Imposta le dimensioni del canvas
    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    // Funzione per creare una sfera
    const createSphere = (width, height) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 20 + 5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      color: `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},0.5)`
    });

    // Inizializza o reimposta le sfere
    const initSpheres = () => {
      spheresRef.current = Array(20).fill().map(() => createSphere(canvas.width, canvas.height));
    };

    // Funzione di animazione
    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      spheresRef.current.forEach(sphere => {
        sphere.x += sphere.dx;
        sphere.y += sphere.dy;

        if (sphere.x + sphere.radius > canvas.width || sphere.x - sphere.radius < 0) sphere.dx *= -1;
        if (sphere.y + sphere.radius > canvas.height || sphere.y - sphere.radius < 0) sphere.dy *= -1;

        ctx.beginPath();
        ctx.arc(sphere.x, sphere.y, sphere.radius, 0, Math.PI * 2);
        ctx.fillStyle = sphere.color;
        ctx.fill();
      });

      if (isVisible) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    // Inizializza e avvia l'animazione
    resizeCanvas();
    initSpheres();
    if (isVisible) {
      animate();
    }

    // Event listener per il ridimensionamento
    const handleResize = () => {
      resizeCanvas();
      // Ricrea le sfere con le nuove dimensioni del canvas
      spheresRef.current = spheresRef.current.map(() => createSphere(canvas.width, canvas.height));
    };

    window.addEventListener('resize', handleResize);

    // Pulizia
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return <canvas ref={canvasRef} className={`animated-background ${className}`}></canvas>;
};

export default AnimatedBackground;