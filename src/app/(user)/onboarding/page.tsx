"use client";

import { useState } from "react";
import { Camera, Loader, Plus, Save, X } from "lucide-react";
import { uploadImageToCloudinary } from "@/lib/cloudinary/config";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/store/store";
import axiosUser from "@/lib/axios/axios-user";
import axios from "axios";
import { useRouter } from "next/navigation";
import { setUserProfile } from "@/store/slices/userSlice";
import Image from "next/image";

const roles = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Software Engineer",
  "Mobile Developer",
  "Other",
];

const experiences = ["Beginner", "Intermediate", "Expert"];

const techOptions = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "MongoDB",
  "PostgreSQL",
  "TailwindCSS",
];

const learningGoals = [
  "Improve system design skills",
  "Learn cloud technologies",
  "Master modern frameworks",
  "Get better at Devops",
];

export default function ProfileSetup() {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const [profileImage, setProfileImage] = useState<string | null>(null); // preview
  const [profileUrl, setProfileUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedExperience, setSelectedExperience] = useState<string>("");
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [customTech, setCustomTech] = useState<string>("");
  const [selectedGoal, setSelectedGoal] = useState<string[]>([]);
  const [customGoal, setCustomGoal] = useState<string>("");
  const [bio, setBio] = useState<string>("");

  const { name } = useAppSelector((state) => state.user);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      // Validate image type
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Please select an image smaller than 5MB");
        return;
      }

      // Generate preview
      setProfileImage(URL.createObjectURL(file));

      // upload file to cloudinary
      setIsUploading(true);
      const imageUrl = await uploadImageToCloudinary(file);
      setProfileUrl(imageUrl);
      setIsUploading(false);
      toast.success("Image uploaded!");
    }
  };

  const handleTechToggle = (tech: string) => {
    if (selectedTech.includes(tech)) {
      setSelectedTech(selectedTech.filter((t) => t !== tech));
    } else {
      setSelectedTech([...selectedTech, tech]);
    }
  };

  const handleAddCustomTech = () => {
    if (customTech.trim() && !selectedTech.includes(customTech)) {
      setSelectedTech([...selectedTech, customTech.trim()]);
      setCustomTech("");
    }
  };

  const handleGoalToggle = (goal: string) => {
    if (selectedGoal.includes(goal)) {
      setSelectedGoal(selectedGoal.filter((g) => g !== goal));
    } else {
      setSelectedGoal([...selectedGoal, goal]);
    }
  };

  const handleAddCustomGoal = () => {
    if (customGoal.trim() && !selectedGoal.includes(customGoal)) {
      setSelectedGoal([...selectedGoal, customGoal.trim()]);
      setCustomGoal("");
    }
  };

  const handleSubmit = async () => {
    const payload = {
      bio,
      developerRole: selectedRole,
      experience: selectedExperience,
      techStacks: selectedTech,
      learningGoals: selectedGoal,
      imageUrl: profileUrl,
    };
    console.log("Submitting profile: ", payload);

    try {
      const res = await axiosUser.put("/profile/setup", payload);
      console.log("response data in onboarding: ", res.data);
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setUserProfile(res.data.user));
        router.replace("/home");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("onboarding error: ", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4 bg-primary">
      <div className="w-full max-w-2xl rounded-2xl shadow-2xl border bg-secondary/30 border-gray-700 overflow-hidden bg-gray-850">
        {/* Header with profile image upload */}
        <div className="relative  py-6">
          <div className="absolute"></div>
          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full  bg-gray-800 overflow-hidden flex items-center justify-center">
                {profileImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src="/images/default-profile.jpg"
                    alt="profile default image"
                    fill
                    className="rounded-full object-fit"
                  />
                )}
              </div>
              <label
                htmlFor="profile-upload"
                className="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full cursor-pointer transition-all shadow-lg"
              >
                {isUploading ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <Camera size={16} />
                )}
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            <h2 className="text-2xl font-bold text-white">
              Welcome! Lets Setup Your Profile
            </h2>
            <p className="text-sm text-gray-300 mt-1">
              Complete your profile to get started
            </p>
          </div>
        </div>

        <div className="p-8">
          <div className="space-y-6">
            {/* Full Name */}
            <div className="group">
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Full Name
              </label>
              <div className="relative">
                <input
                  value={name}
                  disabled
                  className="text-white w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-60 transition-all"
                />
                <span className="absolute right-3 top-3 text-gray-400">🔒</span>
              </div>
            </div>

            {/* Short Bio */}
            <div className="group">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  Short Bio
                </label>
                <span className="text-xs text-gray-500">{bio.length}/200</span>
              </div>
              <textarea
                placeholder="Tell us about your coding journey..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full text-white p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                rows={3}
                maxLength={200}
              />
            </div>

            <div className="flex justify-between gap-4">
              {/* Role */}
              <div className="group flex-1">
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Role
                </label>
                <div className="relative">
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full text-white p-3 rounded-lg bg-gray-800 border border-gray-700 appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                  >
                    <option value="">Select your role</option>
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div className="group flex-1">
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Experience Level
                </label>
                <div className="relative">
                  <select
                    value={selectedExperience}
                    onChange={(e) => setSelectedExperience(e.target.value)}
                    className="w-full text-white p-3 rounded-lg bg-gray-800 border border-gray-700 appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                  >
                    <option value="">Select your experience</option>
                    {experiences.map((experience) => (
                      <option key={experience} value={experience}>
                        {experience}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Tech Stacks */}
            <div className="group">
              <label className="block text-gray-300 mb-1 text-md font-medium">
                Tech Stacks
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Select your technologies or add custom ones
              </p>

              <div className="flex flex-wrap gap-2 mb-3">
                {techOptions.map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => handleTechToggle(tech)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all transform hover:scale-105 cursor-pointer ${
                      selectedTech.includes(tech)
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent shadow-md"
                        : "bg-gray-800 border-gray-700 text-gray-300 hover:border-blue-400"
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>

              {/* Selected Tech Chips */}
              {selectedTech.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">
                    Selected technologies:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTech.map((tech) => (
                      <span
                        key={tech}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-sm text-white shadow-md transition-all hover:from-blue-700 hover:to-purple-700 cursor-pointer"
                      >
                        {tech}
                        <X
                          size={14}
                          className="cursor-pointer hover:text-blue-200 transition-colors"
                          onClick={() => handleTechToggle(tech)}
                        />
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Tech Input */}
              <div className="flex gap-2 mt-4">
                <div className="relative flex-grow">
                  <input
                    placeholder="Add custom tech"
                    value={customTech}
                    onChange={(e) => setCustomTech(e.target.value)}
                    className="w-full text-white p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  {customTech && (
                    <button
                      type="button"
                      onClick={() => setCustomTech("")}
                      className="absolute right-5 top-4 text-gray-400 hover:text-white"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleAddCustomTech}
                  disabled={!customTech.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center"
                >
                  <span>Add</span>
                  <Plus size={16} className="ml-1" />
                </button>
              </div>
            </div>

            {/* Learning Goal */}
            <div className="group">
              <label className="block text-gray-300 mb-1 text-md font-medium">
                Learning Goal
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Select your learning goal or add custom ones
              </p>

              <div className="flex flex-wrap gap-2 mb-3">
                {learningGoals.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => handleGoalToggle(goal)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all transform hover:scale-105 cursor-pointer ${
                      selectedGoal.includes(goal)
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent shadow-md"
                        : "bg-gray-800 border-gray-700 text-gray-300 hover:border-blue-400"
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>

              {/* Selected Goals Chips */}
              {selectedGoal.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Selected Goals:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedGoal.map((goal) => (
                      <span
                        key={goal}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-sm text-white shadow-md transition-all hover:from-blue-700 hover:to-purple-700 cursor-pointer"
                      >
                        {goal}
                        <X
                          size={14}
                          className="cursor-pointer hover:text-blue-200 transition-colors"
                          onClick={() => handleGoalToggle(goal)}
                        />
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Tech Input */}
              <div className="flex gap-2 mt-4">
                <div className="relative flex-grow">
                  <input
                    placeholder="Add custom goal"
                    value={customGoal}
                    onChange={(e) => setCustomGoal(e.target.value)}
                    className="w-full text-white p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  {customGoal && (
                    <button
                      type="button"
                      onClick={() => setCustomGoal("")}
                      className="absolute right-5 top-4 text-gray-400 hover:text-white"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleAddCustomGoal}
                  disabled={!customGoal.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center"
                >
                  <span>Add</span>
                  <Plus size={16} className="ml-1" />
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-btn-primary cursor-pointer  text-white font-medium py-3 px-4 rounded-xl text-lg transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              <Save className="mr-2" size={20} />
              Finish Setup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
