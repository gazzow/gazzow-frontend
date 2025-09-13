"use client";

import axiosUser from "@/lib/axios/axios-user";
import axios from "axios";
import { User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const router = useRouter();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosUser.get("/profile/me");
        console.log("user profile response: ", res);
        setUser(res.data.user);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log("profile page error: ", error);
          if (error.status === 403) {
            toast.error(error.response?.data.message);
            router.push("/login");
          }
        }
      }
    };
    fetchUser();
  }, []);

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
                sizes=""
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
      </div>
    </div>
  );
};

export default ProfilePage;
