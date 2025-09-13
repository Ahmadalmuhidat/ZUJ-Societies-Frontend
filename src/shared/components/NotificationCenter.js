import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AxiosClient from '../../config/axios';

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        // For now, we'll create notifications based on recent activity
        // In a real app, you'd have a dedicated notifications API
        const [postsRes, eventsRes] = await Promise.allSettled([
          AxiosClient.get('/posts/get_all_posts', { params: { token, limit: 10 } }),
          AxiosClient.get('/events/get_all_events', { params: { limit: 5 } })
        ]);

        const notifications = [];

        // Create notifications from recent posts (simulate likes/comments)
        if (postsRes.status === 'fulfilled' && postsRes.value.status === 200) {
          const posts = postsRes.value.data.data || [];
          posts.slice(0, 3).forEach((post, index) => {
            if (post.Likes > 0) {
              notifications.push({
                id: `like-${post.ID}`,
                type: 'like',
                message: `${post.Likes} people liked your post`,
                time: formatTimeAgo(post.CreatedAt),
                read: index > 1, // Mark older ones as read
                avatar: 'https://cdn-icons-png.flaticon.com/512/4537/4537019.png'
              });
            }
            if (post.Comments > 0) {
              notifications.push({
                id: `comment-${post.ID}`,
                type: 'comment',
                message: `${post.Comments} new comments on your post`,
                time: formatTimeAgo(post.CreatedAt),
                read: index > 0,
                avatar: 'https://cdn-icons-png.flaticon.com/512/4537/4537019.png'
              });
            }
          });
        }

        // Create notifications from recent events
        if (eventsRes.status === 'fulfilled' && eventsRes.value.status === 200) {
          const allEvents = eventsRes.value.data.data || [];
          allEvents.slice(0, 2).forEach((event, index) => {
            notifications.push({
              id: `event-${event.ID}`,
              type: 'event',
              message: `New event "${event.Title}" in ${event.Society_Name || 'a society'}`,
              time: formatTimeAgo(event.CreatedAt),
              read: index > 0,
              avatar: 'https://cdn-icons-png.flaticon.com/512/4537/4537019.png'
            });
          });
        }

        // Sort by time (most recent first)
        notifications.sort((a, b) => new Date(b.time) - new Date(a.time));
        setNotifications(notifications);
        setUnreadCount(notifications.filter(n => !n.read).length);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        setNotifications([]);
        setUnreadCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
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

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  const getNotificationIcon = (type) => {
    const icons = {
      like: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
      comment: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
      event: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      society: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
    };
    return icons[type] || icons.like;
  };

  const getNotificationColor = (type) => {
    const colors = {
      like: 'text-red-600 bg-red-100',
      comment: 'text-blue-600 bg-blue-100',
      event: 'text-green-600 bg-green-100',
      society: 'text-purple-600 bg-purple-100'
    };
    return colors[type] || colors.like;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
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
    <div className={`bg-white rounded-lg shadow-md p-6 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {unreadCount} new
            </span>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {isOpen ? 'Hide' : 'Show All'}
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        {notifications.slice(0, isOpen ? notifications.length : 3).map((notification) => (
          <div
            key={notification.id}
            className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
              !notification.read ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'
            }`}
            onClick={() => markAsRead(notification.id)}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getNotificationColor(notification.type)}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getNotificationIcon(notification.type)} />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">{notification.message}</p>
              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
            </div>
            {!notification.read && (
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
            )}
          </div>
        ))}
      </div>
      
      {notifications.length > 3 && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full mt-3 text-sm text-blue-600 hover:text-blue-800 text-center py-2"
        >
          View {notifications.length - 3} more notifications
        </button>
      )}
      
      {unreadCount > 0 && (
        <button
          onClick={markAllAsRead}
          className="w-full mt-3 text-sm text-gray-600 hover:text-gray-800 text-center py-2 border-t border-gray-200"
        >
          Mark all as read
        </button>
      )}
    </div>
  );
}
