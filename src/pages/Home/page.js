import HomeContainer from './Components/HomeContainer';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Components/Sidebar';
import WelcomeBack from './Components/WelcomeBack';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Posts Feed */}
          <div className="lg:col-span-2">
            {isAuthenticated ? (
              <>
                <WelcomeBack />
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800">Recent Posts</h3>
                  <HomeContainer />
                </div>
              </>
            ) : null}
          </div>

          {/* Sidebar */}
          <Sidebar />
        </div>
      </div>
    </main>
  );
}
