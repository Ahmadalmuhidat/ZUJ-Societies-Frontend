import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AxiosClient from '../../config/axios';

export default function ActivityFeed() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        // Try to use the new analytics endpoint first
        try {
          const response = await AxiosClient.get('/analytics/activity-feed', { 
            params: { token, limit: 6 } 
          });
          
          if (response.status === 200) {
            const activities = response.data.data.map(activity => ({
              ...activity,
              time: formatTimeAgo(activity.time)
            }));
            setActivities(activities);
            return;
          }
        } catch (analyticsError) {
          console.log('Analytics endpoint not available, falling back to individual calls');
        }

        // Fallback to individual API calls
        const [postsRes, eventsRes, societiesRes] = await Promise.allSettled([
          AxiosClient.get('/posts/get_all_posts', { params: { token, limit: 5 } }),
          AxiosClient.get('/events/get_all_events', { params: { limit: 5 } }),
          AxiosClient.get('/societies/get_all_societies', { params: { limit: 5 } })
        ]);

        const activities = [];

        // Process recent posts
        if (postsRes.status === 'fulfilled' && postsRes.value.status === 200) {
          const posts = postsRes.value.data.data || [];
          posts.slice(0, 3).forEach(post => {
            activities.push({
              id: `post-${post.ID}`,
              type: 'post',
              user: post.User_Name || 'Unknown User',
              action: 'created a new post',
              target: post.Society_Name || 'Unknown Society',
              time: formatTimeAgo(post.CreatedAt),
              avatar: post.User_Image || 'https://cdn-icons-png.flaticon.com/512/4537/4537019.png'
            });
          });
        }

        // Process recent events
        if (eventsRes.status === 'fulfilled' && eventsRes.value.status === 200) {
          const allEvents = eventsRes.value.data.data || [];
          allEvents.slice(0, 2).forEach(event => {
            activities.push({
              id: `event-${event.ID}`,
              type: 'event',
              user: event.Creator_Name || 'Unknown User',
              action: 'created an event',
              target: event.Title || 'New Event',
              time: formatTimeAgo(event.CreatedAt),
              avatar: event.Creator_Image || 'https://cdn-icons-png.flaticon.com/512/4537/4537019.png'
            });
          });
        }

        // Process recent societies
        if (societiesRes.status === 'fulfilled' && societiesRes.value.status === 200) {
          const societies = societiesRes.value.data.data || [];
          societies.slice(0, 2).forEach(society => {
            activities.push({
              id: `society-${society.ID}`,
              type: 'society',
              user: society.Creator_Name || 'Unknown User',
              action: 'created a society',
              target: society.Name || 'New Society',
              time: formatTimeAgo(society.CreatedAt),
              avatar: society.Creator_Image || 'https://cdn-icons-png.flaticon.com/512/4537/4537019.png'
            });
          });
        }

        // Sort by time (most recent first) and limit to 6 items
        activities.sort((a, b) => new Date(b.time) - new Date(a.time));
        setActivities(activities.slice(0, 6));
      } catch (error) {
        console.error('Failed to fetch activities:', error);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
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

  const getActivityIcon = (type) => {
    const icons = {
      post: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      event: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      society: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      comment: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
    };
    return icons[type] || icons.post;
  };

  const getActivityColor = (type) => {
    const colors = {
      post: 'text-blue-600 bg-blue-100',
      event: 'text-green-600 bg-green-100',
      society: 'text-purple-600 bg-purple-100',
      comment: 'text-orange-600 bg-orange-100'
    };
    return colors[type] || colors.post;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 mb-4 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
        <Link to="/activity" className="text-sm text-blue-600 hover:text-blue-800">
          View All
        </Link>
      </div>
      
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getActivityIcon(activity.type)} />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
                  {activity.target}
                </span>
              </p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
