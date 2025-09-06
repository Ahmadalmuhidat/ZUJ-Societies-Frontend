export default function ProfileHeader({ profileData }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
      <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
      <div className="relative px-6 pb-6">
        <div className="flex items-end -mt-16 mb-4">
          <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg overflow-hidden">
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4537/4537019.png"
                alt="Profile"
                className="w-16 h-16 text-gray-600"
              />
            </div>
          </div>
          <div className="ml-6 pb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              {profileData?.Name}
            </h1>
            <p className="text-gray-600">{profileData?.Email}</p>
            {/*
            <p className="text-sm text-gray-500 mt-1">
              Member since {profileData?.Create_Date && new Date(profileData.Create_Date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long'
              })}
            </p>
            */}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{profileData?.Society_Count}</div>
            <div className="text-sm text-gray-600">Societies</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{profileData?.Event_Count}</div>
            <div className="text-sm text-gray-600">Events</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{profileData?.Post_Count}</div>
            <div className="text-sm text-gray-600">Posts</div>
          </div>
        </div>
      </div>
    </div>
  );
}
