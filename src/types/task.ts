import { IProject } from "./project";
import { IUser } from "./user";

export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  SUBMITTED = "submitted",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  CLOSED = "closed",
  REVISIONS_REQUESTED = "revisions_requested",
}

export enum AssigneeStatus {
  UNASSIGNED = "unassigned",
  ASSIGNED = "assigned",
}

export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export enum TaskPaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  ESCROW_HELD = "escrow_held",
  RELEASED = "released",
  FAILED = "failed",
}

export enum RefundStatus {
  NONE = "none",
  PENDING = "pending",
  REFUNDED = "refunded",
  SUCCESS = "success",
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
  totalAmount: number; // estimatedAmount * expectedRate
  amountInEscrow: number; // Amount in escrow
  balance: number; // Balance amount to pay
  refundAmount: number;
  refundStatus: RefundStatus;
  status: TaskStatus;
  assigneeStatus: AssigneeStatus;
  priority: TaskPriority;
  documents: IProjectFile[];
  submissionLinks: SubmissionLink[];
  paymentStatus?: TaskPaymentStatus;
  cancellationReason?: string; // for creator/admin cancellation
  revisionCount?: number; // track how many revisions were requested
  expiredAt?: Date; // record when task expired
  acceptedAt?: Date;
  cancelledAt?: Date;
  submittedAt?: Date;
  completedAt?: Date;
  reassignedAt?: Date;
  dueDate: Date;
  closedAt?: Date; // when admin marks as done (after payment)
  paidAt?: Date;

  revisions?: Revision[];

  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
