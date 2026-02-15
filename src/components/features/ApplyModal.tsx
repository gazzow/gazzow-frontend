"use client";

import { projectService } from "@/services/user/project-service";
import axios from "axios";
import { Send, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

import { useForm, SubmitHandler } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { applyProjectSchema } from "@/validators/apply-project";

type ApplyProjectFormInput = z.input<typeof applyProjectSchema>;
type ApplyProjectFormOutput = z.output<typeof applyProjectSchema>;

interface ApplyModalProp {
  projectId: string;
  closeModal(): void;
}

export default function ApplyModal({ projectId, closeModal }: ApplyModalProp) {
  const modalRef = useRef<HTMLDivElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ApplyProjectFormInput, unknown, ApplyProjectFormOutput>({
    resolver: zodResolver(applyProjectSchema),
  });

  useEffect(() => {
    const handleModalClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleModalClick);
    return () => document.removeEventListener("mousedown", handleModalClick);
  }, [closeModal]);

  const onSubmit: SubmitHandler<ApplyProjectFormOutput> = async (data) => {
    try {
      const res = await projectService.createApplication(data, projectId);

      toast.success(res.message || "Application submitted");
      closeModal();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || "Apply project error");
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-md flex items-center justify-center cursor-default"
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative z-[10000] max-w-xl min-w-sm p-6 flex flex-col gap-4 bg-primary text-text-primary rounded-lg"
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Apply to project</h1>
          <button onClick={closeModal}>
            <X className="cursor-pointer text-gray-300" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Proposal */}
          <div className="flex flex-col gap-2">
            <label>Project Proposal (Optional)</label>
            <textarea
              {...register("proposal")}
              rows={4}
              className="p-2 border border-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-btn-primary"
            />
            {errors.proposal && (
              <p className="text-red-500 text-sm">{errors.proposal.message}</p>
            )}
          </div>

          {/* Expected Rate */}
          <div className="flex flex-col gap-2">
            <label>Expected Rate ($/Hour)</label>
            <input
              type="number"
              {...register("expectedRate")}
              className="p-2 border border-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-btn-primary"
            />
            {errors.expectedRate && (
              <p className="text-red-500 text-sm">
                {errors.expectedRate.message}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="pt-2 flex justify-end gap-4">
            <button
              type="button"
              onClick={closeModal}
              className="border py-1 px-2 rounded border-border-primary hover:border-gray-500 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="py-1 px-2 flex items-center bg-btn-primary rounded gap-2 cursor-pointer"
            >
              <Send size={16} />
              <span>{isSubmitting ? "Applying..." : "Apply"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
