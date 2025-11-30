import { IProject } from "./project";
import { IUser } from "./user";

export enum TaskStatus {
  UNASSIGNED = "unassigned",
  ASSIGNED = "assigned",
  IN_PROGRESS = "in_progress",
  SUBMITTED = "submitted",
  REVISIONS_REQUESTED = "revisions_requested",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  CLOSED = "closed",
}

export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  ESCROW_HELD = "escrow_held",
  RELEASED = "released",
  REFUNDED = "refunded",
  FAILED = "failed",
}

export type SubmissionLink = {
  url: string;
  label: string;
  date: string;
};

export type Revision = {
  message: string;
  date: string;
};

export type IProjectFile = {
  key: string;
  name: string;
};

export interface ITask {
  id: string;
  title: string;
  project: Partial<IProject>;
  assignee?: Partial<IUser>;
  creator: Partial<IUser>;
  description: string;
  expectedRate: number;
  estimatedHours: number; // estimated time
  proposedAmount: number; // expectedRate * estimatedHours
  status: TaskStatus;
  priority: TaskPriority;
  documents: IProjectFile[];
  submissionLinks: SubmissionLink[];
  paymentStatus?: PaymentStatus;
  cancellationReason?: string; // for creator/admin cancellation
  revisionCount?: number; // track how many revisions were requested
  expiredAt?: Date; // record when task expired
  acceptedAt?: Date;
  cancelledAt?: Date;
  submittedAt?: Date;
  completedAt?: Date;
  dueDate: Date;
  closedAt?: Date; // when admin marks as done (after payment)
  paidAt?: Date;

  revisions?: Revision[];

  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
