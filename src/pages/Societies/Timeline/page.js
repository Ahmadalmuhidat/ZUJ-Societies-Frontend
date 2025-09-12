import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SocietyHeader from '../Components/SocietyHeader';
import AxiosClient from '../../../config/axios';
import { useSocietyMembership } from '../../../context/MembershipContext';
import Timeline from './Components/MainContent';

export default function SocietyDetail() {
  const { id } = useParams();
  const { isMember } = useSocietyMembership(id);
  const [showModal, setShowModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState('');
  const [posts, setPosts] = useState([]);
  const [mounted, setMounted] = useState(false);

  const getPostsBySociety = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await AxiosClient.get("/posts/get_posts_by_society", {
        params: { token, society_id: id },
      });

      if (response.status === 200) {
        setPosts(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    }
  };

  const handleCreatePost = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await AxiosClient.post("/posts/create_post", {
        token,
        content: newPostContent,
        image: newPostImage || '',
        society_id: id,
      });

      if (response.status === 201) {
        setShowModal(false);
        setNewPostContent('');
        setNewPostImage('');
        getPostsBySociety();
      }
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  useEffect(() => {
    getPostsBySociety();
    const idAnim = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(idAnim);
  }, [id]);

  return (
    <>
      <SocietyHeader
        societyId={id || '1'}
        showJoinButton={!isMember}
        actionButton={
          isMember ? (
            <div className="flex gap-4">
              <Link
                to={`/societies/${id}/events/new`}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Create Event
              </Link>
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Post
              </button>
            </div>
          ) : undefined
        }
      />

      <main className={`min-h-screen bg-gray-50 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Timeline id={id} posts={posts} getPostsBySociety={getPostsBySociety} />
          </div>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Create a New Post</h2>

            <div className="mb-4">
              <textarea
                placeholder="What's on your mind?"
                className="w-full bg-gray-100 p-3 rounded-xl resize-none text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Image URL (optional)"
                className="w-full bg-gray-100 p-3 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newPostImage}
                onChange={(e) => setNewPostImage(e.target.value)}
              />
            </div>

            {newPostImage && (
              <div className="mb-4 relative">
                <img
                  src={newPostImage}
                  alt="Preview"
                  className="w-full rounded-lg max-h-64 object-cover"
                />
                <button
                  onClick={() => setNewPostImage('')}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                disabled={!newPostContent.trim()}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
