import $api from "@/shared/services/service-api";
import { postRequest } from "@/utilities/micro-services";

const routes = {
  generate_api_keys: "tokens/generate",
  fetch_api_keys: "tokens/fetch",
};

export default {
  // ==============================
  // GENERATE API KEYS
  // ==============================
  async generateAPIkeys({ commit }, payload) {
    const response = await postRequest(
      "admin",
      routes.generate_api_keys,
      payload
    );

    [201, 200].includes(response?.code) &&
      commit("SET_API_KEYS", response.data.V_PUBLIC_KEY);
    return response;
  },

  // ==============================
  // FETCH API KEYS
  // ==============================
  async fetchAPIkeys({ commit }, payload) {
    const response = await postRequest("admin", routes.fetch_api_keys, payload);

    [201, 200].includes(response?.code) &&
      commit("SET_API_KEYS_DETAILS", response.data);
    return response;
  },
};
