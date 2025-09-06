import React from 'react';

export default function EventStats({ events, isEventCompleted }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">

      {/* Upcoming Events */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="p-3 bg-blue-100 rounded-full">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
            <p className="text-2xl font-semibold text-gray-900">
              {events.filter(e => isEventCompleted(e) === 'upcoming').length}
            </p>
          </div>
        </div>
      </div>

      {/* Completed Events */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="p-3 bg-green-100 rounded-full">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Completed Events</p>
            <p className="text-2xl font-semibold text-gray-900">
              {events.filter(e => isEventCompleted(e) === 'completed').length}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
