import { useEffect, useRef, useState } from "react";

export const useChapterNav = (count: number) => {
  const [i, setI] = useState(0);
  const lock = useRef(false);

  const go = (n: number) => setI(Math.max(0, Math.min(count - 1, n)));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") { e.preventDefault(); setI(p => Math.min(count - 1, p + 1)); }
      if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); setI(p => Math.max(0, p - 1)); }
    };
    const onWheel = (e: WheelEvent) => {
      if (lock.current) return;
      if (Math.abs(e.deltaY) < 30) return;
      lock.current = true;
      setI(p => Math.max(0, Math.min(count - 1, p + (e.deltaY > 0 ? 1 : -1))));
      setTimeout(() => { lock.current = false; }, 700);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("wheel", onWheel); };
  }, [count]);

  return { i, go };
};

export const useToggleKey = (key: string) => {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key.toLowerCase() === key.toLowerCase() && !e.metaKey && !e.ctrlKey) setOn(v => !v); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [key]);
  return [on, setOn] as const;
};
