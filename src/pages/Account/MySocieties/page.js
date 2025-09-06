import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AxiosClient from '../../../config/axios';
import AsAdmin from './Components/AsAdmin';
import AsMemeber from './Components/AsMember';
import Welcome from './Components/Welcome';
import QuickStats from './Components/QuickStats';

export default function MySocieties() {
  const [societies, setSocieties] = useState([]);

  const getSocietiesByUser = async () => {
    try {
      const response = await AxiosClient.get("/societies/get_societies_by_user", {
        params: {
          token: localStorage.getItem("token") || sessionStorage.getItem("token")
        }
      });

      if (response.status === 200) {
        setSocieties(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch societies:", error);
    }
  };

  useEffect(() => {
    getSocietiesByUser();
  }, []);

  const adminSocieties = societies.filter(soc => soc.Role === 'admin');

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Societies</h1>
          <Link
            to="/societies"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Discover More
          </Link>
        </div>

        <Welcome />

        {adminSocieties.length > 0 && <AsAdmin societies={societies} />}

        <AsMemeber societies={societies} />

        <QuickStats societies={societies} />
      </div>
    </main>
  );
}
