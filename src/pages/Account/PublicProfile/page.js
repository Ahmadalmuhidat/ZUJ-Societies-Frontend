import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AxiosClient from '../../../config/axios';

export default function PublicProfile() {
  const { id } = useParams();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [societies, setSocieties] = useState([]);
  const [posts, setPosts] = useState([]);
  const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/4537/4537019.png';

  const fetchData = async () => {
    try {
      setLoading(true);
      const [p, s, po] = await Promise.all([
        AxiosClient.get('/users/get_user_public_profile', { params: { user_id: id } }),
        AxiosClient.get('/societies/get_societies_by_user_public', { params: { user_id: id } }),
        AxiosClient.get('/posts/get_posts_by_user', { params: { user_id: id } }),
      ]);
      if (p.status === 200) setProfile(p.data.data);
      if (s.status === 200) setSocieties(s.data.data || []);
      if (po.status === 200) setPosts(po.data.data || []);
    } catch (err) {
      console.error('Failed to fetch public profile', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, [id]);

  return (
    <main className={`min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-40 bg-white rounded-xl shadow-card"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="h-48 bg-white rounded-xl shadow-card"></div>
              <div className="h-48 bg-white rounded-xl shadow-card lg:col-span-2"></div>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-white rounded-xl shadow-card overflow-hidden mb-8">
              <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <div className="relative px-6 pb-6">
                <div className="flex items-end -mt-16 mb-4">
                  <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg overflow-hidden">
                    <img src={profile?.Image || defaultAvatar} alt={profile?.Name} className="w-full h-full object-cover" onError={(e)=>{e.currentTarget.onerror=null; e.currentTarget.src=defaultAvatar;}} />
                  </div>
                  <div className="ml-6 pb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{profile?.Name}</h1>
                    <p className="text-gray-600">{profile?.Email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="text-center"><div className="text-2xl font-bold text-blue-600">{profile?.Society_Count || societies.length}</div><div className="text-sm text-gray-600">Societies</div></div>
                  <div className="text-center"><div className="text-2xl font-bold text-green-600">{profile?.Event_Count || 0}</div><div className="text-sm text-gray-600">Events</div></div>
                  <div className="text-center"><div className="text-2xl font-bold text-purple-600">{profile?.Post_Count || posts.length}</div><div className="text-sm text-gray-600">Posts</div></div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Societies</h2>
                {societies.length === 0 ? (
                  <p className="text-gray-500 text-sm">No societies to show.</p>
                ) : (
                  <ul className="space-y-3">
                    {societies.slice(0, 6).map(s => (
                      <li key={s.ID}>
                        <Link to={`/societies/${s.ID}`} className="group flex items-center justify-between rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100">
                              <img src={s.Image || 'https://placehold.co/80x80?text=S'} alt={s.Name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-800 group-hover:text-blue-700">{s.Name}</div>
                              <div className="text-xs text-gray-500">{s.Category}</div>
                            </div>
                          </div>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 group-hover:text-blue-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/></svg>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="card p-6 lg:col-span-2">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Posts</h2>
                {posts.length === 0 ? (
                  <p className="text-gray-500 text-sm">No posts yet.</p>
                ) : (
                  <ul className="space-y-4">
                    {posts.slice(0, 5).map(p => (
                      <li key={p.ID} className="rounded-lg border border-gray-100 overflow-hidden">
                        {p.Image && (
                          <div className="h-40 w-full overflow-hidden">
                            <img src={p.Image} alt="Post" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="p-4">
                          <p className="text-gray-800 text-sm leading-relaxed">{p.Content}</p>
                          <div className="mt-2 text-xs text-gray-500">{p.CreatedAt ? new Date(p.CreatedAt).toLocaleString() : ''}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
