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

export enum ApplicationStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}
