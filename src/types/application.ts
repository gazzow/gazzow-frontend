import { ProjectDurationUnit } from "./project";
import { IUser } from "./user";

export interface IApplication {
  id: string;
  projectId: string;
  applicantId: string;
  applicant: Partial<IUser>;
  expectedRate: number;
  status: ApplicationStatus;
  proposal?: string | undefined;
  createdAt: string;
  updatedAt: string;
}

export interface IApplicationWithPopulatedProject
  extends Omit<IApplication, "projectId"> {
  projectId: Partial<ProjectPreviewDTO>;
}

export type ProjectPreviewDTO = {
  id?: string | undefined;
  title?: string | undefined;
  description?: string | undefined;
  budgetMin?: number | undefined;
  budgetMax?: number | undefined;
  durationMin?: number | undefined;
  durationMax?: number | undefined;
  durationUnit?: ProjectDurationUnit | undefined;
};

export enum ApplicationStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}
