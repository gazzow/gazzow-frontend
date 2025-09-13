"use client";

import { useAppSelector } from "@/store/store";
import { User } from "lucide-react";
import Image from "next/image";

const ProfilePage = () => {
  const {
    name,
    email,
    imageUrl,
    bio,
    developerRole,
    experience,
    techStacks,
    learningGoals,
  } = useAppSelector((state) => state.user);
  return (
    <div className="min-h-screen mt-16 bg-primary text-white p-6 flex justify-center">
      <div className="max-w-4xl w-full bg-secondary/30 rounded-2xl shadow-lg p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-600">
            {imageUrl ? (
              <img src={imageUrl} alt={name} className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-700">
                <User size={66}></User>
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{name}</h1>
            <p className="text-sm text-gray-400">{email}</p>
            {developerRole && (
              <p className="mt-1 text-gray-300 font-medium">{developerRole}</p>
            )}
          </div>
        </div>

        {/* Bio */}
        {bio && <p className="text-gray-300">{bio}</p>}

        {/* Experience */}
        {experience && (
          <div>
            <h2 className="font-semibold text-lg">Experience</h2>
            <p className="text-gray-300 mt-1">{experience}</p>
          </div>
        )}

        {/* Tech Stacks */}
        {techStacks && techStacks.length > 0 && (
          <div>
            <h2 className="font-semibold text-lg mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {techStacks.map((stack) => (
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
        {learningGoals && learningGoals.length > 0 && (
          <div>
            <h2 className="font-semibold text-lg mb-2">Learning Goals</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              {learningGoals.map((goal, idx) => (
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
