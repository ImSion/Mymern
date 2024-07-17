import React, { useEffect, useRef } from 'react';

const NightSkyBackground = ({ className, isVisible }) => {
  // Crea un riferimento al canvas che verrà utilizzato per disegnare
  const canvasRef = useRef(null);

  // useEffect viene eseguito dopo il rendering del componente
  useEffect(() => {
    // Se il componente non è visibile, non eseguire nulla
    if (!isVisible) return;

    // Ottiene il riferimento al canvas
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Ottiene il contesto 2D del canvas per disegnare
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Variabile per tenere traccia dell'ID dell'animazione
    let animationFrameId;

    // Funzione per ridimensionare il canvas
    const resizeCanvas = () => {
      if (canvas) {
        // Imposta la larghezza e l'altezza del canvas alle dimensioni della finestra
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    // Funzione per creare una stella
    const createStar = () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1, // Aumentato il raggio minimo e massimo
        opacity: Math.random() * 0.5 + 0.5, // Aumentata l'opacità minima
      });

    // Funzione per creare una stella cadente
    const createShootingStar = () => ({
      x: Math.random() * canvas.width, // Posizione x di partenza casuale
      y: 0, // Parte dall'alto dello schermo
      length: Math.random() * 3000 + 20, // Lunghezza della scia
      speed: Math.random() * 10 + 2, // Velocità casuale
      opacity: 1, // Opacità iniziale massima
      angle: Math.random() * Math.PI / 4 + Math.PI / 8, // Angolo di caduta casuale
    });

    // Array per memorizzare le stelle e le stelle cadenti
    let stars = [];
    let shootingStars = [];

    // Inizializza l'array delle stelle
    const initStars = () => {
      stars = Array(200).fill().map(createStar);
    };

    // Funzione di animazione principale
    const animate = () => {
      if (!ctx || !canvas) return;

      // Pulisce il canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Disegna lo sfondo del cielo notturno
      ctx.fillStyle = 'rgb(5, 5, 20)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Disegna e anima ogni stella
      stars.forEach(star => {
        star.opacity = Math.sin(Date.now() / 1000 * star.radius) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            
      // Crea un gradiente radiale per l'effetto luminoso
      const gradient = ctx.createRadialGradient(
        star.x, star.y, 0,
        star.x, star.y, star.radius * 2
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Filtra e anima le stelle cadenti
      shootingStars = shootingStars.filter(star => star.opacity > 0);
      shootingStars.forEach(star => {
        // Aggiorna la posizione della stella cadente
        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;
        star.opacity -= 0.01; // Diminuisce gradualmente l'opacità
        
        // Disegna la scia della stella cadente
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(star.x - Math.cos(star.angle) * star.length, star.y - Math.sin(star.angle) * star.length);
        
        // Crea un gradiente per la scia che sfuma
        const gradient = ctx.createLinearGradient(
          star.x, star.y, 
          star.x - Math.cos(star.angle) * star.length, 
          star.y - Math.sin(star.angle) * star.length
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Disegna la "testa" luminosa della stella cadente
        ctx.beginPath();
        ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      });

      // Aggiunge occasionalmente nuove stelle cadenti
      if (Math.random() < 0.02 && shootingStars.length < 3) {
        shootingStars.push(createShootingStar());
      }

      // Continua l'animazione se il componente è visibile
      if (isVisible) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    // Inizializza il canvas e avvia l'animazione
    resizeCanvas();
    initStars();
    if (isVisible) {
      animate();
    }

    // Aggiunge un listener per il ridimensionamento della finestra
    window.addEventListener('resize', () => {
      resizeCanvas();
      initStars();
    });

    // Funzione di pulizia che viene eseguita quando il componente viene smontato
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isVisible]); // L'effetto si riattiva quando cambia isVisible

  // Se il componente non è visibile, non renderizza nulla
  if (!isVisible) return null;

  // Renderizza il canvas con le classi appropriate
  return <canvas ref={canvasRef} className={`night-sky-background ${className}`}></canvas>;
};

export default NightSkyBackground;