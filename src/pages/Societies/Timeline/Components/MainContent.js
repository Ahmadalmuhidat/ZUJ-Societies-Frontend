// src/pages/SocietyDetails/Components/MainContent.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../../../../SharedComponents/post/PostCard';
import EventCard from '../../../Events/Components/EventCard';
import AxiosClient from '../../../../config/axios';

export default function Timeline({ id, posts, getPostsBySociety }) {
  const [events, setEvents] = useState([]);

  const getEventsBySociety = async () => {
    try {
      const response = await AxiosClient.get("/events/get_events_by_society", {
        params: { society_id: id },
      });

      if (response.status === 200) {
        setEvents(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch events:", err);
    }
  };

  useEffect(() => {
    getPostsBySociety();
    getEventsBySociety();
  }, [id]);

  return (
    <div className="lg:col-span-2">
      <div className="w-full px-4 py-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Recent Activity</h2>

          {/* Posts */}
          {posts.map((post) => (
            <PostCard key={post.ID} post={post} />
          ))}

          {posts.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">No recent activity. Be the first to post!</p>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Events */}
      {events.length > 0 ? (
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Upcoming Events</h2>
            <Link
              to={`/societies/${id}/events`}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View All Events
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <EventCard key={event.ID} {...event} />
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-12 bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
          No upcoming events.
        </div>
      )}
    </div>
  );
}
