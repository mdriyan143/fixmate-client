"use client";
import { useEffect, useRef, useState } from "react";

// shows the online photo first, and if it fails to load it switches (once) to the local svg
export default function HeroPhoto({ src, fallback, alt }: { src: string; fallback: string; alt: string }) {
  const [current, setCurrent] = useState(src);
  const img = useRef<HTMLImageElement>(null);

  // the error can happen before React is ready, so check once after the page loads too
  useEffect(() => {
    const el = img.current;
    if (el && el.complete && el.naturalWidth === 0) setCurrent(fallback);
  }, [fallback]);

  return (
    <img
      ref={img}
      src={current}
      alt={alt}
      loading="eager"
      decoding="async"
      onError={() => current !== fallback && setCurrent(fallback)}
      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
  );
}