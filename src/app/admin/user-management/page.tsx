"use client";

import UserProfileModal from "@/components/features/UserProfileModal";
import { userManagementService } from "@/services/admin/user-management";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

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
        const users = res.data || [];
        if (users) {
          setUsersList(users);
          setSkip(res.meta.skip);
          setLimit(res.meta.limit);
          setTotal(res.meta.total);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.message || "Internal Server Error");
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
        newStatus,
      );

      setUsersList((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id ? res.data : user,
        ),
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || "Internal Server Error");
      }
    } finally {
      setConfirmModalOpen(false);
      setSelectedUser(null);
    }
  };

  const handleViewMore = (id: string) => {
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
    <div
      className="
  p-8
  bg-gray-50 dark:bg-transparent
  text-gray-800 dark:text-white
  transition-colors duration-300
"
    >
      {/* Profile Modal */}
      {isOpen && (
        <UserProfileModal
          isOpen={isOpen}
          closeModal={setIsOpen}
          id={fetchUserId}
        />
      )}

      {/* Confirm Modal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div
            className="
        bg-white dark:bg-secondary
        border border-gray-200 dark:border-border-primary
        rounded-xl shadow-lg p-6 space-y-4
        w-[90%] max-w-md
      "
          >
            <p className="font-semibold text-gray-800 dark:text-white">
              {selectedUser?.status === "active"
                ? "Are you sure you want to block this user?"
                : "Are you sure you want to activate this user?"}
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="
            px-4 py-1.5 rounded-md text-sm
            bg-gray-200 dark:bg-gray-600
            text-gray-700 dark:text-text-primary
            hover:bg-gray-300 dark:hover:bg-gray-700 cursor-pointer
          "
                onClick={() => setConfirmModalOpen(false)}
              >
                Cancel
              </button>

              <button
                className="
            px-4 py-1.5 rounded-md text-sm
            bg-btn-primary text-white
            hover:bg-btn-primary-hover cursor-pointer
          "
                onClick={confirmToggleStatus}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div
        className="
    flex flex-col gap-4 p-5 rounded-xl mb-6
    bg-white dark:bg-secondary/20
    border border-gray-200 dark:border-border-primary
    shadow-sm dark:shadow-none
  "
      >
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
        </div>

        <p className="text-gray-500 dark:text-text-muted text-sm">
          Manage and monitor all registered users on the platform.
        </p>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
        md:min-w-80 px-3 py-2 rounded-lg
        bg-white dark:bg-secondary/40
        border border-gray-300 dark:border-border-primary
        text-gray-800 dark:text-white
        focus:outline-none focus:ring-1 focus:ring-btn-primary
      "
          />

          <select
            value={filterRole}
            onChange={(e) => {
              setSkip(0);
              setFilterRole(e.target.value);
            }}
            className="
        px-3 py-2 rounded-lg
        bg-white dark:bg-secondary/40
        border border-gray-300 dark:border-border-primary
        text-gray-800 dark:text-white
      "
          >
            <option className="bg-white dark:bg-secondary" value="all">
              All Roles
            </option>
            <option className="bg-white dark:bg-secondary" value="user">
              User
            </option>
            <option className="bg-white dark:bg-secondary" value="admin">
              Admin
            </option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setSkip(0);
            }}
            className="
        px-3 py-2 rounded-lg
        bg-white dark:bg-secondary/40
        border border-gray-300 dark:border-border-primary
        text-gray-800 dark:text-white
      "
          >
            <option className="bg-white dark:bg-secondary" value="all">
              All Status
            </option>
            <option className="bg-white dark:bg-secondary" value="active">
              Active
            </option>
            <option className="bg-white dark:bg-secondary" value="blocked">
              Blocked
            </option>
          </select>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="
        px-3 py-2 rounded-lg
        bg-white dark:bg-secondary/40
        border border-gray-300 dark:border-border-primary
        text-gray-800 dark:text-white
      "
          >
            <option className="bg-white dark:bg-secondary" value="newest">
              Newest First
            </option>
            <option className="bg-white dark:bg-secondary" value="oldest">
              Oldest First
            </option>
            <option className="bg-white dark:bg-secondary" value="name-asc">
              Name A → Z
            </option>
            <option className="bg-white dark:bg-secondary" value="name-desc">
              Name Z → A
            </option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div
        className="
    overflow-x-auto
    bg-white dark:bg-secondary/20
    border border-gray-200 dark:border-border-primary
    rounded-xl
    shadow-sm dark:shadow-none
  "
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 dark:text-gray-300">
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
                className="
            border-t border-gray-200 dark:border-border-primary
            hover:bg-gray-50 dark:hover:bg-secondary/30
            transition-colors
          "
              >
                <td className="p-3 font-medium text-gray-800 dark:text-white">
                  {user.name}
                </td>

                <td className="p-3">{user.email}</td>

                <td className="p-3">{user.role}</td>

                <td className="p-3">
                  <span
                    className={`flex justify-center px-2 py-1 text-xs font-semibold rounded-full w-[80px]
                ${
                  user.status === "active"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                    : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                }`}
                  >
                    {user.status[0].toUpperCase() + user.status.slice(1)}
                  </span>
                </td>

                <td className="p-3">
                  {user.createdAt
                    ? new Date(user.createdAt).toISOString().slice(0, 10)
                    : "N/A"}
                </td>

                <td className="p-3">
                  <button
                    onClick={() => handleToggleClick(user.id, user.status)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition cursor-pointer min-w-[80px]
                ${
                  user.status === "active"
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
                  >
                    {user.status === "active" ? "Block" : "Unblock"}
                  </button>
                </td>

                <td className="p-3">
                  <button
                    className="
                px-3 py-1 rounded-md text-xs font-medium
                bg-gray-100 dark:bg-slate-700
                text-gray-700 dark:text-gray-300
                hover:bg-gray-300 dark:hover:bg-slate-700
                transition cursor-pointer
              "
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
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>
          Showing {users.length} of {total} results (Page {skip / limit + 1} of{" "}
          {Math.ceil(total / limit)})
        </p>

        <div className="flex gap-2">
          <button
            disabled={skip === 0}
            onClick={handlePrevious}
            className="
        px-3 py-1 border rounded-md
        border-gray-300 dark:border-border-primary
        text-gray-700 dark:text-white
        hover:bg-gray-100 dark:hover:bg-secondary
      "
          >
            Previous
          </button>

          <button
            onClick={handleNext}
            className="
        px-3 py-1 border rounded-md
        border-gray-300 dark:border-border-primary
        text-gray-700 dark:text-white
        hover:bg-gray-100 dark:hover:bg-secondary
      "
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
