import React, { useEffect, useState } from "react";
import AxiosClient from "../../../../config/axios";
import ChangeRole from "../Modals/ChangeRole";
import Search from "./Search";
import { useAuth } from '../../../../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";

export default function MembersList({ id, members, setMembers }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const { isAuthenticated } = useAuth();
  const [selectedMember, setSelectedMember] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newRole, setNewRole] = useState('');

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.Name.toLowerCase().includes(searchTerm.toLowerCase()) || member.Email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.Role === roleFilter;
    return matchesSearch && matchesRole;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.Name.localeCompare(b.Name);
      case 'role':
        return a.Role.localeCompare(b.Role);
      default:
        return 0;
    }
  });

  const removeMember = async (userId) => {
    try {
      const response = await AxiosClient.delete("/societies/remove_member", {
        params: {
          society_id: id,
          user_id: userId
        }
      });

      if (response.status === 204) {
        toast.success("Member removed");
        setMembers(prev => prev.filter(member => member.ID !== userId));
      }
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Failed to remove member");
    }
  };

  const getAllSocietyMembers = async () => {
    try {
      const response = await AxiosClient.get("/societies/get_all_members", {
        params: { society_id: id }
      });
      if (response.status === 200) {
        setMembers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'moderator':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    getAllSocietyMembers();
  }, []);

  return (
    <>
      <Search
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Members ({filteredMembers.length})
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredMembers.map((member) => (
            <div key={member.ID} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={member.Photo || 'https://cdn-icons-png.flaticon.com/512/4537/4537019.png'}
                    alt={member.Name}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.Name)}&background=3B82F6&color=fff`; }}
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{member.Name}</h3>
                    <p className="text-sm text-gray-600">{member.Email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getRoleBadgeColor(member.Role)}`}>
                    {member.Role}
                  </span>

                  <div className="flex space-x-2">
                    <Link
                      to={`/users/${member.ID}`}
                      className="inline-flex items-center px-3 py-1.5 border border-blue-200 text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-colors text-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a5 5 0 100 10A5 5 0 0010 2z"/><path fillRule="evenodd" d="M.458 17.042A9.956 9.956 0 0110 12c3.042 0 5.79 1.356 7.542 3.542A1 1 0 0116.8 17H3.2a1 1 0 01-.742-1.958z" clipRule="evenodd"/></svg>
                      View Profile
                    </Link>
                    {member.Role !== 'admin' && isAuthenticated && (
                      <>
                        <button
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                          onClick={() => {
                            setSelectedMember(member);
                            setNewRole(member.Role);
                            setShowModal(true);
                          }}
                        >
                          Change Role
                        </button>
                        <button
                          onClick={() => removeMember(member.ID)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.196-2.121M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.196-2.121M7 20v-2m5-8a3 3 0 110-6 3 3 0 010 6z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No members found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {showModal && selectedMember && (
          <ChangeRole
            selectedMember={selectedMember}
            newRole={newRole}
            setNewRole={setNewRole}
            society_id={id}
            getAllSocietyMembers={getAllSocietyMembers}
            setShowModal={setShowModal}
          />
        )}
      </div>
    </>
  );
}
