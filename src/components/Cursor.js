import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const raf = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ringEl = ringRef.current;

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      dot.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
    };

    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      ringEl.style.transform = `translate(${ring.current.x - 18}px, ${ring.current.y - 18}px)`;
      raf.current = requestAnimationFrame(animate);
    };

    const onHoverIn = () => ringEl.classList.add('hovering');
    const onHoverOut = () => ringEl.classList.remove('hovering');

    window.addEventListener('mousemove', onMove);
    raf.current = requestAnimationFrame(animate);

    document.querySelectorAll('a, button, [data-hover]').forEach(el => {
      el.addEventListener('mouseenter', onHoverIn);
      el.addEventListener('mouseleave', onHoverOut);
    });

    // Re-attach on DOM changes
    const observer = new MutationObserver(() => {
      document.querySelectorAll('a, button, [data-hover]').forEach(el => {
        el.removeEventListener('mouseenter', onHoverIn);
        el.removeEventListener('mouseleave', onHoverOut);
        el.addEventListener('mouseenter', onHoverIn);
        el.addEventListener('mouseleave', onHoverOut);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf.current);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef} />
    </>
  );
}
