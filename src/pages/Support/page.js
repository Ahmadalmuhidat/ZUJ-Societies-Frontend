import FAQs from "./Components/FAQs";
import Contact from "./Components/Contact";
import { useEffect, useState } from "react";

export default function Support() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <>
      <main className={`min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <FAQs />
            <Contact />
          </div>
        </div>
      </main>
    </>
  );
} 