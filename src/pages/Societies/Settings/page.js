import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SocietyHeader from '../Components/SocietyHeader';
import AxiosClient from '../../../config/axios';
import { toast } from "react-toastify";
import General from './Components/General';
import Privacy from './Components/Privacy';
import Permissions from './Components/Permissions';
import Notifications from './Components/Notifications';
import DangerZone from './Components/DangerZone';

export default function SocietySettings() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      name: '',
      description: '',
      image: '',
      category: ''
    },
    privacy: {
      visibility: 'public',
      joinApproval: true,
      memberListVisible: true,
      eventsVisible: true
    },
    permissions: {
      whoCanPost: 'all-members',
      whoCanCreateEvents: 'moderators',
      whoCanInvite: 'all-members'
    },
    notifications: {
      newMemberNotifications: true,
      eventReminders: true,
      weeklyDigest: false,
      emailNotifications: true
    }
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSaveChanges = async () => {
    const loadingToastId = toast.loading(`Updating society information...`);
    try {
      const response = await AxiosClient.put("/societies/update_info", {
        token: localStorage.getItem("token") || sessionStorage.getItem("token"),
        society_id: id,
        name: settings.general.name,
        description: settings.general.description,
        category: settings.general.category,
        privacy: settings.privacy,
        permissions: settings.permissions,
        notifications: settings.notifications
      });

      if (response.status === 204) {
        toast.success(`Society information has been updated`, { id: loadingToastId });
      }
    } catch (error) {
      console.error(error);
      toast.error(`Something went wrong while updating the society information`, { id: loadingToastId });
    }
  };

  const getSocietyDetails = async () => {
    try {
      const response = await AxiosClient.get('/societies/get_society_info', {
        params: { society_id: id },
      });

      if (response.status === 200) {
        const data = response.data.data;

        setSettings({
          general: {
            name: data.Name,
            description: data.Description,
            image: data.Image,
            category: data.Category
          },
          privacy: data.Privacy || {
            visibility: 'public',
            joinApproval: true,
            memberListVisible: true,
            eventsVisible: true
          },
          permissions: data.Permissions || {
            whoCanPost: 'all-members',
            whoCanCreateEvents: 'moderators',
            whoCanInvite: 'all-members'
          },
          notifications: data.Notifications || {
            newMemberNotifications: true,
            eventReminders: true,
            weeklyDigest: false,
            emailNotifications: true
          }
        });
      }
    } catch (error) {
      console.error('Error fetching society details:', error);
    }
  };

  const handleGeneralChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      general: {
        ...prev.general,
        [field]: value
      }
    }));
  };

  const handlePrivacyChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [field]: value
      }
    }));
  };

  const handlePermissionChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [field]: value
      }
    }));
  };

  const handleNotificationChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value
      }
    }));
  };

  const leaveSociety = async () => {
    const loadingToastId = toast.loading(`leaving society`);
    try {
      const response = await AxiosClient.put("/societies/leave_society", {
        token: localStorage.getItem("token") || sessionStorage.getItem("token"),
        society_id: id
      });

      if (response.status === 200) {
        toast.success(`You left the society`, { id: loadingToastId });
        navigate("/societies");
      }
    } catch (error) {
      toast.error(`Something went wrong while leaving the society`, { id: loadingToastId });
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'permissions', label: 'Permissions', icon: '👥' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'danger', label: 'Danger Zone', icon: '⚠️' }
  ];

  useEffect(() => {
    getSocietyDetails();
  }, []);

  return (
    <>
      <SocietyHeader societyId={id || '1'} />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Settings Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
                <nav className="space-y-2">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                    >
                      <span className="mr-3">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-md p-6">
                {activeTab === 'general' && <General settings={settings} handleGeneralChange={handleGeneralChange} />}
                {activeTab === 'privacy' && <Privacy settings={settings} handlePrivacyChange={handlePrivacyChange} />}
                {activeTab === 'permissions' && <Permissions settings={settings} handlePermissionChange={handlePermissionChange} />}
                {activeTab === 'notifications' && <Notifications settings={settings} handleNotificationChange={handleNotificationChange} />}
                {activeTab === 'danger' && <DangerZone leaveSociety={leaveSociety} setShowDeleteConfirm={setShowDeleteConfirm} />}

                {activeTab !== 'danger' && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex justify-end space-x-3">
                      <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                      <button onClick={handleSaveChanges} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Save Changes</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold text-red-600 mb-4">Confirm Deletion</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this society? This action cannot be undone and will permanently remove all data, members, and events.
                </p>
                <div className="flex space-x-3">
                  <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                  <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Delete Forever</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
