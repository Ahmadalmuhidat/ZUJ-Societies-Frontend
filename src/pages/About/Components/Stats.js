export default function Stats() {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Our Community</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
        <div>
          <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
          <div className="text-gray-600">Active Societies</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-green-600 mb-2">2,500+</div>
          <div className="text-gray-600">Community Members</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-purple-600 mb-2">200+</div>
          <div className="text-gray-600">Monthly Events</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-orange-600 mb-2">15+</div>
          <div className="text-gray-600">Research Labs</div>
        </div>
      </div>
    </div>
  );
} 