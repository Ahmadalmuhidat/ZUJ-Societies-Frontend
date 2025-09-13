import { useLocation, useNavigate } from 'react-router-dom';
import { useSocietyMembership } from '../../../context/MembershipContext';

export default function SocietyNav({ societyId }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isMember, isAdmin } = useSocietyMembership(societyId);

  const basePath = `/societies/${societyId}`;

  if (!isMember) return null;

  const navItems = [
    { 
      label: 'Timeline', 
      path: basePath, 
      disabled: false,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      label: 'Events', 
      path: `${basePath}/events`, 
      disabled: false,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      label: 'Members', 
      path: `${basePath}/members`, 
      disabled: false,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      label: 'Join Requests', 
      path: `${basePath}/join-requests`, 
      disabled: !isAdmin,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      label: 'Settings', 
      path: `${basePath}/settings`, 
      disabled: !isAdmin,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
  ];

  return (
    <nav className="flex space-x-1 py-4">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;

        return (
          <button
            key={item.label}
            onClick={() => !item.disabled && navigate(item.path)}
            disabled={item.disabled}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              isActive
                ? 'bg-blue-100 text-blue-700 border border-blue-200 shadow-sm'
                : item.disabled
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
            }`}
          >
            <span className={`transition-colors duration-300 ${isActive ? 'text-blue-700' : item.disabled ? 'text-gray-400' : 'text-gray-500'}`}>
              {item.icon}
            </span>
            {item.label}
            {isActive && (
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            )}
          </button>
        );
      })}
    </nav>
  );
}
