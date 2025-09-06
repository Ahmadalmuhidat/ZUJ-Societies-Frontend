export default function Contact() {
  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get In Touch</h2>
      <p className="text-gray-600 mb-6">
        Have questions or suggestions? We'd love to hear from you! Our team is always working to improve
        the platform and make it better for our community.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href="/support"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center"
        >
          Contact Support
        </a>
        <a
          href="mailto:hello@society.com"
          className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors text-center"
        >
          Email Us
        </a>
      </div>
    </div>
  );
} 