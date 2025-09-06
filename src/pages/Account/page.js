import { useState, useEffect } from 'react';
import AxiosClient from '../../config/axios';
import ProfileHeader from "./Components/ProfileHeader";
import Tabs from "./Components/Tabs";

export default function Account() {
  const [profileData, setProfileData] = useState(null);

  const getUserProfileInfo = async () => {
    try {
      const response = await AxiosClient.get("/users/get_user_profile_info", {
        params: {
          token: localStorage.getItem("token") || sessionStorage.getItem("token")
        }
      });

      if (response.status === 200) {
        setProfileData(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch profile info:", error);
    }
  };

  useEffect(() => {
    getUserProfileInfo();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <ProfileHeader profileData={profileData} />
        <Tabs
          profileData={profileData}
          setProfileData={setProfileData}
          getUserProfileInfo={getUserProfileInfo}
        />
      </div>
    </main>
  );
}
