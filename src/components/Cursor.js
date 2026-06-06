import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const ring  = useRef({ x: 0, y: 0 });
  const raf   = useRef(null);
  const isHov = useRef(false);

  useEffect(() => {
    const dot  = dotRef.current;
    const ringEl = ringRef.current;

    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      dot.style.transform = `translate(${e.clientX - 4}px,${e.clientY - 4}px)`;
    };

    const lerp = (a, b, t) => a + (b - a) * t;

    const tick = () => {
      ring.current.x = lerp(ring.current.x, mouse.current.x, 0.10);
      ring.current.y = lerp(ring.current.y, mouse.current.y, 0.10);
      ringEl.style.transform = `translate(${ring.current.x - 20}px,${ring.current.y - 20}px)`;
      raf.current = requestAnimationFrame(tick);
    };

    const onEnter = () => {
      isHov.current = true;
      ringEl.classList.add('hovering');
      dot.classList.add('hovering');
    };
    const onLeave = () => {
      isHov.current = false;
      ringEl.classList.remove('hovering');
      dot.classList.remove('hovering');
    };

    window.addEventListener('mousemove', onMove);
    raf.current = requestAnimationFrame(tick);

    const attach = () => {
      document.querySelectorAll('a,button,[data-hover]').forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };
    attach();
    const obs = new MutationObserver(attach);
    obs.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf.current);
      obs.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef} style={{
        position:'fixed',top:0,left:0,zIndex:99999,pointerEvents:'none',
        width:8,height:8,borderRadius:'50%',
        background:'#a78bfa',
        boxShadow:'0 0 12px #a78bfa, 0 0 28px #a78bfa, 0 0 50px rgba(167,139,250,0.4)',
        transition:'transform 0.05s, width 0.3s, height 0.3s, background 0.3s',
      }} className="cursor-dot"/>
      <div ref={ringRef} style={{
        position:'fixed',top:0,left:0,zIndex:99998,pointerEvents:'none',
        width:40,height:40,borderRadius:'50%',
        border:'1.5px solid rgba(167,139,250,0.6)',
        transition:'width 0.35s cubic-bezier(.16,1,.3,1), height 0.35s cubic-bezier(.16,1,.3,1), background 0.3s, border-color 0.3s',
      }} className="cursor-ring"/>
      <style>{`
        .cursor-dot.hovering {
          background: #c4b5fd !important;
          box-shadow: 0 0 20px #c4b5fd, 0 0 50px #a78bfa !important;
        }
        .cursor-ring.hovering {
          width: 60px !important; height: 60px !important;
          background: rgba(167,139,250,0.08) !important;
          border-color: #a78bfa !important;
          margin-left: -10px; margin-top: -10px;
        }
      `}</style>
    </>
  );
}
