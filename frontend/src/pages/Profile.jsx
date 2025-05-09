import React from 'react';

export default function Profile() {
  // Example user data
  const user = {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    avatar: 'https://i.pravatar.cc/150?img=3',
    bio: 'Frontend developer. Loves React and open source.',
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
        <img
          src={user.avatar}
          alt="User avatar"
          className="w-24 h-24 rounded-full mb-4"
        />
        <h2 className="text-2xl font-semibold mb-2">{user.name}</h2>
        <p className="text-gray-600 mb-2">{user.email}</p>
        <p className="text-gray-700 text-center">{user.bio}</p>
      </div>
    </div>
  );
}
