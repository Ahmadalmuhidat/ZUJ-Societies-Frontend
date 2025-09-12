import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function EventCard(event) {
  const navigate = useNavigate();
  const defaultImage = 'https://img.freepik.com/free-vector/multicultural-people-standing-together_74855-6583.jpg';

  const formattedDate = new Date(event.Date).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const handleClick = () => {
    navigate(`/events/${event.ID}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-2xl overflow-hidden shadow-md group transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2 cursor-pointer max-w-md mx-auto"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={event.Image || defaultImage}
          alt={event.Title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = defaultImage;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="p-4 flex gap-4">
        <div className="flex flex-col items-center justify-center bg-indigo-100 rounded-xl px-3 py-2 text-indigo-700">
          <span className="text-xs font-semibold">{event.Time}</span>
          <span className="text-sm font-bold">{formattedDate}</span>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors duration-300">{event.Title}</h3>
          <p className="text-sm text-gray-600 mt-1">{event.Description}</p>
          <div className="text-xs text-gray-500 mt-2">
            📍 {event.Location} &nbsp;|&nbsp; 🏷️ {event.Category}
          </div>
        </div>
      </div>
    </div>
  );
}
