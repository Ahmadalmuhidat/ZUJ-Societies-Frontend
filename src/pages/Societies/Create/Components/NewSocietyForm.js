import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosClient from '../../../../config/axios';
import { toast } from 'react-toastify';

export default function NewSocietyForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    visibility: 'public',
    image: '',
    joinApproval: true,
    tags: [],
    rules: '',
    contactEmail: '',
    website: ''
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (formData.image) {
      setImagePreview(formData.image);
    }
  }, [formData.image]);

  const categories = [
    { value: 'Technology', icon: '💻', description: 'Programming, AI, Software Development' },
    { value: 'Science', icon: '🔬', description: 'Research, Experiments, Scientific Discovery' },
    { value: 'Arts & Culture', icon: '🎨', description: 'Visual Arts, Music, Literature, Theater' },
    { value: 'Sports & Recreation', icon: '⚽', description: 'Physical Activities, Games, Fitness' },
    { value: 'Academic', icon: '📚', description: 'Study Groups, Research, Academic Excellence' },
    { value: 'Social', icon: '👥', description: 'Networking, Social Events, Community Building' },
    { value: 'Professional', icon: '💼', description: 'Career Development, Industry Insights' },
    { value: 'Community Service', icon: '🤝', description: 'Volunteering, Social Impact, Charity' },
    { value: 'Religious', icon: '🕊️', description: 'Faith-based Activities, Spiritual Growth' },
    { value: 'Political', icon: '🏛️', description: 'Civic Engagement, Political Discussion' },
    { value: 'Environmental', icon: '🌱', description: 'Sustainability, Climate Action, Green Living' },
    { value: 'Health & Wellness', icon: '💚', description: 'Mental Health, Physical Wellness, Mindfulness' },
    { value: 'Entrepreneurship', icon: '🚀', description: 'Startups, Business, Innovation' },
    { value: 'Language & Culture', icon: '🌍', description: 'Language Learning, Cultural Exchange' },
    { value: 'Gaming', icon: '🎮', description: 'Video Games, Board Games, Esports' }
  ];

  const popularTags = [
    'Student-led', 'Beginner-friendly', 'Advanced', 'Networking', 'Mentorship',
    'Competition', 'Workshop', 'Discussion', 'Hands-on', 'Theory', 'Practical',
    'Online', 'In-person', 'Hybrid', 'Free', 'Paid', 'Certification'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleTagToggle = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Society name is required';
      if (formData.name.length < 3) newErrors.name = 'Society name must be at least 3 characters';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (formData.description.length < 20) newErrors.description = 'Description must be at least 20 characters';
      if (!formData.category) newErrors.category = 'Category is required';
    }
    
    if (step === 2) {
      if (formData.contactEmail && !/\S+@\S+\.\S+/.test(formData.contactEmail)) {
        newErrors.contactEmail = 'Please enter a valid email address';
      }
      if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
        newErrors.website = 'Please enter a valid website URL';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    return validateStep(1) && validateStep(2);
  };

  const nextStep = (e) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = (e) => {
    e.preventDefault();
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const createNewSociety = async (e) => {
    e.preventDefault();

    // Only submit if we're on the last step
    if (currentStep !== 3) {
      return;
    }

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

  const steps = [
    { number: 1, title: 'Basic Information', description: 'Tell us about your society' },
    { number: 2, title: 'Details & Media', description: 'Add images and contact info' },
    { number: 3, title: 'Settings', description: 'Configure privacy and rules' }
  ];

  return (
    <div className={`transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.number
                  ? 'bg-primary-600 border-primary-600 text-white'
                  : 'border-gray-300 text-gray-400'
              }`}>
                {currentStep > step.number ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <div className="ml-3 hidden sm:block">
                <p className={`text-sm font-medium ${currentStep >= step.number ? 'text-primary-600' : 'text-gray-500'}`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`hidden sm:block w-16 h-0.5 mx-4 ${
                  currentStep > step.number ? 'bg-primary-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={createNewSociety} onKeyDown={(e) => {
        if (e.key === 'Enter' && currentStep < 3) {
          e.preventDefault();
          nextStep(e);
        }
      }} className="space-y-8">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl shadow-card p-8 border border-gray-100">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
              <p className="text-gray-600">Let's start with the essential details about your society</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Society Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 ${
                    errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your society name"
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-2 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 resize-none ${
                    errors.description ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe your society's purpose, activities, and what makes it unique..."
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.description ? (
                    <p className="text-red-600 text-sm flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.description}
                    </p>
                  ) : (
                    <p className="text-gray-500 text-sm">Minimum 20 characters</p>
                  )}
                  <span className="text-gray-400 text-sm">{formData.description.length}/500</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Category *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categories.map(category => (
                    <button
                      key={category.value}
                      type="button"
                      onClick={() => handleInputChange('category', category.value)}
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                        formData.category === category.value
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{category.icon}</span>
                        <div>
                          <p className="font-medium">{category.value}</p>
                          <p className="text-xs text-gray-500">{category.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                {errors.category && (
                  <p className="text-red-600 text-sm mt-2 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.category}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Details & Media */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl shadow-card p-8 border border-gray-100">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Details & Media</h2>
              <p className="text-gray-600">Add visual elements and contact information</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Society Image
                </label>
                <div className="space-y-4">
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                    placeholder="https://example.com/image.jpg"
                  />
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Society preview"
                        className="w-full h-48 object-cover rounded-xl border border-gray-200"
                        onError={() => setImagePreview('')}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, image: '' }));
                          setImagePreview('');
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 ${
                      errors.contactEmail ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                    }`}
                    placeholder="society@example.com"
                  />
                  {errors.contactEmail && (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.contactEmail}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 ${
                      errors.website ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                    }`}
                    placeholder="https://yoursociety.com"
                  />
                  {errors.website && (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.website}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Tags (Optional)
                </label>
                <p className="text-sm text-gray-600 mb-3">Add tags to help people discover your society</p>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                        formData.tags.includes(tag)
                          ? 'bg-primary-100 text-primary-700 border border-primary-200'
                          : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Settings */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl shadow-card p-8 border border-gray-100">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
              <p className="text-gray-600">Configure privacy settings and community rules</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Society Visibility
                </label>
                <div className="space-y-3">
                  {[
                    { value: 'public', title: 'Public', description: 'Anyone can find and join your society', icon: '🌍' },
                    { value: 'private', title: 'Private', description: 'Only members can see society content', icon: '🔒' },
                    { value: 'invite-only', title: 'Invite Only', description: 'Members can only join by invitation', icon: '✉️' }
                  ].map(option => (
                    <label key={option.value} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name="visibility"
                        value={option.value}
                        checked={formData.visibility === option.value}
                        onChange={(e) => handleInputChange('visibility', e.target.value)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{option.icon}</span>
                          <span className="font-medium text-gray-900">{option.title}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">Require approval for new members</p>
                  <p className="text-sm text-gray-600">Review and approve membership requests</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.joinApproval}
                    onChange={(e) => handleInputChange('joinApproval', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Community Rules (Optional)
                </label>
                <textarea
                  rows={4}
                  value={formData.rules}
                  onChange={(e) => handleInputChange('rules', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 resize-none"
                  placeholder="Set guidelines for your community members..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => navigate('/societies')}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>

          <div className="flex space-x-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
              >
                Next Step
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 rounded-xl transition-colors ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating Society...</span>
                  </div>
                ) : (
                  'Create Society'
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
