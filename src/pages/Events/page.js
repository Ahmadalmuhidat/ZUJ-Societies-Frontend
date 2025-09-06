import { useEffect, useState } from 'react';
import EventCard from './Components/EventCard';
import EventFilters from './Components/EventFilters';
import AxiosClient from '../../config/axios';

export default function Events() {
  const [filter, setFilter] = useState({
    days: 'All Days',
    type: 'Event Type',
    category: 'Any Category'
  });
  const [events, setEvents] = useState([]);

  const getEvents = async () => {
    try {
      const response = await AxiosClient.get("/events/get_all_events");
      if (response.status === 200) {
        setEvents(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  useEffect(() => {
    getEvents();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Upcoming Events</h1>
          <EventFilters filter={filter} setFilter={setFilter} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.ID} {...event} />
          ))}
        </div>
        
        {events.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No events found matching your criteria.</p>
          </div>
        )}
      </div>
    </main>
  );
}
