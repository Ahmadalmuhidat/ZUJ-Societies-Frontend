import React from 'react';

export default function RequestsList({ filter, setFilter, filteredRequests, selectedRequest, setSelectedRequest }) {
  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Join Requests</h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Requests</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredRequests.map((request) => (
            <div
              key={request.Request_ID}
              className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${selectedRequest?.Request_ID === request.Request_ID ? 'bg-blue-50' : ''}`}
              onClick={() => setSelectedRequest(request)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <img
                    src={request.User_Photo || 'https://cdn-icons-png.flaticon.com/512/4537/4537019.png'}
                    alt={request.User_Name}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(request.User_Name)}&background=3B82F6&color=fff`;
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{request.User_Name}</h3>
                    <p className="text-sm text-gray-600">{request.User_Email}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <div className="p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No requests found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'pending' ? 'No pending join requests at the moment.' : 'Try changing the filter to see other requests.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
