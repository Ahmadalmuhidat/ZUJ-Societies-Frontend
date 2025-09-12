import Hero from "./Components/Hero";
import Features from "./Components/Features";
import Stats from "./Components/Stats";
import Contact from "./Components/Contact";
import { useEffect, useState } from "react";

export default function About() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <main className={`min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">About Society</h1>
        <Hero />
        <Features />
        <Stats />
        <Contact />
      </div>
    </main>
  );
} 