"use Client";

import { projectService } from "@/services/user/project-service";
import axios from "axios";
import { Send, X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

interface ApplyModalProp {
  projectId: string;
  closeModal(val: boolean): void;
}

export default function ApplyModal({ projectId, closeModal }: ApplyModalProp) {
  const [proposal, setProposal] = useState("");
  const [expectedRate, setExpectedRate] = useState<number | "">("");

  const onSubmit = async () => {
    if (!expectedRate || expectedRate <= 0) {
      alert("Please enter a valid rate");
      return;
    }

    console.log("Project application submitting for Id: ", projectId);
    try {
      const res = await projectService.applyProject(
        { proposal, expectedRate },
        projectId
      );
      console.log("Response Data: ", res);
      toast.success(res.message || "Application Submitted");
      closeModal(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || "Apply project Error");
        closeModal(false);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 w-full min-h-screen flex items-center justify-center"
      onClick={() => closeModal(false)}
    >
      <div
        className="max-w-xl min-w-sm p-6 flex flex-col gap-4 bg-secondary text-text-primary rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className=" flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Apply to project</h1>
          <button onClick={() => closeModal(false)}>
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
            onChange={(e) => setProposal(e.target.value)}
          />
        </div>

        {/* Rate */}
        <div className="flex flex-col gap-2">
          <label htmlFor="expectedRate">Expected Rate ($/Hour)</label>
          <input
            type="number"
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-btn-primary"
            value={expectedRate}
            onChange={(e) => setExpectedRate(Number(e.target.value))}
            min={1}
          />
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end gap-4">
          <button
            className="border py-2 px-4 rounded cursor-pointer"
            onClick={() => closeModal(false)}
          >
            Cancel
          </button>
          <button
            className="py-2 px-4 flex items-center bg-btn-primary rounded gap-2 cursor-pointer"
            onClick={onSubmit}
          >
            <Send size={16} /> <span>Apply</span>
          </button>
        </div>
      </div>
    </div>
  );
}
