export default function Stats() {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">ZUJ Societies Impact</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
        <div>
          <div className="text-3xl font-bold text-blue-600 mb-2">25+</div>
          <div className="text-gray-600">Active Societies</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-green-600 mb-2">1,200+</div>
          <div className="text-gray-600">ZUJ Students</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-purple-600 mb-2">150+</div>
          <div className="text-gray-600">Monthly Events</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-orange-600 mb-2">8+</div>
          <div className="text-gray-600">Academic Departments</div>
        </div>
      </div>
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Platform Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-indigo-600 mb-1">99.9%</div>
            <div className="text-sm text-gray-600">Uptime</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-indigo-600 mb-1">&lt;2s</div>
            <div className="text-sm text-gray-600">Average Load Time</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-indigo-600 mb-1">24/7</div>
            <div className="text-sm text-gray-600">Support Available</div>
          </div>
        </div>
      </div>
    </div>
  );
} 