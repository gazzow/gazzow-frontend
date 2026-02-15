import { ContributorStatus } from "./contributor";

export interface IProject {
  id: string;
  title: string;
  creatorId: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  requiredSkills: string[];
  developersNeeded: number;
  durationMin: number;
  durationMax: number;
  durationUnit: ProjectDurationUnit;
  experience: ProjectExperience;
  visibility: ProjectVisibility;
  status: ProjectStatus;
  contributors: Contributor[];
  documents: IProjectFile[];
  createdAt: string;
  updatedAt: string;
}

export interface Contributor {
  userId: string;
  status: ContributorStatus;
  invitedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IProjectFile {
  key: string;
  name: string;
}

export enum ProjectVisibility {
  PUBLIC = "public",
  INVITE = "invite",
}

export enum ProjectStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

export enum ProjectExperience {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  EXPERT = "expert",
}

export enum ProjectDurationUnit {
  WEEKS = "weeks",
  MONTHS = "months",
}

export enum Role {
  VIEWER = "viewer",
  CREATOR = "creator",
  CONTRIBUTOR = "contributor",
}

export interface IAggregatedProject extends IProject {
  isFavorite: boolean;
  applicationCount: number;
  creator: {
    name: string;
    imageUrl: string;
  }
}

export interface IPopulatedContributor {
  id: string;
  userId: string;
  name: string;
  email: string;
  imageUrl: string;
  developerRole: string;
  status: ContributorStatus;
  expectedRate: number;
  invitedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectFilters = {
  experience?: string;
  budgetOrder?: "asc" | "desc";
};
