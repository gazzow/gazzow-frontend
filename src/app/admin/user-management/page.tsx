"use client";

import UserProfileModal from "@/components/features/user-profile-modal";
import axiosAdmin from "@/lib/axios/axios-admin";
import axios from "axios";
import { useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "blocked";
  createdAt: string;
};

type UserStatus = "active" | "blocked";

export default function UserManagement() {
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosAdmin.get("/users");
        console.log("Users list response: ", res);
        const users = res.data.users || [];
        if (users) {
          setUsersList(users);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log("User management error: ", error);
        }
      }
    };

    fetchUsers();
  }, []);

  const [users, setUsersList] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleStatus = async (id: string, status: UserStatus) => {
    try {
      const newStatus = status === "active" ? "blocked" : "active";
      const res = await axiosAdmin.patch(`/users/${id}/status`, {
        status: newStatus,
      });

      console.log("Updated user response: ", res.data);
      setUsersList((prevUsers) =>
        prevUsers.map((user) => (user.id === id ? res.data.user : user))
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("error in update status", error);
      }
    }
  };

  return (
    <div className="p-8">
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="rounded-2xl shadow-lg w-full p-8 space-y-8 relative">
            <UserProfileModal closeModal={setIsOpen} />
          </div>
        </div>
      )}
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
              <th className="p-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
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
                    className={`flex justify-center px-2 py-1 text-xs font-semibold rounded-full w-[80px] ${
                      user.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.status[0].toUpperCase() + user.status.slice(1)}
                  </span>
                </td>

                <td className="p-3">
                  {new Date(user.createdAt).toISOString().slice(0, 10)}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => toggleStatus(user.id, user.status)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition cursor-pointer min-w-[80px] ${
                      user.status === "active"
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {user.status === "active" ? "Block" : "Unblock"}
                  </button>
                </td>
                <td className="p-3">
                  <button
                    className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 text-xs font-medium hover:bg-gray-300 transition cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <p>
          Showing {users ? users.length : 0} of {users ? users.length : 0}{" "}
          results
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
