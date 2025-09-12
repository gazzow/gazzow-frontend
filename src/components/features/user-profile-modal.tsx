"use client";

import { User, X } from "lucide-react";
import { useEffect, useState } from "react";

interface IUserProfileModalProp {
  closeModal(val: boolean): void;
}

const UserProfileModal = ({ closeModal }: IUserProfileModalProp) => {
  const initialUser = {
    id: "68c3a7362bf040493e726969",
    name: "vishnu vs",
    email: "getvishnu@gmail.com",
    role: "user",
    status: "active",
    bio: "I am a software engineer",
    techStacks: ["React", "Node.js"],
    learningGoals: ["Improve backend skills", "Master DevOps"],
    experience: "Beginner",
    developerRole: "full stack developer",
    imageUrl: "https://cdn.app/avatar.png",
    createdAt: "2025-09-12T04:53:10.078Z",
  };

  const [user, setUser] = useState(initialUser);

  useEffect(() => {}, []);

  return (
    <div className="text-white p-6 flex justify-center">
      <div className="relative max-w-4xl w-full bg-secondary rounded-2xl shadow-lg p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-600">
            {user.imageUrl ? (
              <img
                src={"https://picsum.photos/100/200"}
                alt={user.name}
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-700">
                <User size={66}></User>
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-sm text-gray-400">{user.email}</p>
            {user.developerRole && (
              <p className="mt-1 text-gray-300 font-medium">
                {user.developerRole}
              </p>
            )}
          </div>
          {/* Close button */}
          <button
            onClick={() => closeModal(false)}
            className="absolute right-8 top-5 text-gray-300 hover:text-white cursor-pointer"
          >
            <X />
          </button>
        </div>

        {/* Bio */}
        {user.bio && <p className="text-gray-300">{user.bio}</p>}

        {/* Experience */}
        {user.experience && (
          <div>
            <h2 className="font-semibold text-lg">Experience</h2>
            <p className="text-gray-300 mt-1">{user.experience}</p>
          </div>
        )}

        {/* Tech Stacks */}
        {user.techStacks && user.techStacks.length > 0 && (
          <div>
            <h2 className="font-semibold text-lg mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {user.techStacks.map((stack) => (
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
        {user.learningGoals && user.learningGoals.length > 0 && (
          <div>
            <h2 className="font-semibold text-lg mb-2">Learning Goals</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              {user.learningGoals.map((goal, idx) => (
                <li key={idx}>{goal}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileModal;
