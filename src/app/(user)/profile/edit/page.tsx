"use client";

import { useEffect, useState } from "react";
import { Camera, Loader, Save } from "lucide-react";
import { uploadImageToCloudinary } from "@/lib/cloudinary/config";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/store/store";
import api from "@/lib/axios/api";
import axios from "axios";
import { useRouter } from "next/navigation";
import { setOnboardingStatus, setUserProfile } from "@/store/slices/userSlice";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userService } from "@/services/user/user-service";
import {
  ProfileUpdateInput,
  profileUpdateSchema,
} from "@/validators/profile-update";
import Link from "next/link";
import { LoadingSpinner } from "@/components/layout/LoadingSpinner";

// Move type definition outside component
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

export default function EditProfile() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<User | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  // RHF setup with proper default values
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: "",
      bio: "",
      developerRole: "",
      experience: "",
      techStacks: [],
      learningGoals: [],
      imageUrl: "",
    },
  });

  // Watchers with fallback values
  const techStacks = watch("techStacks") || [];
  const goals = watch("learningGoals") || [];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const data = await userService.getUser();
        setUser(data.user);

        // Reset form with fetched data
        const formData = {
          name: data.user.name || "",
          bio: data.user.bio || "",
          developerRole: data.user.developerRole || "",
          experience: data.user.experience || "",
          techStacks: data.user.techStacks || [],
          learningGoals: data.user.learningGoals || [],
          imageUrl: data.user.imageUrl || "",
        };

        reset(formData);
        setProfileImage(data.user.imageUrl || null);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [reset]);

  // Image upload with better error handling
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large (max 5MB)");
      return;
    }

    try {
      setProfileImage(URL.createObjectURL(file));
      setIsUploading(true);

      const url = await uploadImageToCloudinary(file);
      setValue("imageUrl", url, { shouldValidate: true });
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image");
      setProfileImage(user?.imageUrl || null); // Revert on error
    } finally {
      setIsUploading(false);
    }
  };

  // Tech toggle with null safety
  const handleTechToggle = (tech: string) => {
    const current = getValues("techStacks") || [];
    const updated = current.includes(tech)
      ? current.filter((t) => t !== tech)
      : [...current, tech];

    setValue("techStacks", updated, { shouldValidate: true });
  };

  // Goal toggle with null safety
  const handleGoalToggle = (goal: string) => {
    const current = getValues("learningGoals") || [];
    const updated = current.includes(goal)
      ? current.filter((g) => g !== goal)
      : [...current, goal];

    setValue("learningGoals", updated, { shouldValidate: true });
  };

  // Submit with better error handling
  const onSubmit = async (data: ProfileUpdateInput) => {
    try {
      const res = await api.put("/profile/update", data);
      if (res.data.success) {
        toast.success(res.data.message || "Profile updated successfully!");
        dispatch(setOnboardingStatus(false));
        dispatch(setUserProfile(res.data.user));
        router.replace("/profile/me ");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Failed to update profile";
        toast.error(errorMessage);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  // Loading state
  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="min-h-screen flex items-center justify-center py-8 px-4 bg-primary"
    >
      <div className="w-full max-w-2xl mt-10 rounded-2xl shadow-2xl border bg-secondary/30 border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="relative py-6 flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center bg-gray-700">
              <Image
                src={profileImage || "/image/default-profile.jpg"}
                alt="Profile"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
            <label
              htmlFor="profile-upload"
              className="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full cursor-pointer transition-all shadow-lg hover:bg-gray-800"
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
                disabled={isUploading}
              />
            </label>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Full Name */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Full Name *
            </label>
            <input
              {...register("name")}
              className="text-white w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Bio */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-300">
                Short Bio
              </label>
              <span className="text-xs text-gray-500">
                {watch("bio")?.length || 0}/200
              </span>
            </div>
            <textarea
              {...register("bio")}
              placeholder="Tell us about your coding journey..."
              className="w-full text-white p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              maxLength={200}
            />
            {errors.bio && (
              <p className="text-red-400 text-xs mt-1">{errors.bio.message}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Role *
            </label>
            <select
              {...register("developerRole")}
              className="w-full text-white p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select your role</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            {errors.developerRole && (
              <p className="text-red-400 text-xs mt-1">
                {errors.developerRole.message}
              </p>
            )}
          </div>

          {/* Experience */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Experience Level *
            </label>
            <select
              {...register("experience")}
              className="w-full text-white p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select your experience</option>
              {experiences.map((exp) => (
                <option key={exp} value={exp}>
                  {exp}
                </option>
              ))}
            </select>
            {errors.experience && (
              <p className="text-red-400 text-xs mt-1">
                {errors.experience.message}
              </p>
            )}
          </div>

          {/* Tech stack */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tech Stacks
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {techOptions.map((tech) => (
                <button
                  type="button"
                  key={tech}
                  onClick={() => handleTechToggle(tech)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    techStacks.includes(tech)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
            {errors.techStacks && (
              <p className="text-red-400 text-xs">
                {errors.techStacks.message}
              </p>
            )}
          </div>

          {/* Goals */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Learning Goals
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {learningGoals.map((goal) => (
                <button
                  type="button"
                  key={goal}
                  onClick={() => handleGoalToggle(goal)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    goals.includes(goal)
                      ? "bg-purple-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
            {errors.learningGoals && (
              <p role="alert" className="text-red-400 text-xs">
                {errors.learningGoals.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-between">
            <Link href={"/profile/me"}>
              <button
                type="button"
                className="py-2 px-4 border border-border-primary rounded-lg cursor-pointer"
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              disabled={isUploading || isSubmitting}
              className="bg-btn-primary text-white font-medium py-2 px-4 rounded-xl flex items-center justify-center cursor-pointer hover:bg-opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader className="mr-2 animate-spin" size={18} />
              ) : (
                <Save className="mr-2" size={18} />
              )}
              {isSubmitting ? "Updating..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
