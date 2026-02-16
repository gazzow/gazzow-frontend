import { IAggregatedProject } from "./project";

export interface IFavorite {
  id: string;
  userId: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPopulatedFavorite extends Omit<IFavorite, "projectId"> {
  project: IAggregatedProject;
}
