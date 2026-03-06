import { TaskStatus } from "./task";

export interface IReview {
  id: string;
  taskId: string;
  projectId: string;
  reviewerId: string;
  contributorId: string;
  rating: number;
  review: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}


export interface IAggregatedReview {
  id: string;
  rating: number;
  review: string;
  reviewer: {
    id: string;
    name: string;
  };
  task: {
    id: string;
    title: string;
    status: TaskStatus;
  };
}
