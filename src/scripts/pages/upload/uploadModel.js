import { uploadStory } from "../../data/api.js";

export const uploadModel = {
  async executeUpload(formData) {
    return await uploadStory(formData);
  },
};

export function navigateToHome() {
  window.location.hash = "#/home";
}
