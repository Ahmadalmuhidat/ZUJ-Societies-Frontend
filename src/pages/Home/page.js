import HomeContainer from './Components/HomeContainer';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Components/Sidebar';
import WelcomeBack from './Components/WelcomeBack';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <main className="min-h-screen bg-gray-50 py-6 sm:py-8 lg:py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Main Content - Posts Feed */}
          <div className="lg:col-span-2">
            {isAuthenticated ? (
              <>
                <WelcomeBack />
                <div className="mt-6 md:mt-8 space-y-6">
                  <HomeContainer />
                </div>
              </>
            ) : null}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 lg:sticky lg:top-8 h-fit">
            <Sidebar />
          </div>
        </div>
      </div>
    </main>
  );
}
