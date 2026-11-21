"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
 
export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
 
  // read the current theme once the page has loaded
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);
 
  function toggle() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
    setDark(next);
  }
 
  return (
    <button onClick={toggle} aria-label="Toggle dark mode" className="grid h-9 w-9 place-items-center rounded-full hover:bg-black/10">
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
