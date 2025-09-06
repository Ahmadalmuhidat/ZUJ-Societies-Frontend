import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosClient from '../../../../config/axios';
import { toast } from 'react-toastify';

export default function NewSocietyForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    visibility: 'public',
    image: '',
    joinApproval: true
  });

  const [errors, setErrors] = useState({});

  const categories = [
    'Technology',
    'Science',
    'Arts & Culture',
    'Sports & Recreation',
    'Academic',
    'Social',
    'Professional',
    'Community Service',
    'Religious',
    'Political',
    'Environmental',
    'Health & Wellness'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Society name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createNewSociety = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const loadingToastId = toast.loading('Creating new society...');
    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        visibility: formData.visibility,
        image: formData.image,
        token: localStorage.getItem('token') || sessionStorage.getItem('token')
      };

      const response = await AxiosClient.post('/societies/create_society', payload);

      if (response.status === 201) {
        toast.success('Society has been created', { id: loadingToastId });
        navigate('/societies/' + response.data.data);
      } else {
        throw new Error('Error creating society');
      }
    } catch (err) {
      toast.error('Something went wrong while creating the society', { id: loadingToastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={createNewSociety} className="space-y-8">
      {/* Basic Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block mb-2">Society Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter your society name"
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2">Description *</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Describe your society"
            />
            {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="block mb-2">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select a category</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
          </div>
        </div>
      </div>

      {/* Image */}
      <div>
        <label className="block mb-2">Society Image URL (Optional)</label>
        <input
          type="url"
          value={formData.image}
          onChange={(e) => handleInputChange('image', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg ${errors.image ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      {/* Privacy */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Privacy Settings</h2>
        <div className="space-y-4">
          <div>
            <p className="font-medium mb-2">Society Visibility</p>
            {['public', 'private', 'invite-only'].map(v => (
              <label key={v} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="visibility"
                  value={v}
                  checked={formData.visibility === v}
                  onChange={(e) => handleInputChange('visibility', e.target.value)}
                />
                <span className="capitalize">{v.replace('-', ' ')}</span>
              </label>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Require approval for new members</p>
            </div>
            <input
              type="checkbox"
              checked={formData.joinApproval}
              onChange={(e) => handleInputChange('joinApproval', e.target.checked)}
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-4">
        <button type="button" onClick={() => navigate('/societies')} className="px-6 py-2 border rounded-lg">Cancel</button>
        <button type="submit" disabled={isSubmitting} className={`px-6 py-2 rounded-lg ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
          {isSubmitting ? 'Creating...' : 'Create Society'}
        </button>
      </div>
    </form>
  );
}
