import { useEffect, useRef } from 'react';

export default function StarField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.007 + 0.002,
      violet: Math.random() > 0.7,
    }));

    const petals = Array.from({ length: 12 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight - window.innerHeight,
      size: Math.random() * 6 + 3,
      speedY: Math.random() * 0.5 + 0.15,
      speedX: (Math.random() - 0.5) * 0.3,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.015,
      opacity: Math.random() * 0.28 + 0.08,
      color: ['#a78bfa','#c4b5fd','#7c3aed'][Math.floor(Math.random()*3)],
    }));

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.016;

      stars.forEach(s => {
        const alpha = 0.25 + 0.75 * Math.abs(Math.sin(s.phase + t * s.speed * 60));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.violet
          ? `rgba(167,139,250,${alpha})`
          : `rgba(255,255,255,${alpha * 0.85})`;
        ctx.fill();
        if (s.r > 1.1) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
          ctx.fillStyle = s.violet
            ? `rgba(167,139,250,${alpha * 0.10})`
            : `rgba(255,255,255,${alpha * 0.05})`;
          ctx.fill();
        }
      });

      petals.forEach(p => {
        p.y += p.speedY; p.x += p.speedX + Math.sin(t * 0.4) * 0.25; p.rot += p.rotSpeed;
        if (p.y > canvas.height + 20) { p.y = -20; p.x = Math.random() * canvas.width; }
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        const s = p.size;
        ctx.beginPath();
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

  return <canvas ref={canvasRef} style={{
    position:'fixed',top:0,left:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:0,
  }}/>;
}
