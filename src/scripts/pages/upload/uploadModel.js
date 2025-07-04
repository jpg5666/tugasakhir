import { uploadStory } from "../../data/api.js";

export const uploadModel = {
  async uploadStoryData(formData) {
    return await uploadStory(formData);
  },
};

export function redirectToHome() {
  window.location.hash = "#/home";
}
