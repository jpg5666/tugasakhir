import { fetchAllStories } from "../../data/api.js";

function timeout(ms) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), ms));
}

async function fetchStoriesWithLocation() {
  const stories = await Promise.race([fetchAllStories({ location: 1 }), timeout(7000)]);
  return stories.filter((story) => story.lat !== null && story.lon !== null);
}

export const homeModel = {
  fetchStoriesWithLocation,
};
