import { useEffect, useRef } from 'react';

export default function StarryBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Stars
    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.4 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.008 + 0.003,
    }));

    // Floating rose petals
    const petals = Array.from({ length: 14 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 7 + 4,
      speedY: Math.random() * 0.6 + 0.2,
      speedX: (Math.random() - 0.5) * 0.4,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      opacity: Math.random() * 0.35 + 0.1,
      color: ['#ff2d55','#ff6b8a','#c0002a'][Math.floor(Math.random()*3)],
    }));

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.016;

      // Stars
      stars.forEach(s => {
        const alpha = 0.3 + 0.7 * Math.abs(Math.sin(s.phase + t * s.speed * 60));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
        // Occasional rose-tinted stars
        if (s.r > 1.2) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,45,85,${alpha * 0.08})`;
          ctx.fill();
        }
      });

      // Petals (small hearts)
      petals.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(t * 0.5 + p.phase) * 0.3;
        p.rot += p.rotSpeed;
        if (p.y > canvas.height + 20) { p.y = -20; p.x = Math.random() * canvas.width; }
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.beginPath();
        const s = p.size;
        ctx.moveTo(0, s * 0.4);
        ctx.bezierCurveTo(s, -s * 0.4, s * 1.4, s * 0.8, 0, s * 1.6);
        ctx.bezierCurveTo(-s * 1.4, s * 0.8, -s, -s * 0.4, 0, s * 0.4);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();
      });

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(raf); };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position:'fixed',top:0,left:0,
      width:'100%',height:'100%',
      pointerEvents:'none',zIndex:0,
    }}/>
  );
}
