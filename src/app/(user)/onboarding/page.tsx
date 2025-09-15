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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OnboardingInput, onboardingSchema } from "@/validators/onboarding";

const roles = ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Software Engineer", "Mobile Developer", "Other"];
const experiences = ["Beginner", "Intermediate", "Expert"];
const techOptions = ["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Express", "MongoDB", "PostgreSQL", "TailwindCSS"];
const learningGoals = ["Improve system design skills", "Learn cloud technologies", "Master modern frameworks", "Get better at Devops"];

export default function ProfileSetup() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { name } = useAppSelector((state) => state.user);

  // RHF setup
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      bio: "",
      developerRole: "",
      experience: "",
      techStacks: [],
      learningGoals: [],
      imageUrl: "",
    },
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Watchers
  const techStacks = watch("techStacks");
  const goals = watch("learningGoals");

  // Image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large (max 5MB)");
      return;
    }

    setProfileImage(URL.createObjectURL(file));
    setIsUploading(true);

    try {
      const url = await uploadImageToCloudinary(file);
      setValue("imageUrl", url, { shouldValidate: true });
      toast.success("Image uploaded!");
    } finally {
      setIsUploading(false);
    }
  };

  // Tech toggle
  const handleTechToggle = (tech: string) => {
    const current = getValues("techStacks");
    if (current.includes(tech)) {
      setValue(
        "techStacks",
        current.filter((t) => t !== tech),
        { shouldValidate: true }
      );
    } else {
      setValue("techStacks", [...current, tech], { shouldValidate: true });
    }
  };

  // Goal toggle
  const handleGoalToggle = (goal: string) => {
    const current = getValues("learningGoals");
    if (current.includes(goal)) {
      setValue(
        "learningGoals",
        current.filter((g) => g !== goal),
        { shouldValidate: true }
      );
    } else {
      setValue("learningGoals", [...current, goal], { shouldValidate: true });
    }
  };

  // Submit
  const onSubmit = async (data: OnboardingInput) => {
    try {
      const res = await axiosUser.put("/profile/setup", data);
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setUserProfile(res.data.user));
        router.replace("/home");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("Something went wrong");
        console.log("onboarding error: ", error);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="min-h-screen flex items-center justify-center py-8 px-4 bg-primary"
    >
      <div className="w-full max-w-2xl rounded-2xl shadow-2xl border bg-secondary/30 border-gray-700 overflow-hidden bg-gray-850">
        {/* Header */}
        <div className="relative py-6 flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-gray-800 overflow-hidden flex items-center justify-center">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <Image src="/images/default-profile.jpg" alt="profile default" fill className="rounded-full object-fit" />
              )}
            </div>
            <label
              htmlFor="profile-upload"
              className="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full cursor-pointer transition-all shadow-lg"
            >
              {isUploading ? <Loader size={16} className="animate-spin" /> : <Camera size={16} />}
              <input id="profile-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome! Lets Setup Your Profile</h2>
          <p className="text-sm text-gray-300 mt-1">Complete your profile to get started</p>
        </div>

        <div className="p-8 space-y-6">
          {/* Full Name */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Full Name</label>
            <input value={name} disabled className="text-white w-full p-3 bg-gray-800 border border-gray-700 rounded-lg disabled:opacity-60" />
          </div>

          {/* Bio */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-300">Short Bio</label>
              <span className="text-xs text-gray-500">{watch("bio")?.length}/200</span>
            </div>
            <textarea
              {...register("bio")}
              placeholder="Tell us about your coding journey..."
              className="w-full text-white p-3 bg-gray-800 border border-gray-700 rounded-lg"
              rows={3}
              maxLength={200}
            />
            {errors.bio && <p className="text-red-400 text-xs mt-1">{errors.bio.message}</p>}
          </div>

          {/* Role */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Role</label>
            <select {...register("developerRole")} className="w-full text-white p-3 rounded-lg bg-gray-800 border border-gray-700">
              <option value="">Select your role</option>
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            {errors.developerRole && <p className="text-red-400 text-xs mt-1">{errors.developerRole.message}</p>}
          </div>

          {/* Experience */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Experience Level</label>
            <select {...register("experience")} className="w-full text-white p-3 rounded-lg bg-gray-800 border border-gray-700">
              <option value="">Select your experience</option>
              {experiences.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
            {errors.experience && <p className="text-red-400 text-xs mt-1">{errors.experience.message}</p>}
          </div>

          {/* Tech stack */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tech Stacks</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {techOptions.map((tech) => (
                <button
                  type="button"
                  key={tech}
                  onClick={() => handleTechToggle(tech)}
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    techStacks.includes(tech) ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300"
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
            {errors.techStacks && <p className="text-red-400 text-xs">{errors.techStacks.message}</p>}
          </div>

          {/* Goals */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Learning Goals</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {learningGoals.map((goal) => (
                <button
                  type="button"
                  key={goal}
                  onClick={() => handleGoalToggle(goal)}
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    goals.includes(goal) ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-300"
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
            {errors.learningGoals && <p role="alert" className="text-red-400 text-xs">{errors.learningGoals.message}</p>}
          </div>

          {/* Submit */}
          <button type="submit" className="w-full bg-btn-primary text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center">
            <Save className="mr-2" size={20} />
            Finish Setup
          </button>
        </div>
      </div>
    </form>
  );
}
