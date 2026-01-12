
export interface IContributor {
  id: string;
  userId: string;
  name: string;
  email: string;
  status: ContributorStatus;
  imageUrl: string;
  expectedRate: number;
  developerRole: string;
  invitedAt?: string;
  createdAt: string;
  updatedAt: string;
}


export enum ContributorStatus {
  ACTIVE = "active",
  REMOVED = "removed",
  IN_ACTIVE = "in_active",
}
