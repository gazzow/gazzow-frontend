"use client";

import UserProfileModal from "@/components/features/user-profile-modal";
import { userManagementService } from "@/services/admin/user-management";
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

type Pagination = {
  total: number;
  skip: number;
  limit: number;
};

export default function UserManagement() {
  const [users, setUsersList] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    skip: 0,
    limit: 5,
  });
  const [fetchUserId, setFetchUserId] = useState("");
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [sortOption, setSortOption] = useState("newest");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await userManagementService.getUsers(
          pagination.skip,
          pagination.limit
        );
        console.log("Users list response data: ", res);
        const users = res.data || [];
        if (users) {
          setUsersList(users);
          setPagination(res.pagination);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log("User management error: ", error);
        }
      }
    };

    fetchUsers();
  }, []);

  const toggleStatus = async (id: string, status: UserStatus) => {
    try {
      const newStatus = status === "active" ? "blocked" : "active";
      const data = await userManagementService.updateStatus(id, newStatus);
      console.log("Updated user response data: ", data);

      setUsersList((prevUsers) =>
        prevUsers.map((user) => (user.id === id ? data.user : user))
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("error in update status", error);
      }
    }
  };

  const handleViewMore = (id: string) => {
    console.log("handle view more trigger");
    setIsOpen(true);
    setFetchUserId(id);
  };

  return (
    <div className="p-8">
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="rounded-2xl shadow-lg w-full p-8 space-y-8 relative">
            <UserProfileModal closeModal={setIsOpen} id={fetchUserId} />
          </div>
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col gap-4  p-4 border border-border-primary rounded-lg mb-6">
        <div className="flex flex-col">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold text-white">User Management</h1>
            <button className="px-4 py-2 bg-gray-200 text-black text-md font-semibold rounded-md transition"> Export Data </button>
          </div>
          <p className="text-text-muted text-sm">
            Manage and monitor all registered users on the platform.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full md:w-auto">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className=" md:min-w-80 px-3 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />

          {/* Filter */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          {/* Status */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          {/* Sort */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name-asc">Name A → Z</option>
            <option value="name-desc">Name Z → A</option>
          </select>
        </div>
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
                        ? "bg-green-100 text-green-900"
                        : "bg-red-100 text-red-900"
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
                    onClick={() => handleViewMore(user.id)}
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
          Showing {pagination.limit ?? 5} of {pagination.total} results
        </p>
        <div className="flex gap-2">
          <button className="px-3 py-1 border rounded-md text-white hover:bg-gray-600">
            Previous
          </button>
          <button className="px-3 py-1 border rounded-md text-white hover:bg-gray-600">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
