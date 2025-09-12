import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SocietyHeader from '../Components/SocietyHeader';
import AxiosClient from '../../../config/axios';
import MembersList from './Components/MembersList';
import MembersStats from './Components/MembersStats';

export default function SocietyMembers() {
  const { id } = useParams();
  const [members, setMembers] = useState([]);
  const [mounted, setMounted] = useState(false);

  const getAllSocietyMembers = async () => {
    try {
      const response = await AxiosClient.get("/societies/get_all_members", {
        params: { society_id: id }
      });

      if (response.status === 200) {
        setMembers(response.data.data);
      } else {
        console.error("Failed to fetch members", response);
      }
    } catch (error) {
      console.error("Error fetching society members:", error);
    }
  };

  useEffect(() => {
    if (id) getAllSocietyMembers();
    const idAnim = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(idAnim);
  }, [id]);

  return (
    <>
      <SocietyHeader societyId={id || '1'} />
      <main className={`min-h-screen bg-gray-50 py-8 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        <div className="max-w-6xl mx-auto px-4">
          <MembersStats members={members} />
          <MembersList id={id} members={members} setMembers={setMembers} />
        </div>
      </main>
    </>
  );
}
