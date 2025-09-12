import AxiosClient from '../../../config/axios';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';

export default function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const defaultImage = 'https://img.freepik.com/free-vector/multicultural-people-standing-together_74855-6583.jpg';

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
    const idAnim = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(idAnim);
  }, [id]);

  // Prepare memoized values BEFORE any early returns to satisfy rules-of-hooks
  const eventDate = event?.Date;
  const eventTime = event?.Time;
  const eventLocation = event?.Location;
  const eventTitle = event?.Title;
  const eventDescription = event?.Description;

  const parseEventDate = (dateInput, timeInput) => {
    if (!dateInput && !timeInput) return null;
    const tryParse = (value) => {
      const d = new Date(value);
      return isNaN(d.getTime()) ? null : d;
    };

    // 1) If already ISO or parseable as-is
    const direct = tryParse(dateInput);
    if (direct) return direct;

    // 2) Combine with time using ISO T
    if (dateInput && timeInput) {
      const combinedISO = tryParse(`${dateInput}T${timeInput}`);
      if (combinedISO) return combinedISO;
      const combinedSpace = tryParse(`${dateInput} ${timeInput}`);
      if (combinedSpace) return combinedSpace;
    }

    // 3) Numeric timestamp (seconds or ms)
    if (dateInput && /^\d+$/.test(String(dateInput))) {
      const num = Number(dateInput);
      const ms = num < 1e12 ? num * 1000 : num; // if seconds, convert to ms
      const numeric = tryParse(ms);
      if (numeric) return numeric;
    }

    return null;
  };

  const formattedDate = useMemo(() => {
    const parsed = parseEventDate(eventDate, eventTime);
    if (parsed) {
      return parsed.toLocaleString(undefined, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    const raw = [eventDate, eventTime].filter(Boolean).join(' ');
    return raw || 'TBD';
  }, [eventDate, eventTime]);

  const mapUrl = useMemo(() => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(eventLocation || '')}`, [eventLocation]);
  const shareData = useMemo(() => ({
    title: eventTitle || 'Event',
    text: (eventDescription && eventDescription.slice(0, 140)) || 'Check out this event',
    url: typeof window !== 'undefined' ? window.location.href : ''
  }), [eventTitle, eventDescription]);

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden animate-pulse">
          <div className="w-full h-72 sm:h-96 bg-gray-200"></div>
          <div className="p-6 sm:p-10 space-y-6">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-5 bg-gray-200 rounded w-1/5"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
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

  

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success('Link copied to clipboard');
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className={`bg-gray-100 min-h-screen py-10 px-4 sm:px-6 lg:px-8 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
        <img
          src={event.Image || defaultImage}
          alt={event.Title}
          className="w-full h-72 object-cover sm:h-96"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = defaultImage;
          }}
        />
        <div className="p-6 sm:p-10">
          <div className="flex items-start justify-between gap-4 mb-4">
            <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center gap-2">
              <span>←</span>
              <span>Back</span>
            </button>
            <div className="flex items-center gap-2">
              <button onClick={handleShare} className="px-3 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50">Share</button>
              <a href={mapUrl} target="_blank" rel="noreferrer" className="px-3 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50">Directions</a>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            {event.Title}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Date & Time</h2>
              <p className="text-base text-gray-800">{formattedDate}</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Location</h2>
              <p className="text-base text-gray-800">{event.Location}</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Category</h2>
              <p className="text-base text-gray-800">{event.Category}</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Organizer</h2>
              <p className="text-base text-gray-800">{event.Organizer}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">About this Event</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{event.Description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
