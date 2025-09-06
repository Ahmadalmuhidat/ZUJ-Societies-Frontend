import React from 'react';
import AxiosClient from '../../../../config/axios';

export default function RequestDetails({ setRequests, selectedRequest, setSelectedRequest, getStatusBadge, formatDate }) {
  
  const handleApprove = async (requestId) => {
    setRequests(prev => prev.map(req => 
      req.Request_ID === requestId ? { ...req, Status: 'approved' } : req
    ));

    const response = await AxiosClient.post("/societies/approve_request", {
      request_id: requestId
    });

    if (response.status === 200) {
      setSelectedRequest(null);
    }
  };

  const handleReject = async (requestId) => {
    setRequests(prev => prev.map(req => 
      req.Request_ID === requestId ? { ...req, Status: 'rejected' } : req
    ));

    const response = await AxiosClient.post("/societies/reject_request", {
      request_id: requestId
    });

    if (response.status === 204) {
      setSelectedRequest(null);
    }
  };

  return (
    <div className="lg:col-span-1">
      {selectedRequest ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Details</h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src={selectedRequest.User_Photo || 'https://cdn-icons-png.flaticon.com/512/4537/4537019.png'}
                alt={selectedRequest.User_Name}
                className="w-16 h-16 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedRequest.User_Name)}&background=3B82F6&color=fff`;
                }}
              />
              <div>
                <h4 className="text-lg font-medium text-gray-900">{selectedRequest.User_Name}</h4>
                <p className="text-sm text-gray-600">{selectedRequest.User_Email}</p>
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-2">Status</h5>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadge(selectedRequest.Status)}`}>
                {selectedRequest.Status}
              </span>
            </div>

            {selectedRequest.Status === 'pending' && (
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => handleApprove(selectedRequest.Request_ID)}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(selectedRequest.Request_ID)}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Select a Request</h3>
            <p className="mt-1 text-sm text-gray-500">
              Click on a request from the list to view details and take action.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
