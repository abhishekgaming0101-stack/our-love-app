import { useEffect, useRef } from 'react';

const PETAL_COLORS = ['#e8788a', '#f4a0af', '#c4566a', '#d4a5b0', '#f9d0d8'];

export default function Petals({ count = 18 }) {
  const canvasRef = useRef(null);
  const petals = useRef([]);
  const raf = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize petals
    petals.current = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight - window.innerHeight,
      size: Math.random() * 8 + 5,
      speedY: Math.random() * 1.2 + 0.4,
      speedX: (Math.random() - 0.5) * 0.8,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.04,
      opacity: Math.random() * 0.5 + 0.3,
      color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
      delay: i * 200,
    }));

    const drawPetal = (ctx, x, y, size, rotation, opacity, color) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      // Heart shape
      ctx.moveTo(0, -size * 0.4);
      ctx.bezierCurveTo(size * 0.5, -size, size * 1.2, -size * 0.2, 0, size * 0.6);
      ctx.bezierCurveTo(-size * 1.2, -size * 0.2, -size * 0.5, -size, 0, -size * 0.4);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      petals.current.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.y * 0.01) * 0.5;
        p.rotation += p.rotSpeed;
        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        drawPetal(ctx, p.x, p.y, p.size, p.rotation, p.opacity, p.color);
      });
      raf.current = requestAnimationFrame(animate);
    };

    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf.current);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.6,
      }}
    />
  );
}
