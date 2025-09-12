import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SocietyCard from './Components/SocietyCard';
import { useAuth } from '../../context/AuthContext';
import AxiosClient from '../../config/axios';

export default function Societies() {
  const [societies, setSocieties] = useState([]);
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const getSocieties = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await AxiosClient.get("/societies/get_all_societies", {
        params: { token },
      });

      if (response.status === 200) {
        setSocieties(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch societies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSocieties();
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <main className={`min-h-screen bg-gray-50 py-10 sm:py-12 px-4 sm:px-6 lg:px-8 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Societies</h1>
          {isAuthenticated ? (
            <Link
              to="/societies/new"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Society
            </Link>
          ) : (
            <Link
              to="/login"
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Login to Create
            </Link>
          )}
        </div>

        <div className="mb-12">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                  <div className="h-44 w-full bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {societies.length === 0 ? (
                <p className="text-center text-gray-500 col-span-full">No societies available.</p>
              ) : (
                societies.map((society) => <SocietyCard key={society.ID} {...society} />)
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
