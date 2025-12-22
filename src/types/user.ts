export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  googleId?: string;
  provider: Provider;
  bio?: string;
  developerRole?: string;
  imageUrl: string;
  experience?: string;
  techStacks?: string[];
  learningGoals?: string[];
  stripeAccountId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export enum UserStatus {
  ACTIVE = "active",
  BLOCKED = "blocked",
}

export enum Provider {
  LOCAL = "local",
  GOOGLE = "google",
}

