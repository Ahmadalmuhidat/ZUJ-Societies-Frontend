import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export default function Sidebar() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-6">
      {/* Community Stats */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Community Stats</h3>
        <div className="space-y-3">
          <div className="flex justify-between"><span className="text-gray-600">Active Societies</span><span className="font-semibold text-blue-600">45</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Total Members</span><span className="font-semibold text-green-600">2,847</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Upcoming Events</span><span className="font-semibold text-purple-600">23</span></div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="space-y-3">
          {isAuthenticated ? (
            <Link
              to="/societies/new"
              className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <span className="text-blue-800 font-medium">Create Society</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <span className="text-blue-800 font-medium">Login to Create Society</span>
            </Link>
          )}

          <Link to="/events" className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <span className="text-green-800 font-medium">Browse Events</span>
          </Link>

          <Link to="/support" className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <span className="text-purple-800 font-medium">Get Help</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
