export const FAVORITE_API = {
  LIST_FAVORITES: "/favorites",
  MARK_AS_FAVORITE: "/favorites",
  REMOVE_FAVORITE: (projectId: string) => `/favorites/${projectId}`,
};
