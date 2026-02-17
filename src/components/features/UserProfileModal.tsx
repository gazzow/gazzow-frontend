"use client";

import { userManagementService } from "@/services/admin/user-management";
import axios from "axios";
import { User, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface IUserProfileModalProp {
  id: string;
  isOpen: boolean;
  closeModal(val: boolean): void;
}

const UserProfileModal = ({
  id,
  isOpen,
  closeModal,
}: IUserProfileModalProp) => {
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await userManagementService.getSingleUser(id);
        setUser(res.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.message || "Internal Server Error");
        }
      }
    };

    fetchUser();
  }, [id]);

  type User = {
    id: string;
    name: string;
    email: string;
    role: "user" | "admin";
    status: "active" | "blocked";
    bio: string;
    techStacks: string[];
    learningGoals: string[];
    experience: string;
    developerRole: string;
    imageUrl: string;
    createdAt: string;
  };

  const [user, setUser] = useState<User | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      {/* Modal Card */}
      <div
        className="
        relative max-w-4xl w-full mx-4
        bg-white dark:bg-secondary
        border border-gray-200 dark:border-border-primary
        rounded-2xl shadow-xl dark:shadow-none
        p-8 space-y-8
        transition-colors duration-300
      "
      >
        {/* Close */}
        <button
          onClick={() => closeModal(false)}
          className="
          absolute right-6 top-5
          text-gray-500 dark:text-gray-400
          hover:text-gray-800 dark:hover:text-white
          transition cursor-pointer
        "
        >
          <X />
        </button>

        {!user ? (
          <p className="text-center text-gray-400 dark:text-gray-500">
            Loading user...
          </p>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600">
                {user.imageUrl ? (
                  <Image
                    fill
                    src={user.imageUrl}
                    alt={user.name}
                    className="object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                    <User
                      className="text-gray-400 dark:text-gray-300"
                      size={66}
                    />
                  </div>
                )}
              </div>

              {/* Info */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.name}
                </h1>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>

                {user.developerRole && (
                  <p className="mt-1 text-gray-700 dark:text-gray-300 font-medium">
                    {user.developerRole}
                  </p>
                )}
              </div>
            </div>

            {/* Bio */}
            {user.bio && (
              <p className="text-gray-700 dark:text-gray-300">{user.bio}</p>
            )}

            {/* Experience */}
            {user.experience && (
              <div>
                <h2 className="font-semibold text-lg text-gray-800 dark:text-white">
                  Experience
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  {user.experience}
                </p>
              </div>
            )}

            {/* Skills */}
            {user.techStacks?.length > 0 && (
              <div>
                <h2 className="font-semibold text-lg mb-2 text-gray-800 dark:text-white">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {user.techStacks.map((stack: string) => (
                    <span
                      key={stack}
                      className="
                      bg-gray-100 dark:bg-gray-700
                      text-gray-700 dark:text-gray-200
                      px-3 py-1 rounded-full text-sm
                      border border-gray-200 dark:border-gray-600
                    "
                    >
                      {stack}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Learning Goals */}
            {user.learningGoals?.length > 0 && (
              <div>
                <h2 className="font-semibold text-lg mb-2 text-gray-800 dark:text-white">
                  Learning Goals
                </h2>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                  {user.learningGoals.map((goal: string, idx: number) => (
                    <li key={idx}>{goal}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfileModal;
