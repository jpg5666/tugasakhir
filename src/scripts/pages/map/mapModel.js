import { fetchAllStories } from "../../data/api.js";

export const mapModel = {
  async getStoriesWithLocation() {
    const stories = await fetchAllStories({ location: 1 });
    return stories.filter((s) => s.lat !== null && s.lon !== null);
  },
};
