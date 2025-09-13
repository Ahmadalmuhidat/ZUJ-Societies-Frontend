import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AxiosClient from '../../config/axios';

export default function SocietySearch({ societies = [], onSearchChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSocieties, setFilteredSocieties] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = societies.filter(society =>
        society.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        society.Description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        society.Category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSocieties(filtered.slice(0, 5)); // Show top 5 results
      setShowSuggestions(true);
    } else {
      setFilteredSocieties([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, societies]);

  // Fetch societies if not provided
  useEffect(() => {
    if (societies.length === 0) {
      const fetchSocieties = async () => {
        try {
          const token = localStorage.getItem('token') || sessionStorage.getItem('token');
          const response = await AxiosClient.get('/societies/get_all_societies', { 
            params: { token } 
          });
          if (response.status === 200) {
            // This would need to be passed up to parent component
            // For now, we'll work with the provided societies prop
          }
        } catch (error) {
          console.error('Failed to fetch societies:', error);
        }
      };
      fetchSocieties();
    }
  }, [societies.length]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearchChange) {
      onSearchChange(query);
    }
  };

  const handleSocietyClick = (society) => {
    setSearchQuery(society.Name);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowSuggestions(false);
    if (onSearchChange) {
      onSearchChange('');
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <div className="relative">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search societies..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setShowSuggestions(true)}
              className="w-full pl-10 pr-10 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Search Suggestions */}
        {showSuggestions && filteredSocieties.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredSocieties.map((society) => (
              <div
                key={society.ID}
                onClick={() => handleSocietyClick(society)}
                className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                    {society.Name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {society.Name}
                    </h4>
                    <p className="text-xs text-gray-600 truncate whitespace-pre-line">
                      {society.Description || 'No description available'}
                    </p>
                    {society.Category && (
                      <span className="inline-block mt-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                        {society.Category}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {society.Member_Count || 0} members
                  </div>
                </div>
              </div>
            ))}
            <div className="p-3 text-center text-sm text-gray-600 border-t border-gray-100">
              <Link to={`/societies?search=${encodeURIComponent(searchQuery)}`} className="text-blue-600 hover:text-blue-800">
                View all results for "{searchQuery}"
              </Link>
            </div>
          </div>
        )}

        {/* No Results */}
        {showSuggestions && searchQuery && filteredSocieties.length === 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
            <div className="p-4 text-center text-gray-600">
              <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm">No societies found for "{searchQuery}"</p>
              <p className="text-xs text-gray-500 mt-1">Try a different search term</p>
            </div>
          </div>
        )}
      </div>

      {/* Search Stats */}
      {searchQuery && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Found {filteredSocieties.length} society{filteredSocieties.length !== 1 ? 'ies' : ''} matching "{searchQuery}"
          </p>
        </div>
      )}
    </div>
  );
}
