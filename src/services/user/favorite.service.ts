import { FAVORITE_API } from "@/constants/apis/favorite-api";
import api from "@/lib/axios/api";

export const favoriteService = {
  async listFavorites() {
    const res = await api.get(FAVORITE_API.LIST_FAVORITES);
    console.log("list favorites response: ", res);
    return res.data;
  },
  async markAsFavorite(projectId: string) {
    const res = await api.post(FAVORITE_API.MARK_AS_FAVORITE, { projectId });
    console.log("Mark As favorite response: ", res);
    return res.data;
  },
  async removeFromFavorite(projectId: string) {
    const res = await api.delete(FAVORITE_API.REMOVE_FAVORITE(projectId));
    console.log("Remove favorite response: ", res);
    return res.data;
  },
};
