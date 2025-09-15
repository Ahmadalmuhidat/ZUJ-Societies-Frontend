import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AxiosClient from '../../config/axios';
import { SkeletonCard } from './LoadingSpinner';

export default function TrendingPosts() {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        // Try to use the new analytics endpoint first
        try {
          const response = await AxiosClient.get('/analytics/trending-posts', { 
            params: { token, limit: 3, days: 7 } 
          });
          
          if (response.status === 200) {
            const trendingPosts = response.data.data.map(post => ({
              id: post.ID,
              title: post.Content ? post.Content.substring(0, 50) + '...' : 'No title',
              content: post.Content || 'No content available',
              author: post.User_Name || 'Unknown User',
              society: post.Society_Name || 'Unknown Society',
              likes: post.Likes || 0,
              comments: post.CommentsCount || 0,
              time: formatTimeAgo(post.CreatedAt),
              trending: true
            }));
            setTrendingPosts(trendingPosts);
            return;
          }
        } catch (analyticsError) {
          console.log('Analytics endpoint not available, falling back to regular posts');
        }

        // Fallback to regular posts API
        const response = await AxiosClient.get('/posts/get_all_posts', { 
          params: { token } 
        });

        if (response.status === 200) {
          const posts = response.data.data || [];
          
          // Sort posts by engagement (likes + comments) and take top 3
          const trendingPosts = posts
            .map(post => ({
              id: post.ID,
              title: post.Content ? post.Content.substring(0, 50) + '...' : 'No title',
              content: post.Content || 'No content available',
              author: post.User_Name || 'Unknown User',
              society: post.Society_Name || 'Unknown Society',
              likes: post.Likes || 0,
              comments: post.Comments || 0,
              time: formatTimeAgo(post.CreatedAt),
              trending: true
            }))
            .sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments))
            .slice(0, 3);
          
          setTrendingPosts(trendingPosts);
        }
      } catch (error) {
        console.error('Failed to fetch trending posts:', error);
        setTrendingPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingPosts();
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Unknown time';
    
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  };

  if (loading) {
    return <SkeletonCard className="mb-4" />;
  }

  return (
    <div className={`bg-white rounded-2xl shadow-card p-4 mb-4 border border-gray-100 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center mr-2">
            <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
          </div>
          Trending Posts
        </h3>
        <Link to="/trending" className="text-xs text-primary-600 hover:text-primary-800 font-semibold transition-colors">
          View All
        </Link>
      </div>
      
      <div className="space-y-3">
        {trendingPosts.map((post, index) => (
          <div key={post.id} className="p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-100 hover:shadow-md transition-all duration-300 group">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-gray-900 line-clamp-2 whitespace-pre-line group-hover:text-red-700 transition-colors">
                  {post.title}
                </h4>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2 whitespace-pre-line">
                  {post.content}
                </p>
                <div className="flex items-center mt-2 space-x-3 text-xs text-gray-500">
                  <span className="flex items-center font-medium">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {post.likes}
                  </span>
                  <span className="flex items-center font-medium">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {post.comments}
                  </span>
                  <span className="font-medium">{post.time}</span>
                </div>
              </div>
              <div className="ml-2 flex-shrink-0">
                <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold bg-red-500 text-white">
                  #{index + 1}
                </span>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 font-medium">
              by {post.author} in {post.society}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
