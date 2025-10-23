import { useAppSelector } from "@/store/store";
import { IProject } from "@/types/project";
import { Role } from "@/types/user";

export const useRole = (project?: IProject | null): Role => {
  const user = useAppSelector((state) => state.user);
  const userId = user?.id ?? null;

  const isCreator = project?.creatorId === userId;
  const isContributor =
    project?.contributors?.some(
      (contributor) => contributor.userId === userId
    ) ?? false;

  const currentRole = isCreator
    ? Role.CREATOR
    : isContributor
    ? Role.CONTRIBUTOR
    : Role.VIEWER;
  return currentRole;
};
