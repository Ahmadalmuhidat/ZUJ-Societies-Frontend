// src/Components/HomeContainer.jsx
import React, { useEffect, useState } from 'react';
import AxiosClient from '../../../config/axios';
import PostCard from '../../../SharedComponents/post/PostCard';

export default function HomeContainer() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await AxiosClient.get("/posts/get_all_posts", {
        params: { token },
      });

      if (response.status === 200) {
        setPosts(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading posts...</p>;
  }

  return (
    <div className="space-y-4">
      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts available.</p>
      ) : (
        posts.map((post) => <PostCard key={post.ID} post={post} />)
      )}
    </div>
  );
}
