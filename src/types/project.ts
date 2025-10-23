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
  contributors: IContributor[];
  createdAt: string;
  updatedAt: string;
}

export interface IContributor {
  userId: string;
  status: ContributorStatus;
  invitedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export enum ContributorStatus {
  INVITED = "invited",
  ACTIVE = "active",
  REMOVED = "removed",
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


