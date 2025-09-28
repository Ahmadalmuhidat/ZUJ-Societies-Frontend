import React from 'react';

export default function Permissions({ settings, handlePermissionChange }) {
  const permissionOptions = [
    { key: 'whoCanPost', label: 'Who can create posts?', description: 'Control who can share posts in the society timeline' },
    { key: 'whoCanCreateEvents', label: 'Who can create events?', description: 'Control who can organize events for the society' },
    { key: 'whoCanInvite', label: 'Who can invite new members?', description: 'Control who can send invitations to join the society' }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Member Permissions</h3>
        <div className="flex items-center text-sm text-gray-500">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Auto-saved
        </div>
      </div>

      <div className="space-y-6">
        {permissionOptions.map((permission) => (
          <div key={permission.key}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {permission.label}
            </label>
            <p className="text-sm text-gray-600 mb-3">{permission.description}</p>
            <select
              value={settings.permissions[permission.key]}
              onChange={(e) => handlePermissionChange(permission.key, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="admins">Admins only</option>
              <option value="moderators">Admins and Moderators</option>
              <option value="all-members">All Members</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
