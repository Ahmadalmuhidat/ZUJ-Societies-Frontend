import { useLocation, useNavigate } from 'react-router-dom';
import { useSocietyMembership } from '../../../context/MembershipContext';

export default function SocietyNav({ societyId }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isMember, isAdmin } = useSocietyMembership(societyId);

  const basePath = `/societies/${societyId}`;

  if (!isMember) return null;

  const navItems = [
    { label: 'Timeline', path: basePath, disabled: false },
    { label: 'Events', path: `${basePath}/events`, disabled: false },
    { label: 'Members', path: `${basePath}/members`, disabled: false },
    { label: 'Join Requests', path: `${basePath}/join-requests`, disabled: !isAdmin },
    { label: 'Settings', path: `${basePath}/settings`, disabled: !isAdmin },
  ];

  return (
    <nav className="flex space-x-6">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;

        return (
          <button
            key={item.label}
            onClick={() => !item.disabled && navigate(item.path)}
            disabled={item.disabled}
            className={`text-sm font-medium pb-2 ${
              isActive
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : item.disabled
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-indigo-600'
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
