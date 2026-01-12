// utils/task-permissions.ts

import { AssigneeStatus, TaskStatus } from "@/types/task";

export const canReassignTask = (
  status: TaskStatus,
  assigneeStatus: AssigneeStatus
) => {
  return (
    status === TaskStatus.TODO && assigneeStatus === AssigneeStatus.ASSIGNED
  );
};
