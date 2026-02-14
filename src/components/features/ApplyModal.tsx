"use Client";

import { projectService } from "@/services/user/project-service";
import axios from "axios";
import { Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

interface ApplyModalProp {
  projectId: string;
  closeModal(): void;
}

export default function ApplyModal({ projectId, closeModal }: ApplyModalProp) {
  const [proposal, setProposal] = useState("");
  const [expectedRate, setExpectedRate] = useState<number | "">("");
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleModalClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleModalClick);

    return () => document.removeEventListener("mousedown", handleModalClick);
  }, [closeModal]);

  const onSubmit = async () => {
    if (!expectedRate || expectedRate <= 0) {
      alert("Please enter a valid rate");
      return;
    }

    try {
      const res = await projectService.createApplication(
        { proposal, expectedRate },
        projectId,
      );
      console.log("Response Data: ", res);
      toast.success(res.message || "Application Submitted");
      closeModal();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || "Apply project Error");
        closeModal();
      }
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 w-full min-h-screen flex items-center justify-center"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div
        ref={modalRef}
        className="max-w-xl min-w-sm p-6 flex flex-col gap-4 bg-secondary text-text-primary rounded-lg"
      >
        {/* Header */}
        <div className=" flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Apply to project</h1>
          <button onClick={closeModal}>
            <X className="cursor-pointer text-gray-300" />
          </button>
        </div>

        {/* Proposal */}
        <div className="flex flex-col gap-2">
          <label htmlFor="proposal">Project Proposal (Optional)</label>
          <textarea
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-btn-primary"
            rows={4}
            value={proposal}
            onChange={(e) => {
              console.log("proposal message triggers");
              e.stopPropagation();
              e.preventDefault();
              setProposal(e.target.value);
            }}
          />
        </div>

        {/* Rate */}
        <div className="flex flex-col gap-2">
          <label htmlFor="expectedRate">Expected Rate ($/Hour)</label>
          <input
            type="number"
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-btn-primary"
            value={expectedRate}
            onChange={(e) => {
              console.log("expectedRate triggers");
              e.stopPropagation();
              e.preventDefault();
              setExpectedRate(Number(e.target.value));
            }}
            min={1}
          />
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end gap-4">
          <button
            className="border py-1 px-2 rounded border-border-primary hover:border-gray-500 cursor-pointer transition ease-in"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            className="py-1 px-2 flex items-center bg-btn-primary rounded gap-2 cursor-pointer"
            onClick={onSubmit}
          >
            <Send size={16} /> <span>Apply</span>
          </button>
        </div>
      </div>
    </div>
  );
}
