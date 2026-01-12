export const FAVORITE_API = {
  LIST_FAVORITES: (skip: number, limit: number) =>
    `/favorites?skip=${skip}&limit=${limit}`,
  MARK_AS_FAVORITE: "/favorites",
  REMOVE_FAVORITE: (projectId: string) => `/favorites/${projectId}`,
};
