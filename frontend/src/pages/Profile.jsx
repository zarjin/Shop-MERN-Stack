import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';

export default function Profile() {
  const { user } = useContext(UserContext);
  console.log(user);

  if (!user) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
        <img
          src={user.profileImage || '/default-avatar.png'}
          alt="User avatar"
          className="w-24 h-24 rounded-full mb-4"
        />
        <h2 className="text-2xl font-semibold mb-2">{user.fullName}</h2>
        <p className="text-gray-600 mb-2">{user.email}</p>
      </div>
    </div>
  );
}
