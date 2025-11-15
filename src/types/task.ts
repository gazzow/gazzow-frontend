import { IProject } from "./project";
import { IUser } from "./user";

export enum TaskStatus {
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
  projectId: Partial<IProject>;
  assigneeId: Partial<IUser>;
  creatorId: Partial<IUser>;
  description: string;
  estimatedHours: number; // estimated time
  proposedAmount: number; // expectedRate * estimatedHours
  status: TaskStatus;
  priority: TaskPriority;
  documents: IProjectFile[];
  submissionLinks: SubmissionLink[];
  paymentStatus?: PaymentStatus;
  rejectionReason?: string; // reason provided by assignee when declined
  cancellationReason?: string; // for creator/admin cancellation
  revisionCount?: number; // track how many revisions were requested
  ExpiredAt?: string; // record when task expired
  cancelledAt?: string;
  acceptedAt?: string;
  submittedAt?: string;
  completedAt?: string;
  dueDate: string;
  closedAt?: string; // when admin marks as done (after payment)
  paidAt?: string;
  revisions?: Revision[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export const sampleTasks = [
  {
    id: "task-001",
    title: "Write API documentation",
    projectId: "proj-001",
    assigneeId: "user-002",
    creatorId: "user-001",
    description:
      "Document all API endpoints with detailed examples and authentication flow.",
    estimatedHours: 8,
    proposedAmount: 400, // e.g. $50/hr
    status: TaskStatus.ASSIGNED,
    priority: TaskPriority.MEDIUM,
    documents: [],
    submissionLinks: [],
    paymentStatus: PaymentStatus.PENDING,
    dueDate: "2025-11-20",
    isDeleted: false,
    createdAt: "2025-11-01T10:30:00Z",
    updatedAt: "2025-11-01T10:30:00Z",
  },

  {
    id: "task-002",
    title: "Design landing page mockups",
    projectId: "proj-001",
    assigneeId: "user-003",
    creatorId: "user-001",
    description:
      "Create high-fidelity mockups for the new landing page including responsive design and color palette.",
    estimatedHours: 12,
    proposedAmount: 720,
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.HIGH,
    documents: [],
    submissionLinks: [],
    paymentStatus: PaymentStatus.PENDING,
    acceptedAt: "2025-11-03T14:00:00Z",
    dueDate: "2025-11-15",
    isDeleted: false,
    createdAt: "2025-11-02T09:00:00Z",
    updatedAt: "2025-11-06T09:00:00Z",
  },

  {
    id: "task-003",
    title: "Implement authentication system",
    projectId: "proj-002",
    assigneeId: "user-004",
    creatorId: "user-001",
    description:
      "Build user authentication using JWT, Google, and GitHub OAuth integrations. Ensure proper error handling and security.",
    estimatedHours: 16,
    proposedAmount: 960,
    status: TaskStatus.SUBMITTED,
    priority: TaskPriority.HIGH,
    documents: [],
    submissionLinks: [
      {
        label: "GitHub Repo",
        url: "https://github.com/example/auth-system",
        date: "2025-11-10T15:00:00Z",
      },
    ],
    paymentStatus: PaymentStatus.ESCROW_HELD,
    submittedAt: "2025-11-10T15:00:00Z",
    dueDate: "2025-11-12",
    revisionCount: 1,
    isDeleted: false,
    createdAt: "2025-11-03T11:00:00Z",
    updatedAt: "2025-11-10T15:00:00Z",
  },

  {
    id: "task-004",
    title: "Create product demo video",
    projectId: "proj-003",
    assigneeId: "user-003",
    creatorId: "user-001",
    description:
      "Record and edit a 2-minute promotional video demonstrating core product features.",
    estimatedHours: 6,
    proposedAmount: 300,
    status: TaskStatus.COMPLETED,
    priority: TaskPriority.LOW,
    documents: [],
    submissionLinks: [
      {
        label: "GitHub Repo",
        url: "https://github.com/example/auth-system",
        date: "2025-11-10T15:00:00Z",
      },
    ],
    paymentStatus: PaymentStatus.PAID,
    completedAt: "2025-11-09T17:30:00Z",
    paidAt: "2025-11-10T09:00:00Z",
    dueDate: "2025-11-10",
    isDeleted: false,
    createdAt: "2025-10-25T12:00:00Z",
    updatedAt: "2025-11-10T09:00:00Z",
  },

  {
    id: "task-005",
    title: "Optimize database queries",
    projectId: "proj-002",
    assigneeId: "user-004",
    creatorId: "user-001",
    description:
      "Identify slow queries and optimize indexes to improve API response time under heavy load.",
    estimatedHours: 10,
    proposedAmount: 600,
    status: TaskStatus.REVISIONS_REQUESTED,
    priority: TaskPriority.HIGH,
    documents: [],
    submissionLinks: [],
    paymentStatus: PaymentStatus.PENDING,
    revisionCount: 2,
    dueDate: "2025-11-16",
    isDeleted: false,
    createdAt: "2025-11-04T08:30:00Z",
    updatedAt: "2025-11-09T18:00:00Z",
  },

  {
    id: "task-006",
    title: "User analytics integration",
    projectId: "proj-004",
    assigneeId: "user-006",
    creatorId: "user-001",
    description:
      "Integrate Mixpanel and Google Analytics into the dashboard for event tracking.",
    estimatedHours: 9,
    proposedAmount: 540,
    status: TaskStatus.CLOSED,
    priority: TaskPriority.MEDIUM,
    documents: [],
    submissionLinks: [],
    paymentStatus: PaymentStatus.FAILED,
    rejectionReason: "Insufficient time to complete before due date.",
    dueDate: "2025-11-17",
    isDeleted: false,
    createdAt: "2025-11-05T11:00:00Z",
    updatedAt: "2025-11-06T09:00:00Z",
  },

  {
    id: "task-007",
    title: "Create onboarding flow",
    projectId: "proj-005",
    assigneeId: "user-007",
    creatorId: "user-001",
    description:
      "Design and implement a 3-step onboarding flow with contextual tooltips for new users.",
    estimatedHours: 14,
    proposedAmount: 700,
    status: TaskStatus.CANCELLED,
    priority: TaskPriority.LOW,
    documents: [],
    submissionLinks: [],
    paymentStatus: PaymentStatus.FAILED,
    cancellationReason: "Feature de-prioritized for this sprint.",
    cancelledAt: "2025-11-08T10:00:00Z",
    dueDate: "2025-11-18",
    isDeleted: false,
    createdAt: "2025-11-06T09:30:00Z",
    updatedAt: "2025-11-08T10:00:00Z",
  },
];
