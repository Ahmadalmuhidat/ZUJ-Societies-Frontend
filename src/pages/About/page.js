import Hero from "./Components/Hero";
import Features from "./Components/Features";
import Stats from "./Components/Stats";
import Contact from "./Components/Contact";

export default function About() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
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