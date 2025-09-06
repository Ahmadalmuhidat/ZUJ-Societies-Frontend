import AxiosClient from '../../../config/axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function EventDetailsPage() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getEventInfo = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await AxiosClient.get("/events/get_event_info", {
        params: {
          event_id: id,
        },
      });

      if (response.status === 200) {
        setEvent(response.data.data);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong.');
      setEvent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEventInfo();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-gray-700">
        Loading event details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 text-lg">
        {error}
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 text-lg">
        Event not found.
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
        <img
          src={event.Image}
          alt={event.Title}
          className="w-full h-72 object-cover sm:h-96"
        />
        <div className="p-6 sm:p-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            {event.Title}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Date & Time
              </h2>
              <p className="text-base text-gray-800">{event.Date}</p>
              <p className="text-base text-gray-800">{event.Time}</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Location
              </h2>
              <p className="text-base text-gray-800">{event.Location}</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Category
              </h2>
              <p className="text-base text-gray-800">{event.Category}</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Organizer
              </h2>
              <p className="text-base text-gray-800">{event.Organizer}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              About this Event
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {event.Description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
