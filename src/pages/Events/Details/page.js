import AxiosClient from '../../../config/axios';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useSocietyMembership } from '../../../context/MembershipContext';
import DeleteConfirmationModal from '../../../shared/components/DeleteConfirmationModal';

export default function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [event, setEvent] = useState(null);
  const { isAdmin } = useSocietyMembership(event?.Society);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [isAttending, setIsAttending] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [eventStats, setEventStats] = useState({ attendees: 0, interested: 0, shares: 0 });
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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

  // Fetch event statistics
  const getEventStats = async () => {
    try {
      setLoadingStats(true);
      const response = await AxiosClient.get("/events/get_event_stats", {
        params: { event_id: id }
      });
      if (response.status === 200) {
        setEventStats(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch event stats:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  // Fetch related events
  const getRelatedEvents = async () => {
    try {
      setLoadingRelated(true);
      const response = await AxiosClient.get("/events/get_related_events", {
        params: { event_id: id, limit: 3 }
      });
      if (response.status === 200) {
        setRelatedEvents(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch related events:", err);
    } finally {
      setLoadingRelated(false);
    }
  };

  // Get user's event status (attendance and bookmark)
  const getUserEventStatus = async () => {
    if (!isAuthenticated) return;
    
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await AxiosClient.get("/events/get_user_status", {
        params: { event_id: id, token }
      });
      if (response.status === 200) {
        const { attendance, bookmarked } = response.data.data;
        setIsAttending(attendance === 'attending');
        setIsBookmarked(bookmarked);
      }
    } catch (err) {
      console.error("Failed to fetch user event status:", err);
    }
  };

  // Toggle attendance
  const toggleAttendance = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const newStatus = isAttending ? 'not_attending' : 'attending';
      
      const response = await AxiosClient.post("/events/toggle_attendance", {
        event_id: id,
        status: newStatus,
        token
      });
      
      if (response.status === 200) {
        setIsAttending(!isAttending);
        getEventStats(); // Refresh stats
        toast.success(response.data.data.message);
      }
    } catch (err) {
      console.error("Failed to toggle attendance:", err);
      toast.error("Failed to update attendance");
    }
  };

  // Toggle bookmark
  const toggleBookmark = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await AxiosClient.post("/events/toggle_bookmark", {
        event_id: id,
        token
      });
      
      if (response.status === 200) {
        setIsBookmarked(response.data.data.bookmarked);
        toast.success(response.data.data.message);
      }
    } catch (err) {
      console.error("Failed to toggle bookmark:", err);
      toast.error("Failed to update bookmark");
    }
  };

  // Record share
  const recordShare = async () => {
    if (!isAuthenticated) return;

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await AxiosClient.post("/events/record_share", {
        event_id: id,
        token
      });
      getEventStats(); // Refresh stats
    } catch (err) {
      console.error("Failed to record share:", err);
    }
  };

  // Check if user can delete this event
  const canDelete = useMemo(() => {
    if (!isAuthenticated || !event || !user) return false;
    return event.User === user.ID || isAdmin;
  }, [isAuthenticated, event, user, isAdmin]);

  const handleDeleteEvent = async () => {
    try {
      setIsDeleting(true);
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      
      const response = await AxiosClient.delete("/events/delete_event", {
        params: { 
          event_id: event.ID,
          token: token
        }
      });

      if (response.status === 200) {
        toast.success("Event deleted successfully");
        navigate("/events");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error(error.response?.data?.error_message || "Failed to delete event");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  useEffect(() => {
    getEventInfo();
    getEventStats();
    getRelatedEvents();
    getUserEventStatus();
    const idAnim = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(idAnim);
  }, [id, isAuthenticated]);

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
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section Skeleton */}
        <div className="relative">
          <div className="w-full h-64 sm:h-80 lg:h-96 bg-gray-200 animate-pulse"></div>
          
          {/* Navigation Skeleton */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg">
              <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-white/90 backdrop-blur-sm">
                <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
              </div>
              <div className="p-2 rounded-lg bg-white/90 backdrop-blur-sm">
                <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Title Overlay Skeleton */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-20 bg-white/30 rounded-full animate-pulse"></div>
                <div className="h-4 w-32 bg-white/30 rounded animate-pulse"></div>
              </div>
              <div className="h-12 bg-white/30 rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="h-6 bg-white/30 rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Event Details Card Skeleton */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="p-3 bg-gray-100 rounded-lg">
                        <div className="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
                      </div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description Skeleton */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="h-8 bg-gray-200 rounded w-40 mb-4 animate-pulse"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
            <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteEvent}
        title="Delete Event"
        message={`Are you sure you want to delete "${event?.Title}"? This action cannot be undone.`}
        confirmText="Delete Event"
        isLoading={isDeleting}
      />
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
      // Record the share
      await recordShare();
      
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
    <div className={`min-h-screen bg-gray-50 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
        <img
          src={event.Image || defaultImage}
          alt={event.Title}
          className="w-full h-64 sm:h-80 lg:h-96 object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = defaultImage;
          }}
        />
        
        {/* Navigation */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleBookmark}
              className={`p-2 rounded-lg backdrop-blur-sm transition-all duration-200 ${
                isBookmarked 
                  ? 'bg-red-500 text-white shadow-lg' 
                  : 'bg-white/90 text-gray-700 hover:bg-white shadow-lg'
              }`}
            >
              <svg className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            
            <button 
              onClick={() => setShowShareModal(true)}
              className="p-2 rounded-lg bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white transition-all duration-200 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>

            {/* Delete button - only show if user can delete */}
            {canDelete && (
              <button 
                onClick={() => setShowDeleteModal(true)}
                className="p-2 rounded-lg bg-red-500 backdrop-blur-sm text-white hover:bg-red-600 transition-all duration-200 shadow-lg"
                title="Delete event"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Event Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 sm:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {event.Category}
              </span>
              <span className="text-white/80 text-sm">
                {formattedDate}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 drop-shadow-lg">
              {event.Title}
            </h1>
            <p className="text-white/90 text-lg sm:text-xl drop-shadow-md">
              📍 {event.Location}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Event Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Date & Time</h3>
                    <p className="text-gray-600">{formattedDate}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
            <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                    <p className="text-gray-600">{event.Location}</p>
                    <a 
                      href={mapUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center gap-1 mt-1"
                    >
                      Get Directions
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
            </div>
            <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Category</h3>
                    <p className="text-gray-600">{event.Category}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
            </div>
            <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Organizer</h3>
                    <p className="text-gray-600">{event.Organizer || 'ZUJ Societies'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this Event</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                  {event.Description}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Actions</h3>
              <div className="space-y-3">
                {isAuthenticated ? (
                  <>
                    <button 
                      onClick={toggleAttendance}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                        isAttending
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isAttending ? '✓ Attending' : 'Attend Event'}
                    </button>
                    <button 
                      onClick={() => setShowShareModal(true)}
                      className="w-full py-3 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-all duration-200"
                    >
                      Share Event
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="block w-full py-3 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium text-center transition-all duration-200"
                  >
                    Login to Attend
                  </Link>
                )}
              </div>
            </div>

            {/* Event Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Stats</h3>
              {loadingStats ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Attendees</span>
                    <span className="font-semibold text-gray-900">{eventStats.attendees}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Interested</span>
                    <span className="font-semibold text-gray-900">{eventStats.interested}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Shares</span>
                    <span className="font-semibold text-gray-900">{eventStats.shares}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Related Events */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Events</h3>
              {loadingRelated ? (
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-lg animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : relatedEvents.length > 0 ? (
                <div className="space-y-3">
                  {relatedEvents.map((relatedEvent) => {
                    const eventDate = new Date(relatedEvent.Date);
                    const formattedDate = eventDate.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    });
                    const formattedTime = relatedEvent.Time || 'TBD';
                    
                    return (
                      <Link
                        key={relatedEvent.ID}
                        to={`/events/${relatedEvent.ID}`}
                        className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      >
                        <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">
                          {relatedEvent.Title}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {formattedDate} • {formattedTime}
                        </p>
                        {relatedEvent.Category && (
                          <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {relatedEvent.Category}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">No related events found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Share Event</h3>
              <button 
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={handleShare}
                className="w-full py-3 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition-all duration-200"
              >
                Share via Native Share
              </button>
              <button 
                onClick={async () => {
                  await recordShare();
                  navigator.clipboard.writeText(shareData.url);
                  toast.success('Link copied to clipboard!');
                  setShowShareModal(false);
                }}
                className="w-full py-3 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-all duration-200"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
