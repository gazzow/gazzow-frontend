"use client";

import UserProfileModal from "@/components/features/UserProfileModal";
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

export default function UserManagement() {
  const [users, setUsersList] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [skip, setSkip] = useState<number>(0);
  const [limit, setLimit] = useState(6);
  const [total, setTotal] = useState(0);

  const [fetchUserId, setFetchUserId] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    status: string;
  } | null>(null);

  const getSortParams = (sortOption: string) => {
    switch (sortOption) {
      case "newest":
        return { sortField: "createdAt", sortOrder: "desc" };
      case "oldest":
        return { sortField: "createdAt", sortOrder: "asc" };
      case "name-asc":
        return { sortField: "name", sortOrder: "asc" };
      case "name-desc":
        return { sortField: "name", sortOrder: "desc" };
      default:
        return { sortField: "createdAt", sortOrder: "desc" };
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { sortField, sortOrder } = getSortParams(sortOption);

        const res = await userManagementService.getUsers({
          skip,
          limit,
          search: debouncedSearch || undefined,
          role: filterRole !== "all" ? filterRole : undefined,
          status: filterStatus !== "all" ? filterStatus : undefined,
          sortField,
          sortOrder,
        });
        console.log("Users list response data: ", res.data);
        const users = res.data || [];
        if (users) {
          setUsersList(users);
          setSkip(res.meta.skip);
          setLimit(res.meta.limit);
          setTotal(res.meta.total);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log("User management error: ", error);
        }
      }
    };
    fetchUsers();
  }, [skip, limit, debouncedSearch, filterRole, filterStatus, sortOption]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setSkip(0);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  const handleToggleClick = (id: string, status: string) => {
    setSelectedUser({ id, status });
    setConfirmModalOpen(true);
  };

  const confirmToggleStatus = async () => {
    if (!selectedUser) return;

    try {
      const newStatus = selectedUser.status === "active" ? "blocked" : "active";
      const res = await userManagementService.updateStatus(
        selectedUser.id,
        newStatus
      );
      console.log("Updated user response data: ", res.data);

      setUsersList((prevUsers) =>
        prevUsers.map((user) => (user.id === selectedUser.id ? res.data : user))
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("error in update status", error);
      }
    } finally {
      setConfirmModalOpen(false);
      setSelectedUser(null);
    }
  };

  const handleViewMore = (id: string) => {
    console.log("handle view more trigger");
    setIsOpen(true);
    setFetchUserId(id);
  };

  const handleNext = () => {
    const maxSkip = Math.floor((total - 1) / Number(limit)) * Number(limit);
    if (skip < maxSkip) {
      setSkip(Number(skip) + Number(limit));
    }
  };

  const handlePrevious = () => {
    setSkip((prev) => Math.max(prev - limit, 0));
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

      {confirmModalOpen && (
        <div className="fixed inset-0 bg-primary/60  flex justify-center items-center">
          <div className="bg-white dark:bg-secondary p-4 rounded shadow flex flex-col">
            <p className="font-bold text-black dark:text-white">
              {selectedUser?.status === "active"
                ? "Are you sure you want to block this user?"
                : "Are you sure you want to activate this user?"}
            </p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                className="bg-red-400 text-white py-1 px-4 rounded cursor-pointer"
                onClick={() => setConfirmModalOpen(false)}
              >
                No
              </button>
              <button
                className="bg-green-400 py-1 px-4 rounded text-gray cursor-pointer"
                onClick={confirmToggleStatus}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4  p-4 border border-border-primary rounded-lg mb-6">
        <div className="flex flex-col">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold text-white">User Management</h1>
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

          {/* Role Filter */}
          <select
            value={filterRole}
            onChange={(e) => {
              setSkip(0);
              setFilterRole(e.target.value);
            }}
            className="px-3 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setSkip(0);
            }}
            className="px-3 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
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
            {users.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-400">
                  No users found
                </td>
              </tr>
            )}
            {users?.map((user) => (
              <tr
                key={user.id}
                className="border border-border-primary hover:bg-secondary/30 transition"
              >
                <td className="p-3 font-medium text-text-primary">
                  {user.name}
                </td>
                <td className="p-3 text-text-primary">{user.email}</td>
                <td className="p-3 text-white">{user.role}</td>
                <td className="p-3">
                  <span
                    className={`flex justify-center px-2 py-1 text-xs font-semibold rounded-full w-[80px] ${
                      user.status === "active"
                        ? "bg-green-50 text-green-800"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {user.status[0].toUpperCase() + user.status.slice(1)}
                  </span>
                </td>

                <td className="p-3 text-white">
                  {new Date(user.createdAt).toISOString().slice(0, 10)}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleToggleClick(user.id, user.status)}
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
          Showing {users.length} of {total} results (Page {skip / limit + 1} of{" "}
          {Math.ceil(total / limit)})
        </p>
        <div className="flex gap-2">
          <button
            disabled={skip === 0}
            onClick={handlePrevious}
            className="px-3 py-1 border rounded-md text-white hover:bg-secondary"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="px-3 py-1 border rounded-md text-white hover:bg-secondary"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
