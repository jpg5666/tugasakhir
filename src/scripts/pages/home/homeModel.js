import { fetchAllStories } from "../../data/api.js";

async function fetchStoriesWithLocation() {
  const stories = await fetchAllStories({ location: 1 });
  return stories.filter((story) => story.lat !== null && story.lon !== null);
}

export const homeModel = {
  fetchStoriesWithLocation,
};
