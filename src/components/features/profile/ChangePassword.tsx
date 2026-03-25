import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChangePasswordFormData,
  changePasswordSchema,
} from "@/validators/change-password";
import { userService } from "@/services/user/user.service";
import { toast } from "react-toastify";
import { handleApiError } from "@/utils/handleApiError";

export default function ChangePassword() {
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      setIsSubmitting(true);

      console.log("Validated Data:", data);
      const res = await userService.changePassword(data);
      if (res.success) {
        toast(res.message);
        reset();
      }
    } catch (error) {
      console.error("change password error: ", error);
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const InputField = ({
    label,
    name,
    typeKey,
  }: {
    label: string;
    name: keyof ChangePasswordFormData;
    typeKey: "current" | "new" | "confirm";
  }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
        {label}
      </label>

      <div className="relative group">
        <input
          type={show[typeKey] ? "text" : "password"}
          {...register(name)}
          className={`
          w-full h-11
          bg-gray-50 dark:bg-gray-900/70
          border border-gray-200 dark:border-gray-700
          rounded-lg
          px-4 pr-10
          text-sm
          text-gray-900 dark:text-gray-100
          placeholder:text-gray-400
          
          focus:outline-none
          focus:ring-2 focus:ring-purple-500/70
          focus:border-purple-500/50
          
          transition-all duration-200
          
          group-hover:border-gray-300 dark:group-hover:border-gray-600
        `}
        />

        <button
          type="button"
          onClick={() =>
            setShow((prev) => ({
              ...prev,
              [typeKey]: !prev[typeKey],
            }))
          }
          className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
        >
          {show[typeKey] ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {errors[name] && (
        <p className="text-xs text-red-500 dark:text-red-400 mt-0.5">
          {errors[name]?.message}
        </p>
      )}
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-4xl bg-white dark:bg-secondary/60 border border-gray-200 dark:border-gray-800 rounded-xl p-5 sm:p-6 space-y-6 shadow-sm dark:shadow-none transition-colors"
    >
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-purple-500" />
          Change Password
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Update your account password securely
        </p>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <InputField
          label="Current Password"
          name="currentPassword"
          typeKey="current"
        />

        <InputField label="New Password" name="newPassword" typeKey="new" />

        <InputField
          label="Confirm Password"
          name="confirmPassword"
          typeKey="confirm"
        />
      </div>

      {/* Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-lg cursor-pointer transition-all"
        >
          {isSubmitting ? "Updating..." : "Update Password"}
        </button>
      </div>
    </form>
  );
}
