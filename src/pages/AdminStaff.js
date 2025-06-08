import React, { useState } from 'react';

const AdminStaff = () => {
  const [staff, setStaff] = useState([{ id: 1, name: 'Staff1', email: 'staff1@example.com' }]);
  const [newStaff, setNewStaff] = useState({ name: '', email: '' });

  const handleAddStaff = (e) => {
    e.preventDefault();
    setStaff([...staff, { id: Date.now(), ...newStaff }]);
    setNewStaff({ name: '', email: '' });
  };

  const handleUpdateStaff = (id, updatedStaff) => {
    setStaff(staff.map((s) => (s.id === id ? { ...s, ...updatedStaff } : s)));
  };

  const handleDeleteStaff = (id) => {
    setStaff(staff.filter((s) => s.id !== id));
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Staff</h1>
      <form onSubmit={handleAddStaff} className="mb-4">
        <input
          type="text"
          placeholder="Staff Name"
          value={newStaff.name}
          onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
          className="w-full p-3 border rounded-md mb-2"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newStaff.email}
          onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
          className="w-full p-3 border rounded-md mb-2"
          required
        />
        <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
          Add Staff
        </button>
      </form>
      <div>
        {staff.map((staffMember) => (
          <div key={staffMember.id} className="flex items-center justify-between border-b py-4">
            <span>{staffMember.name} - {staffMember.email}</span>
            <div>
              <button
                onClick={() => handleUpdateStaff(staffMember.id, { email: prompt('New Email?') })}
                className="mr-2 text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteStaff(staffMember.id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminStaff;