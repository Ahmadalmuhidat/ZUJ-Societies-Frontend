import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useSocietyMembership } from '../../../context/MembershipContext';
import AxiosClient from '../../../config/axios';
import { toast } from 'react-toastify';
import DeleteConfirmationModal from '../../../shared/components/DeleteConfirmationModal';
import { formatEventDate } from '../../../utils/dateUtils';

export default function EventCard({ onEventDeleted, ...event }) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { isAdmin } = useSocietyMembership(event.Society);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const defaultImage = 'https://img.freepik.com/free-vector/multicultural-people-standing-together_74855-6583.jpg';

  const formattedDate = formatEventDate(event.Date);

  const handleClick = () => {
    navigate(`/events/${event.ID}`);
  };

  // Check if user can delete this event
  const canDelete = isAuthenticated && (
    event.User === user?.ID || // User is the creator
    isAdmin // User is admin of the society
  );

  const handleDelete = async () => {
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
        setShowDeleteModal(false);
        if (onEventDeleted) {
          onEventDeleted(event.ID);
        }
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error(error.response?.data?.error_message || "Failed to delete event");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevent event card click
    setShowDeleteModal(true);
  };

  return (
    <>
      <div
        onClick={handleClick}
        className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md group transition-all duration-300 transform hover:-translate-y-1 cursor-pointer mb-4 relative"
      >
        {/* Delete button */}
        {canDelete && (
          <button
            onClick={handleDeleteClick}
            className="absolute top-3 right-3 z-10 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
            title="Delete event"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}

        <div className="relative h-48 w-full overflow-hidden">
          <img 
            src={event.Image || defaultImage}
            alt={event.Title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = defaultImage;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div className="p-4 flex gap-3">
          <div className="flex flex-col items-center justify-center bg-indigo-100 rounded-lg px-3 py-2 text-indigo-700 min-w-[80px]">
            <span className="text-xs font-semibold">{event.Time}</span>
            <span className="text-sm font-bold">{formattedDate}</span>
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors duration-300 mb-1">{event.Title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2 mb-2 whitespace-pre-line">{event.Description}</p>
            <div className="text-xs text-gray-500">
              📍 {event.Location} &nbsp;|&nbsp; 🏷️ {event.Category}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Event"
        message={`Are you sure you want to delete "${event.Title}"? This action cannot be undone.`}
        confirmText="Delete Event"
        isLoading={isDeleting}
      />
    </>
  );
}
