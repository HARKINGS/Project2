import React from 'react';

const Profile = () => {
  const username = localStorage.getItem('username');
  const userRole = localStorage.getItem('userRole');

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Profile</h1>
      {username ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <p><strong>Username:</strong> {username}</p>
          <p><strong>Role:</strong> {userRole}</p>
          <p><strong>Status:</strong> Logged in</p>
        </div>
      ) : (
        <p className="text-gray-500">Please log in to view your profile.</p>
      )}
    </div>
  );
};

export default Profile;