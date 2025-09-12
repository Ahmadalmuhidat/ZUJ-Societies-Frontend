import React, { useEffect, useRef, useState } from 'react';
import SocietyNav from './SocietyNav';
import { useAuth } from '../../../context/AuthContext';
import AxiosClient from '../../../config/axios';

// Simple in-memory caches to persist across tab switches within the session
const societyDetailsCache = new Map(); // key: societyId -> details object
const joinStatusCache = new Map(); // key: societyId -> boolean

export default function SocietyHeader({ societyId, showJoinButton = false, actionButton }) {
  const cacheDetails = societyDetailsCache.get(societyId);
  const cacheJoin = joinStatusCache.get(societyId);
  const [details, setDetails] = useState(cacheDetails || {});
  const { isAuthenticated } = useAuth();
  const [joinRequested, setJoinRequested] = useState(Boolean(cacheJoin));
  const [mounted, setMounted] = useState(Boolean(cacheDetails));
  const fetchedRef = useRef(false);

  const getSocietyDetails = async () => {
    try {
      const response = await AxiosClient.get('/societies/get_society_info', {
        params: { society_id: societyId },
      });
      if (response.status === 200) {
        societyDetailsCache.set(societyId, response.data.data);
        setDetails(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching society details:', error);
    }
  };

  const checkJoinRequest = async () => {
    try {
      const response = await AxiosClient.get('/societies/join_requests/check', {
        params: {
          token: localStorage.getItem("token") || sessionStorage.getItem("token"),
          society_id: societyId
        },
      });

      if (response.status === 200) {
        if (response.data.data == "pending") {
          joinStatusCache.set(societyId, true);
          setJoinRequested(true);
        }
      }
    } catch (error) {
      console.error('Error fetching society details:', error);
    }
  };

  const handleJoinSociety = async () => {
    if (!isAuthenticated) return;

    try {
      const response = await AxiosClient.post("/societies/join_society_request", {
        society_id: societyId,
        token: localStorage.getItem("token") || sessionStorage.getItem("token")
      });

      if (response.status === 200) {
        joinStatusCache.set(societyId, true);
        setJoinRequested(true);
      }
    } catch (err) {
      console.error('Failed to request join:', err);
    }
  };

  useEffect(() => {
    // Avoid duplicate fetches if already fetched for this societyId
    if (!cacheDetails && !fetchedRef.current) {
      fetchedRef.current = true;
      getSocietyDetails();
    }
    if (isAuthenticated && cacheJoin !== true) {
      checkJoinRequest();
    }
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, [societyId, isAuthenticated]);

  return (
    <>
      {/* Cover Section */}
      <div className={`relative h-64 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        <div className="relative max-w-6xl mx-auto px-4 h-full flex items-end pb-6">
          <div className="flex items-end space-x-6">
            <div className="w-32 h-32 bg-white rounded-lg shadow-lg overflow-hidden border-4 border-white">
              <img
                src={details.Image}
                alt={details.Name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/128x128/3B82F6/ffffff?text=${encodeURIComponent(details.Name?.charAt(0) || 'S')}`;
                }}
              />
            </div>
            <div className="text-white pb-2">
              <h1 className="text-4xl font-bold mb-2">{details.Name}</h1>
              <p className="text-lg opacity-90 mb-2">{details.Description}</p>
              <div className="flex items-center space-x-4 text-sm">
                <span>{details.Category}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation and Action Buttons */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <SocietyNav societyId={societyId} />
            <div className="flex space-x-3">
              {actionButton}
              {showJoinButton && isAuthenticated && (
                <button
                  onClick={handleJoinSociety}
                  disabled={joinRequested}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    joinRequested
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {joinRequested ? 'Request Sent' : 'Join Society'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
