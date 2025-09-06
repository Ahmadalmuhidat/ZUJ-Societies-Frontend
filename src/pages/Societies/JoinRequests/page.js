import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SocietyHeader from '../Components/SocietyHeader';
import AxiosClient from '../../../config/axios';
import RequestsList from './Components/RequestsList';
import StatsCards from './Components/StatsCards';
import RequestDetails from './Components/RequestDetails';

export default function SocietyJoinRequests() {
  const { id } = useParams();
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filter, setFilter] = useState('pending');

  const getAllJoinRequests = async () => {
    try {
      const response = await AxiosClient.get("/societies/get_all_join_requests", {
        params: {
          society_id: id
        }
      });

      if (response.status === 200) {
        setRequests(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching join requests:", error);
    }
  };

  const filteredRequests = requests.filter(req =>
    filter === 'all' || req.Status === filter
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    getAllJoinRequests();
  }, []);

  return (
    <>
      <SocietyHeader societyId={id || '1'} />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <StatsCards requests={requests} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <RequestsList
              filter={filter}
              setFilter={setFilter}
              filteredRequests={filteredRequests}
              selectedRequest={selectedRequest}
              setSelectedRequest={setSelectedRequest}
              formatDate={formatDate}
            />

            <RequestDetails
              setRequests={setRequests}
              setSelectedRequest={setSelectedRequest}
              selectedRequest={selectedRequest}
              getStatusBadge={getStatusBadge}
              formatDate={formatDate}
            />
          </div>
        </div>
      </main>
    </>
  );
}
