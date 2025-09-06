import { useAuth } from '../../../../context/AuthContext'

export default function Welcome() {
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Welcome back, {user?.Name}!
      </h2>
      <p className="text-gray-600">
        Here's what's happening in your societies and communities.
      </p>
    </div>
  );
}