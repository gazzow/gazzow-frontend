"use client";

import { useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: "User" | "Admin";
  status: "Active" | "Suspended";
  joinDate: string;
};

const initialUsers: User[] = [
  {
    id: 1,
    name: "Sarah Chen",
    email: "sarahchen@email.com",
    role: "User",
    status: "Active",
    joinDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Mike Rodriguez",
    email: "mike.rodriguez@email.com",
    role: "User",
    status: "Active",
    joinDate: "2024-01-15",
  },
  {
    id: 3,
    name: "Anna Thompson",
    email: "anna.thompson@email.com",
    role: "User",
    status: "Suspended",
    joinDate: "2024-01-15",
  },
  {
    id: 4,
    name: "David Kim",
    email: "david.kim@email.com",
    role: "User",
    status: "Active",
    joinDate: "2024-01-15",
  },
  {
    id: 5,
    name: "Emma Wilson",
    email: "emma.wilson@email.com",
    role: "User",
    status: "Active",
    joinDate: "2024-01-15",
  },
 
];

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(initialUsers);

  const toggleStatus = (id: number) => {
    setUsers(
      users.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "Active" ? "Suspended" : "Active",
            }
          : user
      )
    );
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex p-4 items-center justify-between mb-6 border border-border-primary rounded-lg">
        <h1 className="text-2xl font-bold text-white">User Management</h1>
        {/* <button className="px-4 py-2 bg-gray-200 text-black text-md font-semibold rounded-md transition">
          Export Data
        </button> */}
      </div>

      {/* Table Wrapper */}
      <div className="overflow-x-auto shadow rounded-lg border border-border-primary">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-left text-text-primary">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Join Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border border-border-primary hover:bg-secondary/30 transition"
              >
                <td className="p-3 font-medium text-text-primary">
                  {user.name}
                </td>
                <td className="p-3 text-text-primary">{user.email}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="p-3">{user.joinDate}</td>
                <td className="p-3 flex">
                  <button
                    onClick={() => toggleStatus(user.id)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                      user.status === "Active"
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {user.status === "Active" ? "Block" : "Unblock"}
                  </button>
                </td>
                <td>
                  <button className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 text-xs font-medium hover:bg-gray-300 transition cursor-pointer">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <p>
          Showing {users.length} of {users.length} results
        </p>
        <div className="flex gap-2">
          <button className="px-3 py-1 border rounded-md text-gray-600 hover:bg-gray-100">
            Previous
          </button>
          <button className="px-3 py-1 border rounded-md text-gray-600 hover:bg-gray-100">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
