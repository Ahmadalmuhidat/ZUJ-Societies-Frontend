import React, { useEffect, useState } from 'react';

export default function CommentList({ comments }) {
  const [visibleCount, setVisibleCount] = useState(1);
  const [mounted, setMounted] = useState(false);

  const handleViewMore = () => setVisibleCount((prev) => prev + 3);

  const displayedComments = comments.slice(0, visibleCount);
  const hasMore = visibleCount < comments.length;

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className={`space-y-4 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      {displayedComments.map((comment) => (
        <div key={comment.id} className="flex">
          <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
            <img
              src={comment.User_Photo || 'https://cdn-icons-png.flaticon.com/512/4537/4537019.png'}
              alt={comment.User_Name}
              className="w-9 h-9 rounded-full object-cover"
            />
          </div>
          <div className="ml-2 bg-gray-100 rounded-lg p-3 flex-1">
            <div className="flex justify-between items-start">
              <h4 className="font-semibold text-sm">{comment.User_Name}</h4>
            </div>
            <p className="text-sm mt-1 text-gray-900 font-medium">{comment.Content}</p>
          </div>
        </div>
      ))}

      {hasMore && (
        <button
          onClick={handleViewMore}
          className="text-blue-600 hover:underline text-sm mt-2"
        >
          View more comments
        </button>
      )}
    </div>
  );
}
