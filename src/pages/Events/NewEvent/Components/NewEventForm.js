import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AxiosClient from '../../../../config/axios';
import { toast } from "react-toastify";

export default function NewEventForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    location: '',
    category: '',
    isOnline: false,
    onlineLink: '',
    imageUrl: ''
  });

  const [errors, setErrors] = useState({});

  const categories = [
    'Workshop',
    'Seminar',
    'Conference',
    'Networking',
    'Social',
    'Competition',
    'Training',
    'Meeting',
    'Presentation',
    'Panel Discussion',
    'Hackathon',
    'Exhibition'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Event description is required';
    }

    if (!formData.date) {
      newErrors.date = 'Event date is required';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.isOnline && !formData.location.trim()) {
      newErrors.location = 'Location is required for in-person events';
    }

    if (formData.isOnline && !formData.onlineLink.trim()) {
      newErrors.onlineLink = 'Online meeting link is required for virtual events';
    }

    if (formData.imageUrl && !/^https?:\/\/.+/.test(formData.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid URL (starting with http:// or https://)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createNewEvent = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    const loadingToastId = toast.loading(`creating new event`);
    setIsSubmitting(true);

    try {
      const response = await AxiosClient.post("/events/create_event", {
        token: localStorage.getItem("token") || sessionStorage.getItem("token"),
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.startTime,
        category: formData.category,
        society_id: id,
        location: formData.location,
        image: formData.imageUrl
      });

      if (response.status === 201) {
        toast.success(`event has been created`, { id: loadingToastId });
        navigate(`/societies/${id}/events`);
      }
    } catch (error) {
      toast.error(`Something went wrong while creating the event`, { id: loadingToastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={createNewEvent} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Event Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter event title"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Describe what the event is about..."
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
          </div>

          {/* Image URL */}
          <div className="md:col-span-2">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Event Image URL (Optional)
            </label>
            <input
              type="url"
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => handleInputChange('imageUrl', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.imageUrl ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="https://example.com/event-image.jpg"
            />
            {errors.imageUrl && <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>}
          </div>
        </div>
      </div>

      {/* Date & Time */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Date & Time</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Event Date *
            </label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
          </div>

          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
              Start Time *
            </label>
            <input
              type="time"
              id="startTime"
              value={formData.startTime}
              onChange={(e) => handleInputChange('startTime', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.startTime ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.startTime && <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>}
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Location</h2>

        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="eventType"
                checked={!formData.isOnline}
                onChange={() => handleInputChange('isOnline', false)}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">In-Person Event</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="eventType"
                checked={formData.isOnline}
                onChange={() => handleInputChange('isOnline', true)}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Online Event</span>
            </label>
          </div>

          {!formData.isOnline ? (
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Venue Location *
              </label>
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="e.g., Main Auditorium, Room 101"
              />
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
            </div>
          ) : (
            <div>
              <label htmlFor="onlineLink" className="block text-sm font-medium text-gray-700 mb-2">
                Online Meeting Link *
              </label>
              <input
                type="url"
                id="onlineLink"
                value={formData.onlineLink}
                onChange={(e) => handleInputChange('onlineLink', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.onlineLink ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="https://zoom.us/j/... or https://meet.google.com/..."
              />
              {errors.onlineLink && <p className="mt-1 text-sm text-red-600">{errors.onlineLink}</p>}
            </div>
          )}
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => navigate(`/societies/${id}/events`)}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${isSubmitting
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'}`}
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Event...
            </div>
          ) : (
            'Create Event'
          )}
        </button>
      </div>
    </form>
  );
}
