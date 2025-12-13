"use client";

import StripeConnectCard from "@/components/features/StripeConnectCard";
import { USER_ROUTES } from "@/constants/routes/user-routes";
import { userService } from "@/services/user/user-service";
import axios from "axios";
import { Pen, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const ProfilePage = () => {
  const fetchUser = useCallback(async () => {
    try {
      const res = await userService.getUser();
      setUser(res.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("profile page error: ", error);
      }
    }
  }, []);

  
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

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

  return (
    <div className="min-h-screen mt-16 bg-primary text-white p-6 flex justify-center">
      <div className="max-w-4xl w-full bg-secondary/30 rounded-2xl shadow-lg p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-600">
            {user?.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt={user.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-700">
                <User size={66}></User>
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user?.name}</h1>
            <p className="text-sm text-gray-400">{user?.email}</p>
            {user?.developerRole && (
              <p className="mt-1 text-gray-300 font-medium">
                {user.developerRole}
              </p>
            )}
          </div>
          <div className="ml-auto">
            <Link href={USER_ROUTES.EDIT_PROFILE}>
              <button className="flex items-center gap-2 py-2 px-4 bg-btn-primary hover:bg-btn-primary-hover rounded-lg cursor-pointer">
                <Pen size={14} /> <span>Edit</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Bio */}
        {user?.bio && <p className="text-gray-300">{user?.bio}</p>}

        {/* Experience */}
        {user?.experience && (
          <div>
            <h2 className="font-semibold text-lg">Experience</h2>
            <p className="text-gray-300 mt-1">{user?.experience}</p>
          </div>
        )}

        {/* Tech Stacks */}
        {user?.techStacks && user?.techStacks.length > 0 && (
          <div>
            <h2 className="font-semibold text-lg mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {user?.techStacks.map((stack) => (
                <span
                  key={stack}
                  className="bg-gray-700 px-3 py-1 rounded-full text-sm text-gray-200"
                >
                  {stack}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Learning Goals */}
        {user?.learningGoals && user?.learningGoals.length > 0 && (
          <div>
            <h2 className="font-semibold text-lg mb-2">Learning Goals</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              {user?.learningGoals.map((goal, idx) => (
                <li key={idx}>{goal}</li>
              ))}
            </ul>
          </div>
        )}

        <StripeConnectCard />
      </div>
    </div>
  );
};

export default ProfilePage;
