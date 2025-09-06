import FAQs from "./Components/FAQs";
import Contact from "./Components/Contact";

export default function Support() {
  return (
    <>
      <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">How can we help you?</h1>
            <p className="text-xl text-gray-600">
              Find answers to common questions or get in touch with our support team
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <FAQs />
            <Contact />
          </div>
        </div>
      </main>
    </>
  );
} 