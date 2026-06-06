import { useEffect, useRef } from 'react';

export default function StarField() {
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

    // 320 stars — white + violet mix
    const stars = Array.from({ length: 320 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.6 + 0.15,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.006 + 0.002,
      violet: Math.random() > 0.60,
      big: Math.random() > 0.88,
    }));

    // Floating violet heart petals
    const petals = Array.from({ length: 16 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 6 + 3,
      speedY: Math.random() * 0.45 + 0.12,
      speedX: (Math.random() - 0.5) * 0.28,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.012,
      opacity: Math.random() * 0.22 + 0.06,
      color: ['#a78bfa','#c4b5fd','#7c3aed','#ddd6fe'][Math.floor(Math.random()*4)],
    }));

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.016;

      // Draw stars
      stars.forEach(s => {
        const alpha = 0.18 + 0.82 * Math.abs(Math.sin(s.phase + t * s.speed * 60));
        const color = s.violet ? `rgba(167,139,250,${alpha})` : `rgba(255,255,255,${alpha * 0.9})`;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Glow halo for bigger stars
        if (s.big) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2);
          ctx.fillStyle = s.violet
            ? `rgba(167,139,250,${alpha * 0.12})`
            : `rgba(255,255,255,${alpha * 0.06})`;
          ctx.fill();
        }
      });

      // Draw petals
      petals.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(t * 0.35 + p.phase) * 0.22;
        p.rot += p.rotSpeed;
        if (p.y > canvas.height + 20) { p.y = -20; p.x = Math.random() * canvas.width; }

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        const s = p.size;
        ctx.beginPath();
        ctx.moveTo(0, s * 0.4);
        ctx.bezierCurveTo(s, -s*0.4, s*1.4, s*0.8, 0, s*1.6);
        ctx.bezierCurveTo(-s*1.4, s*0.8, -s, -s*0.4, 0, s*0.4);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();
      });

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position:'fixed', top:0, left:0,
      width:'100%', height:'100%',
      pointerEvents:'none', zIndex:0,
    }}/>
  );
}
