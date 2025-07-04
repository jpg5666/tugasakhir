import { loginUser } from "../../data/api.js";
import { authModel } from "../../data/authModel.js";

export const loginModel = {
  async loginUserAndSaveToken(email, password) {
    const result = await loginUser(email, password);
    if (!result.error && result.loginResult?.token) {
      authModel.saveToken(result.loginResult.token);
    }
    return result;
  },
};
