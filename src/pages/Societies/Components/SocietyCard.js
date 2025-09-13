import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function SocietyCard(props) {
  const navigate = useNavigate();
  const [joined, setJoined] = useState(false);
  const defaultImage = 'https://img.freepik.com/free-vector/multicultural-people-standing-together_74855-6583.jpg';

  const handleClick = () => navigate(`/societies/${props.ID}`);

  const handleJoin = (e) => {
    e.stopPropagation();
    setJoined(true);
    // TODO: trigger join request API call
  };

  return (
    <div 
      onClick={handleClick}
      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transform hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100 mb-4"
    >
      <div className="relative h-40 w-full overflow-hidden">
        <img 
          src={props.Image || defaultImage}
          alt={props.Name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = defaultImage;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 mb-1">
          {props.Name}
        </h3>
        <span className="inline-block text-xs font-medium text-indigo-600 uppercase tracking-wide mb-2">
          {props.Category}
        </span>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3 whitespace-pre-line">
          {props.Description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{props.Member_Count || 0} members</span>
        </div>
      </div>
    </div>
  );
}
