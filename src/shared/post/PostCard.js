import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AxiosClient from '../../config/axios';
import { useAuth } from '../../context/AuthContext';
import CommentList from './CommentList';

export default function PostCard({ post }) {
  const { isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportMessage, setReportMessage] = useState('');
  const [isLiked, setIsLiked] = useState(post.Is_Liked);
  const [likesCount, setLikesCount] = useState(post.Likes);
  const [mounted, setMounted] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const defaultImage = 'https://img.freepik.com/free-vector/multicultural-people-standing-together_74855-6583.jpg';

  const handleLike = async () => {
    const prevIsLiked = isLiked;

    setIsLiked(!prevIsLiked);
    setLikesCount((prevLikes) =>
      !prevIsLiked ? prevLikes + 1 : Math.max(prevLikes - 1, 0)
    );

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');

      if (!prevIsLiked) {
        await AxiosClient.post('/posts/like_post', {
          token,
          post_id: post.ID,
        });
      } else {
        await AxiosClient.post('/posts/unlike_post', {
          token,
          post_id: post.ID,
        });
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);

      setIsLiked(prevIsLiked);
      setLikesCount((prevLikes) =>
        prevIsLiked ? prevLikes + 1 : Math.max(prevLikes - 1, 0)
      );
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const tempId = Date.now().toString();
    const optimisticComment = {
      id: tempId,
      Content: commentText,
      User_Name: 'You',
      User_Photo: 'https://cdn-icons-png.flaticon.com/512/4537/4537019.png',
    };

    setComments((prev) => [...prev, optimisticComment]);
    setCommentText('');
    setShowComments(true);

    try {
      const response = await AxiosClient.post('/comment/create_comment', {
        token: localStorage.getItem('token') || sessionStorage.getItem('token'),
        content: commentText,
        post_id: post.ID,
      });

      if (response.status !== 201) throw new Error('Failed to add comment');
    } catch (err) {
      console.error('Failed to add comment:', err);
      setComments((prev) => prev.filter((c) => c.id !== tempId));
    }
  };

  const toggleComments = () => setShowComments((prev) => !prev);

  const getComments = async () => {
    try {
      setLoadingComments(true);
      const response = await AxiosClient.get('/comment/get_comments_by_post', {
        params: {
          token: localStorage.getItem('token') || sessionStorage.getItem('token') || '',
          post_id: post.ID,
        },
      });
      if (response.status === 200) setComments(response.data.data);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    } finally {
      setLoadingComments(false);
    }
  };

  const openReportModal = () => {
    setReportMessage('');
    setShowReportModal(true);
  };

  const closeReportModal = () => setShowReportModal(false);

  const submitReport = async () => {
    if (!reportMessage.trim()) return toast.info('Please enter a report message.');
    try {
      const response = await AxiosClient.post('/report/report_post', {
        post_id: post.ID,
        user_id: localStorage.getItem('token') || sessionStorage.getItem('token'),
        message: reportMessage,
      });

      if (response.status === 200) toast.success('Post reported successfully.');
      else toast.error('Failed to report post.');
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while reporting the post.');
    }
    setShowReportModal(false);
  };

  useEffect(() => {
    getComments();
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <>
      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <h2 className="text-lg font-semibold mb-4">Report Post</h2>
            <textarea
              value={reportMessage}
              onChange={(e) => setReportMessage(e.target.value)}
              className="w-full h-28 border rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Describe why you are reporting this post..."
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={closeReportModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={submitReport}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Card */}
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6 max-w-2xl mx-auto transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        <div className="p-4">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-4">
            <img
              src={post.User_Image || 'https://cdn-icons-png.flaticon.com/512/4537/4537019.png'}
              alt={post.User_Name}
              className="w-9 h-9 rounded-full object-cover"
            />
            <h3 className="font-medium text-gray-800 text-sm">{post.User_Name}</h3>
          </div>

          {/* Content */}
          <p className="text-gray-800 text-sm mb-4 leading-relaxed">{post.Content}</p>

          {/* Image */}
          {post.Image && (
            <div className="rounded-md overflow-hidden mb-4">
              <img
                src={post.Image || defaultImage}
                alt="Post"
                className="w-full h-64 object-cover transition-transform duration-500 hover:scale-[1.01]"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = defaultImage;
                }}
              />
            </div>
          )}

          {/* Actions */}
          <div className="mb-4">
            {isAuthenticated ? (
              <div className="flex items-center justify-between text-gray-500 text-sm">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLike}
                    className={`flex items-center ${isLiked ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-500`}
                  >
                    {likesCount} Likes
                  </button>

                  <button onClick={toggleComments} className="flex items-center hover:text-blue-500">
                    {comments.length} Comments
                  </button>

                  <button onClick={openReportModal} className="flex items-center text-red-500 hover:text-red-600">
                    Report
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-sm">
                {likesCount} Likes • {comments.length} Comments
              </div>
            )}
          </div>

          {/* Comments */}
          {showComments && (
            <div className="border-t pt-4">
              {loadingComments ? (
                <div className="space-y-3 animate-pulse">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex">
                      <div className="h-8 w-8 rounded-full bg-gray-200 mr-2"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <CommentList comments={comments} postId={post.ID} />
              )}
              {isAuthenticated && (
                <form onSubmit={handleAddComment} className="mt-4 flex">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 border rounded-l-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600">
                    Post
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
