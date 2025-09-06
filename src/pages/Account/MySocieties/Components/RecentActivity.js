// import { useState } from 'react';

// export default function RecentActivity() {
//   const [recentActivity, setRecentActivity] = useState([]);

//   return (
//     <div className="mb-12">
//       <h2 className="text-2xl font-semibold text-gray-800 mb-6">Recent Activity</h2>
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         {recentActivity.map((activity, index) => (
//           <div key={activity.id} className={`p-6 ${index !== recentActivity.length - 1 ? 'border-b border-gray-200' : ''}`}>
//             <div className="flex items-start">
//               <div className={`p-2 rounded-lg mr-4 ${activity.type === 'event' ? 'bg-purple-100' :
//                 activity.type === 'post' ? 'bg-blue-100' : 'bg-green-100'
//                 }`}>
//                 {activity.type === 'event' && (
//                   <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                   </svg>
//                 )}
//                 {activity.type === 'post' && (
//                   <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//                   </svg>
//                 )}
//                 {activity.type === 'member' && (
//                   <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                   </svg>
//                 )}
//               </div>
//               <div className="flex-1">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h3 className="font-semibold text-gray-800">{activity.title}</h3>
//                     <p className="text-sm text-gray-600 mb-1">{activity.society}</p>
//                     <p className="text-gray-600">{activity.description}</p>
//                   </div>
//                   <span className="text-sm text-gray-500">{activity.date}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }