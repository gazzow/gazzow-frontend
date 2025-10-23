"use client";

import ApplyModal from "@/components/features/ApplyModal";
import ProjectTabs from "@/components/features/ProjectTabs";
import { LoadingSpinner } from "@/components/layout/LoadingSpinner";
import { projectTabPermissions } from "@/constants/common/tab-permission";
import { useRole } from "@/hook/useRole";
import { projectService } from "@/services/user/project-service";
import { IProject } from "@/types/project";
import { Role } from "@/types/user";
import axios from "axios";
import { ArrowLeft, Calendar, DollarSign, Users } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const tabRoutes = [
  { name: "Overview", path: "" },
  { name: "Applications", path: "/applications" },
  { name: "Tasks", path: "/tasks" },
  { name: "Team Chat", path: "/chat" },
  { name: "Meetings", path: "/meetings" },
  { name: "Payments", path: "/payments" },
];

export default function ProjectDetails() {
  const { projectId } = useParams<{ projectId: string }>();
  const router = useRouter();

  const [project, setProject] = useState<IProject | null>(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [applyModal, setApplyModal] = useState(false);

  const currentRole = useRole(project);

  const visibleTabs = useMemo(() => {
    if (!projectId) return [];
    return tabRoutes
      .filter((tab) => projectTabPermissions[currentRole].includes(tab.name))
      .map((tab) => ({
        name: tab.name,
        href: `/projects/${projectId}${tab.path}`,
      }));
  }, [projectId, currentRole]);

  useEffect(() => {
    if (!projectId) return;

    const fetchProjects = async () => {
      try {
        console.log("projectId: ", projectId);
        const res = await projectService.getProject(projectId);
        if (res.success) {
          console.log("res data: ", res.data);
          setProject(res.data);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.message);
        }
      }
    };
    fetchProjects();
  }, [projectId]);

  const handleGoBack = () => {
    router.back();
  };

  const handleConfirmModal = () => {
    setConfirmModal(true);
  };

  const handleApplyModal = () => {
    setApplyModal(!applyModal);
  };

  if (!projectId) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl w-full shadow-lg space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 w-full">
          <button onClick={handleGoBack} className="cursor-pointer">
            <ArrowLeft />
          </button>
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl md:text-3xl font-semibold ">
              {project?.title}
            </h1>
            <p className="text-sm text-gray-400">Posted 1/15/2024</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ProjectTabs tabs={visibleTabs} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section */}
        <div className="col-span-2 space-y-8">
          {/* Project Description */}
          <div className="bg-secondary/30 border border-border-primary p-6 rounded-2xl shadow-lg">
            <h2 className="text-lg font-semibold mb-3">Project Description</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              We’re looking for an experienced React Native developer to build a
              comprehensive e-commerce mobile application. The app should
              include user authentication, product catalog, shopping cart,
              payment integration, and order management.
              <br />
              <br />
              <strong>Key Features Required:</strong> User registration and
              authentication, product browsing, shopping cart and wishlist,
              secure payment processing (Stripe integration), order tracking,
              push notifications, and an admin panel for inventory management.
              <br />
              <br />
              The ideal candidate should have: 3+ years of React Native
              experience, familiarity with REST APIs and backend integration,
              experience with Redux/Context API, and app store deployment.
            </p>
          </div>

          {/* Required Skills */}
          <div className="bg-secondary/30 border border-border-primary p-6 rounded-2xl shadow-lg">
            <h2 className="text-lg font-semibold mb-3">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {[
                "React Native",
                "Node.js",
                "MongoDB",
                "Payment Gateway",
                "Redux",
                "TypeScript",
              ].map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-sm bg-gray-800 rounded-full border border-gray-700 hover:border-gray-500 cursor-pointer"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          {/* Project Info */}
          <div className="bg-secondary/30 border border-border-primary p-6 rounded-2xl shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Budget</h2>
              <div className="flex items-center text-gray-300">
                <DollarSign className="w-4 h-4 mr-1 text-green-400" />
                <span>3,500 - 5,500</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Deadline</h2>
              <div className="flex items-center text-gray-300">
                <Calendar className="w-4 h-4 mr-1 text-blue-400" />
                <span>03/09/2025</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Applicants</h2>
              <div className="flex items-center text-gray-300">
                <Users className="w-4 h-4 mr-1 text-purple-400" />
                <span>12 Applied</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Status</h2>
              <span className="text-green-400 font-medium">Open</span>
            </div>

            <div className="flex space-x-3 pt-4">
              {currentRole === Role.CREATOR ? (
                <>
                  <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium cursor-pointer">
                    Edit Project
                  </button>
                  <button
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium cursor-pointer"
                    onClick={handleConfirmModal}
                  >
                    Delete
                  </button>
                </>
              ) : currentRole === Role.CONTRIBUTOR ? null : (
                <button
                  className="flex-1 bg-btn-primary hover:bg-btn-primary text-white py-2 rounded-lg font-medium cursor-pointer"
                  onClick={handleApplyModal}
                >
                  Apply
                </button>
              )}
            </div>
          </div>

          {/* Suggested Contributors */}
          <div className="bg-secondary/30 border border-border-primary p-6 rounded-2xl shadow-lg">
            <h2 className="text-lg font-semibold mb-3">
              Suggested Contributors
            </h2>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-300" />
              <div>
                <h3 className="font-medium">Maria Garcia</h3>
                <p className="text-sm text-gray-400">
                  Senior Frontend Engineer
                </p>
                <div className="flex gap-2 mt-1">
                  {["React", "TypeScript", "Next.js"].map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-gray-800 px-2 py-0.5 rounded-full border border-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Confirm Delete Modal */}
          {confirmModal && (
            <div className="fixed inset-0 bg-primary/60  flex justify-center items-center">
              <div className="bg-white dark:bg-secondary p-4 rounded shadow flex flex-col">
                <p className="font-bold text-black dark:text-white">
                  Are you sure you want to delete this project?
                </p>
                <div className="flex justify-end gap-4 mt-4">
                  <button
                    className="bg-red-400 text-white py-1 px-4 rounded cursor-pointer"
                    onClick={() => setConfirmModal(false)}
                  >
                    No
                  </button>
                  <button className="bg-green-400 py-1 px-4 rounded text-gray-950 cursor-pointer">
                    Yes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Apply Modal */}
          {applyModal && (
            <ApplyModal
              projectId={projectId}
              key={projectId}
              closeModal={handleApplyModal}
            ></ApplyModal>
          )}
        </div>
      </div>
    </div>
  );
}
